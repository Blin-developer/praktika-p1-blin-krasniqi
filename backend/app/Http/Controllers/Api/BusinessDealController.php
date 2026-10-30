<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewDealCreatedMail;
use App\Models\Business;
use App\Models\BusinessDeal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BusinessDealController extends Controller
{
    /**
     * Merr të gjitha ofertat dhe zbritjet aktive në Komunën e Lipjanit (për Faqen Kryesore dhe Katalog).
     */
    public function publicDeals(Request $request): JsonResponse
    {
        $query = BusinessDeal::with([
            'business:id,name,slug,category_id,settlement_id,phone,address,latitude,longitude,is_featured',
            'business.category:id,name,slug',
            'business.settlement:id,name,slug',
        ])
            ->active()
            ->latest();

        // Filtro sipas kategorisë nëse specifikohet
        if ($request->filled('category')) {
            $catSlug = $request->query('category');
            $query->whereHas('business.category', function ($q) use ($catSlug) {
                $q->where('slug', $catSlug);
            });
        }

        // Filtro me kërkim teksti
        if ($request->filled('search')) {
            $term = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhereHas('business', function ($bq) use ($term) {
                        $bq->where('name', 'like', $term);
                    });
            });
        }

        $limit = min((int) $request->query('limit', 12), 50);
        $deals = $query->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'count' => $deals->count(),
            'data' => $deals,
        ]);
    }

    /**
     * Merr ofertat aktive për një biznes specifik (në Profilin e Biznesit).
     */
    public function businessDeals(string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $deals = BusinessDeal::where('business_id', $business->id)
            ->active()
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'business_id' => $business->id,
            'business_name' => $business->name,
            'count' => $deals->count(),
            'data' => $deals,
        ]);
    }

    /**
     * Lista administrative e të gjitha ofertave (për Admin Panel).
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = BusinessDeal::with([
            'business:id,name,slug,category_id,settlement_id',
            'business.category:id,name,slug',
            'business.settlement:id,name,slug',
        ])->latest();

        if ($request->filled('status')) {
            if ($request->query('status') === 'active') {
                $query->active();
            } elseif ($request->query('status') === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('business_id')) {
            $query->where('business_id', $request->query('business_id'));
        }

        if ($request->filled('search')) {
            $term = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('discount_badge', 'like', $term)
                    ->orWhereHas('business', function ($bq) use ($term) {
                        $bq->where('name', 'like', $term);
                    });
            });
        }

        $deals = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $deals->items(),
            'meta' => [
                'current_page' => $deals->currentPage(),
                'last_page' => $deals->lastPage(),
                'total' => $deals->total(),
                'per_page' => $deals->perPage(),
            ],
        ]);
    }

    /**
     * Krijon një ofertë të re (nga Admini ose Pronari i Verifikuar i Biznesit).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => ['required', 'exists:businesses,id'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'discount_badge' => ['required', 'string', 'max:50'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'deal_price' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
        ]);

        $user = $request->user();
        $business = Business::findOrFail($validated['business_id']);

        // Verifiko autorizimin: vetëm Admini ose Pronari i këtij biznesi mund të postojë ofertë
        $isAdmin = (bool) ($user->is_admin ?? false);
        $isOwner = $business->owner_id && (int) $business->owner_id === (int) $user->id;

        if (! $isAdmin && ! $isOwner) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të postuar oferta për këtë biznes.',
            ], 403);
        }

        $deal = BusinessDeal::create($validated);
        $deal->load('business:id,name,slug');

        // ✉️ Dërgo email notifikim tek administratori
        $adminEmail = env('ADMIN_NOTIFICATION_EMAIL', 'blinkrasniqi16@gmail.com');
        try {
            Mail::to($adminEmail)->send(new NewDealCreatedMail($deal));
        } catch (\Throwable $e) {
            Log::error('NewDealCreatedMail dështoi: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Oferta u krijua me sukses.',
            'data' => $deal,
        ], 201);
    }

    /**
     * Përditëson një ofertë ekzistuese.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $deal = BusinessDeal::findOrFail($id);
        $business = $deal->business;
        $user = $request->user();

        $isAdmin = (bool) ($user->is_admin ?? false);
        $isOwner = $business && $business->owner_id && (int) $business->owner_id === (int) $user->id;

        if (! $isAdmin && ! $isOwner) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të modifikuar këtë ofertë.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'discount_badge' => ['sometimes', 'required', 'string', 'max:50'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'deal_price' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
        ]);

        $deal->update($validated);
        $deal->load('business:id,name,slug');

        return response()->json([
            'status' => 'success',
            'message' => 'Oferta u përditësua me sukses.',
            'data' => $deal,
        ]);
    }

    /**
     * Fshin një ofertë.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $deal = BusinessDeal::findOrFail($id);
        $business = $deal->business;
        $user = $request->user();

        $isAdmin = (bool) ($user->is_admin ?? false);
        $isOwner = $business && $business->owner_id && (int) $business->owner_id === (int) $user->id;

        if (! $isAdmin && ! $isOwner) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të fshirë këtë ofertë.',
            ], 403);
        }

        $deal->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Oferta u fshi me sukses.',
        ]);
    }
}

