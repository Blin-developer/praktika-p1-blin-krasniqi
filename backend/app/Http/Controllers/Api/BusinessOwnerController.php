<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessOwnerController extends Controller
{
    /**
     * Merr listën e bizneseve ku përdoruesi aktual është pronar i verifikuar.
     */
    public function myBusinesses(Request $request): JsonResponse
    {
        $user = $request->user();

        $businesses = Business::with(['category', 'settlement', 'services'])
            ->where('owner_id', $user->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $businesses->count(),
            'data' => $businesses,
        ]);
    }

    /**
     * Merr të dhënat e biznesit për editim nga pronari.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $business = Business::with(['category', 'settlement', 'services'])->find($id);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        if ($business->owner_id !== $user->id && ! $user->is_admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të menaxhuar këtë biznes.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $business,
        ]);
    }

    /**
     * Përditëson të dhënat e biznesit nga vetë pronari i verifikuar.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $business = Business::find($id);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        if ($business->owner_id !== $user->id && ! $user->is_admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të menaxhuar këtë biznes.',
            ], 403);
        }

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:5000'],
            'opening_hours' => ['nullable', 'array'],
            'services' => ['nullable', 'array'],
            'services.*' => ['integer', 'exists:services,id'],
        ], [
            'email.email' => 'Formati i email-it nuk është i saktë.',
            'short_description.max' => 'Përshkrimi i shkurtër nuk mund të kalojë 500 karaktere.',
            'description.max' => 'Përshkrimi i plotë nuk mund të kalojë 5000 karaktere.',
        ]);

        $business->update([
            'phone' => $validated['phone'] ?? $business->phone,
            'email' => $validated['email'] ?? $business->email,
            'website' => $validated['website'] ?? $business->website,
            'address' => $validated['address'] ?? $business->address,
            'short_description' => $validated['short_description'] ?? $business->short_description,
            'description' => $validated['description'] ?? $business->description,
            'opening_hours' => $validated['opening_hours'] ?? $business->opening_hours,
        ]);

        if (array_key_exists('services', $validated)) {
            $business->services()->sync($validated['services'] ?? []);
        }

        $business->load(['category', 'settlement', 'services']);

        return response()->json([
            'status' => 'success',
            'message' => 'Të dhënat e biznesit u përditësuan me sukses!',
            'data' => $business,
        ]);
    }
}

