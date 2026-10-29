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
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->published();

        // Filtro sipas fjalës kyçe (emër, përshkrim, adresë, ose shërbim)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhereHas('services', function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%")
                         ->orWhere('slug', 'like', "%{$search}%");
                  });
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

        // Filtro sipas shërbimit (slug ose ID)
        if ($service = $request->input('service')) {
            $query->whereHas('services', function ($q) use ($service) {
                if (is_numeric($service)) {
                    $q->where('services.id', $service);
                } else {
                    $q->where('services.slug', $service);
                }
            });
        }

        // Filtro sipas prezencës së uebfaqes
        if ($request->has('website') || $request->has('has_website')) {
            $websiteFilter = $request->input('website') ?? $request->input('has_website');
            if (in_array($websiteFilter, ['yes', '1', 'with', 'true'], true)) {
                $query->whereNotNull('website')->where('website', '!=', '');
            } elseif (in_array($websiteFilter, ['no', '0', 'without', 'false'], true)) {
                $query->where(function ($q) {
                    $q->whereNull('website')->orWhere('website', '');
                });
            }
        }

        // Filtro sipas orarit të punës
        if ($request->has('schedule') || $request->has('has_schedule')) {
            $scheduleFilter = $request->input('schedule') ?? $request->input('has_schedule');
            if (in_array($scheduleFilter, ['yes', '1', 'with', 'true'], true)) {
                $query->whereNotNull('opening_hours');
            } elseif (in_array($scheduleFilter, ['no', '0', 'without', 'false'], true)) {
                $query->whereNull('opening_hours');
            }
        }

        // Filtro vetëm bizneset e veçuara
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Renditja: mbështetje për renditjen sipas vlerësimit me yje (Më të Vlerësuarat)
        $sort = $request->input('sort');
        if (in_array($sort, ['top_rated', 'rating'], true)) {
            $query->orderByRaw('reviews_avg_rating IS NULL, reviews_avg_rating DESC')
                ->orderByDesc('reviews_count')
                ->orderBy('name', 'asc');
        } else {
            $query->orderBy('is_featured', 'desc')
                ->orderBy('name', 'asc');
        }

        $businesses = $query->get();

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
        $business = Business::with(['category', 'settlement', 'services', 'reviews.user:id,name', 'photos', 'menuItems'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
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
