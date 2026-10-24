<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Autentikon administratorin dhe kthen Sanctum token.
     * Nëse thirret nga portali i zakonshëm me 'portal' => 'user', lejon çdo përdorues të vlefshëm.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Fusha e email-it është e detyrueshme.',
            'email.email' => 'Ju lutem jepni një adresë email të vlefshme.',
            'password.required' => 'Fusha e fjalëkalimit është e detyrueshme.',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kredencialet e dhëna nuk janë të sakta.',
            ], 401);
        }

        // Nëse nuk është specifikuar portali i përdoruesit, kërkohet roli admin për mbrojtje
        $isUserPortal = $request->input('portal') === 'user' || $request->boolean('is_user');
        if (! $isUserPortal && ! $user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Qasja e paautorizuar. Vetëm administratorët mund të kyçen.',
            ], 403);
        }

        $tokenName = $user->isAdmin() ? 'admin-api-token' : 'user-api-token';
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Kyçja u krye me sukses.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Kyçje e dedikuar për përdoruesit e zakonshëm të platformës.
     */
    public function userLogin(Request $request): JsonResponse
    {
        $request->merge(['portal' => 'user']);
        return $this->login($request);
    }

    /**
     * Regjistrimi publik i përdoruesve të rinj.
     * Rregull kritike: Përdoruesi regjistrohet gjithmonë me is_admin = false.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Emri dhe mbiemri janë të detyrueshëm.',
            'name.max' => 'Emri nuk mund të jetë më i gjatë se 100 karaktere.',
            'email.required' => 'Adresa e email-it është e detyrueshme.',
            'email.email' => 'Ju lutem jepni një adresë email të vlefshme.',
            'email.unique' => 'Kjo adresë email tashmë është e regjistruar në sistem.',
            'password.required' => 'Fjalëkalimi është i detyrueshëm.',
            'password.min' => 'Fjalëkalimi duhet të ketë së paku 8 karaktere.',
            'password.confirmed' => 'Konfirmimi i fjalëkalimit nuk përputhet.',
        ]);

        // Siguri: Roli admin NUK lejohet të caktohet përmes regjistrimit publik
        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'is_admin' => false,
        ]);

        $token = $user->createToken('user-api-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Llogaria juaj u krijua me sukses! Mirë se vini në platformë.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => false,
            ],
        ], 201);
    }

    /**
     * Kthen të dhënat e përdoruesit / administratorit të autentikuar.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Përditëson të dhënat e profilit personal të përdoruesit.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email,' . $user->id],
        ], [
            'name.required' => 'Emri është i detyrueshëm.',
            'email.required' => 'Email-i është i detyrueshëm.',
            'email.email' => 'Ju lutem jepni një adresë email të vlefshme.',
            'email.unique' => 'Ky email tashmë po përdoret nga një llogari tjetër.',
        ]);

        $user->name = $validated['name'];
        $user->email = strtolower(trim($validated['email']));
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profili u përditësua me sukses.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool) $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Ndryshon fjalëkalimin e përdoruesit në mënyrë të sigurt.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Fjalëkalimi aktual është i detyrueshëm.',
            'password.required' => 'Fjalëkalimi i ri është i detyrueshëm.',
            'password.min' => 'Fjalëkalimi i ri duhet të ketë së paku 8 karaktere.',
            'password.confirmed' => 'Konfirmimi i fjalëkalimit nuk përputhet.',
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fjalëkalimi aktual nuk është i saktë.',
                'errors' => [
                    'current_password' => ['Fjalëkalimi aktual nuk përputhet me llogarinë tuaj.'],
                ],
            ], 422);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Fjalëkalimi u ndryshua me sukses.',
        ], 200);
    }

    /**
     * Shkyç përdoruesin duke shkatërruar token-in aktual të Sanctum.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Shkyçja u krye me sukses.',
        ], 200);
    }
}
