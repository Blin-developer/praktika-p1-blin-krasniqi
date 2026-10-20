<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Autentikon administratorin dhe kthen Sanctum token.
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

        if (! $user->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Qasja e paautorizuar. Vetëm administratorët mund të kyçen.',
            ], 403);
        }

        $token = $user->createToken('admin-api-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Kyçja u krye me sukses.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Kthen të dhënat e administratorit të autentikuar.
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
                'is_admin' => $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Shkyç administratorin duke shkatërruar token-in aktual të Sanctum.
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
