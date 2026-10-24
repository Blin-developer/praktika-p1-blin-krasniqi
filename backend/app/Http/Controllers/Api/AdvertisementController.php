<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    /**
     * Listo vetëm reklamat aktive që plotësojnë kushtet kohore dhe të biznesit.
     */
    public function index(Request $request): JsonResponse
    {
        $position = $request->input('position');
        $categoryId = $request->input('category');

        $query = Advertisement::with([
            'business' => function ($q) {
                $q->select('id', 'name', 'slug', 'category_id', 'settlement_id', 'address', 'phone', 'website', 'logo_path', 'status')
                  ->with(['category:id,name,slug', 'settlement:id,name,slug']);
            },
            'category:id,name,slug',
        ])->active($position);

        if ($categoryId) {
            $query->where(function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId)
                  ->orWhereHas('business', function ($bq) use ($categoryId) {
                      if (is_numeric($categoryId)) {
                          $bq->where('category_id', $categoryId);
                      } else {
                          $bq->whereHas('category', fn ($cq) => $cq->where('slug', $categoryId));
                      }
                  });
            });
        }

        $limit = $request->integer('limit', 10);
        $ads = $query->take(max(1, min($limit, 20)))->get();

        return response()->json([
            'status' => 'success',
            'count' => $ads->count(),
            'data' => $ads,
        ]);
    }

    /**
     * Regjistron një klikim real të vërtetuar në backend.
     */
    public function trackClick(int $id): JsonResponse
    {
        $ad = Advertisement::find($id);

        if (! $ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reklama nuk u gjet.',
            ], 404);
        }

        $ad->increment('clicks');

        return response()->json([
            'status' => 'success',
            'message' => 'Klikimi u regjistrua.',
            'clicks' => $ad->clicks,
        ]);
    }

    /**
     * Regjistron një shikim (impression) të reklamës.
     */
    public function trackImpression(int $id): JsonResponse
    {
        $ad = Advertisement::find($id);

        if ($ad) {
            $ad->increment('impressions');
        }

        return response()->json([
            'status' => 'success',
        ]);
    }
}
