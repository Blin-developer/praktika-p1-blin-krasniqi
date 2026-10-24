<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserFavoriteController extends Controller
{
    /**
     * Merr listën e bizneseve të ruajtura nga përdoruesi aktual i autentikuar.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $favorites = $user->favoriteBusinesses()
            ->with(['category:id,name,slug', 'settlement:id,name,slug', 'services:id,name,slug'])
            ->orderBy('user_favorites.created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $favorites->count(),
            'data' => $favorites,
        ]);
    }

    /**
     * Ndryshon (toggle) gjendjen e ruajtjes së një biznesi nga përdoruesi.
     */
    public function toggle(Request $request, int $businessId): JsonResponse
    {
        $business = Business::find($businessId);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $user = $request->user();
        $isFavorited = $user->favoriteBusinesses()->where('business_id', $businessId)->exists();

        if ($isFavorited) {
            $user->favoriteBusinesses()->detach($businessId);
            $saved = false;
            $message = "Biznesi '{$business->name}' u hoq nga lista e ruajtur.";
        } else {
            $user->favoriteBusinesses()->attach($businessId);
            $saved = true;
            $message = "Biznesi '{$business->name}' u ruajt me sukses.";
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'is_saved' => $saved,
            'business_id' => $businessId,
        ]);
    }

    /**
     * Fshin një biznes nga lista e ruajtur.
     */
    public function destroy(Request $request, int $businessId): JsonResponse
    {
        $user = $request->user();
        $user->favoriteBusinesses()->detach($businessId);

        return response()->json([
            'status' => 'success',
            'message' => 'Biznesi u hoq nga lista e ruajtur.',
        ]);
    }
}
