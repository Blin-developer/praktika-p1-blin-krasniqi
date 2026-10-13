<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    /**
     * Listo të gjitha bizneset e publikuara me mundësi filtrimi dhe kërkimi.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::with(['category', 'settlement', 'services'])
            ->published();

        // Filtro sipas fjalës kyçe (emër, përshkrim, adresë)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filtro sipas kategorisë (slug ose ID)
        if ($category = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                if (is_numeric($category)) {
                    $q->where('id', $category);
                } else {
                    $q->where('slug', $category);
                }
            });
        }

        // Filtro sipas vendbanimit (slug ose ID)
        if ($settlement = $request->input('settlement')) {
            $query->whereHas('settlement', function ($q) use ($settlement) {
                if (is_numeric($settlement)) {
                    $q->where('id', $settlement);
                } else {
                    $q->where('slug', $settlement);
                }
            });
        }

        // Filtro vetëm bizneset e veçuara
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $businesses = $query->orderBy('is_featured', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'count' => $businesses->count(),
            'data' => $businesses,
        ]);
    }

    /**
     * Merr detajet e një biznesi specifik sipas ID ose slug.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $business = Business::with(['category', 'settlement', 'services'])
            ->published()
            ->where(function ($q) use ($idOrSlug) {
                if (is_numeric($idOrSlug)) {
                    $q->where('id', $idOrSlug);
                } else {
                    $q->where('slug', $idOrSlug);
                }
            })
            ->first();

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $business,
        ]);
    }
}
