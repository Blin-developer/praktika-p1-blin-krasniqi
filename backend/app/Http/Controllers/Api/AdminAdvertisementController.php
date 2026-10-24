<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAdvertisementController extends Controller
{
    /**
     * Listo të gjitha reklamat për panelin administrativ me filtra dhe përmbledhje të statuseve.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Advertisement::with(['business:id,name,slug,status,category_id', 'category:id,name,slug']);

        // Kërkim me tekst
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('business', fn ($bq) => $bq->where('name', 'like', "%{$search}%"));
            });
        }

        // Filtër sipas pozicionit
        if ($position = $request->input('position')) {
            $query->where('position', $position);
        }

        // Filtër sipas statusit të ruajtur
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Statistikat e plota për të gjitha reklamat
        $counts = [
            'all' => Advertisement::count(),
            'active' => Advertisement::where('status', 'active')->where('is_active', true)->count(),
            'scheduled' => Advertisement::where('status', 'scheduled')->count(),
            'expired' => Advertisement::where('status', 'expired')
                ->orWhere(fn ($q) => $q->whereNotNull('end_at')->where('end_at', '<', now()))
                ->count(),
            'draft' => Advertisement::where('status', 'draft')->count(),
            'disabled' => Advertisement::where('status', 'disabled')->orWhere('is_active', false)->count(),
        ];

        $perPage = $request->integer('per_page', 15);
        $ads = $query->orderBy('priority', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'counts' => $counts,
            'data' => $ads->items(),
            'meta' => [
                'current_page' => $ads->currentPage(),
                'last_page' => $ads->lastPage(),
                'per_page' => $ads->perPage(),
                'total' => $ads->total(),
            ],
        ]);
    }

    /**
     * Krijon një reklamë të re.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => ['required', 'integer', 'exists:businesses,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'cta_text' => ['nullable', 'string', 'max:60'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'position' => ['required', 'string', 'in:homepage_featured,sponsored_businesses,category_promotion,sidebar_banner'],
            'status' => ['required', 'string', 'in:draft,scheduled,active,expired,disabled'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'is_active' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer'],
        ], [
            'business_id.required' => 'Zgjedhja e biznesit është e detyrueshme.',
            'business_id.exists' => 'Biznesi i zgjedhur nuk ekziston.',
            'title.required' => 'Titulli i reklamës është i detyrueshëm.',
            'position.required' => 'Pozicioni i reklamës është i detyrueshëm.',
            'position.in' => 'Pozicioni i zgjedhur nuk është i vlefshëm.',
            'end_at.after_or_equal' => 'Data e përfundimit duhet të jetë pas datës së fillimit.',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['priority'] = (int) ($validated['priority'] ?? 0);
        $validated['cta_text'] = $validated['cta_text'] ?? 'Shiko biznesin';

        $ad = Advertisement::create($validated);
        $ad->load(['business:id,name,slug,status,category_id', 'category:id,name,slug']);

        return response()->json([
            'status' => 'success',
            'message' => 'Reklama u krijua me sukses.',
            'data' => $ad,
        ], 201);
    }

    /**
     * Shfaq detajet e një reklame.
     */
    public function show(int $id): JsonResponse
    {
        $ad = Advertisement::with(['business', 'category'])->find($id);

        if (! $ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reklama nuk u gjet.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $ad,
        ]);
    }

    /**
     * Përditëson një reklamë ekzistuese.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $ad = Advertisement::find($id);

        if (! $ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reklama nuk u gjet.',
            ], 404);
        }

        $validated = $request->validate([
            'business_id' => ['required', 'integer', 'exists:businesses,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'cta_text' => ['nullable', 'string', 'max:60'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'position' => ['required', 'string', 'in:homepage_featured,sponsored_businesses,category_promotion,sidebar_banner'],
            'status' => ['required', 'string', 'in:draft,scheduled,active,expired,disabled'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'is_active' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer'],
        ], [
            'business_id.required' => 'Zgjedhja e biznesit është e detyrueshme.',
            'business_id.exists' => 'Biznesi i zgjedhur nuk ekziston.',
            'title.required' => 'Titulli i reklamës është i detyrueshëm.',
            'position.required' => 'Pozicioni i reklamës është i detyrueshëm.',
            'end_at.after_or_equal' => 'Data e përfundimit duhet të jetë pas datës së fillimit.',
        ]);

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $ad->update($validated);
        $ad->load(['business:id,name,slug,status,category_id', 'category:id,name,slug']);

        return response()->json([
            'status' => 'success',
            'message' => 'Reklama u përditësua me sukses.',
            'data' => $ad,
        ]);
    }

    /**
     * Ndryshon me shpejtësi aktivizimin ose statusin e reklamës.
     */
    public function toggle(Request $request, int $id): JsonResponse
    {
        $ad = Advertisement::find($id);

        if (! $ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reklama nuk u gjet.',
            ], 404);
        }

        if ($request->has('is_active')) {
            $ad->is_active = $request->boolean('is_active');
            if (! $ad->is_active && $ad->status === 'active') {
                $ad->status = 'disabled';
            } elseif ($ad->is_active && $ad->status === 'disabled') {
                $ad->status = 'active';
            }
        }

        if ($request->has('status') && in_array($request->input('status'), ['draft', 'scheduled', 'active', 'expired', 'disabled'], true)) {
            $ad->status = $request->input('status');
        }

        $ad->save();
        $ad->load(['business:id,name,slug,status,category_id', 'category:id,name,slug']);

        return response()->json([
            'status' => 'success',
            'message' => 'Gjendja e reklamës u ndryshua me sukses.',
            'data' => $ad,
        ]);
    }

    /**
     * Fshin një reklamë nga baza e të dhënave.
     */
    public function destroy(int $id): JsonResponse
    {
        $ad = Advertisement::find($id);

        if (! $ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reklama nuk u gjet.',
            ], 404);
        }

        $ad->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reklama u fshi me sukses.',
        ]);
    }
}
