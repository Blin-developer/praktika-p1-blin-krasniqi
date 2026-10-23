<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBusinessController extends Controller
{
    /**
     * Listo të gjitha bizneset për administratorin me mundësi kërkimi, filtrimi dhe faqosjeje.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Business::with(['category', 'settlement', 'services']);

        // Kërkimi me fjalë kyçe
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Filtri sipas statusit
        if ($status = $request->input('status')) {
            if (in_array($status, ['published', 'draft', 'archived'], true)) {
                $query->where('status', $status);
            }
        }

        // Filtri sipas kategorisë
        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filtri sipas vendbanimit
        if ($settlementId = $request->input('settlement_id')) {
            $query->where('settlement_id', $settlementId);
        }

        // Renditja sipas id-së (më të rejat të parat si parazgjedhje)
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = strtolower($request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (in_array($sortBy, ['id', 'name', 'status', 'created_at', 'updated_at'], true)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'desc');
        }

        $counts = [
            'all' => Business::count(),
            'published' => Business::where('status', 'published')->count(),
            'draft' => Business::where('status', 'draft')->count(),
            'archived' => Business::where('status', 'archived')->count(),
        ];

        // Opsioni për të marrë të gjitha pa faqosje
        if ($request->boolean('all') || $request->input('per_page') === 'all') {
            $businesses = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $businesses,
                'counts' => $counts,
                'meta' => [
                    'total' => $businesses->count(),
                    'per_page' => $businesses->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                ],
            ]);
        }

        $perPage = max(1, min(100, (int) $request->input('per_page', 10)));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $paginated->items(),
            'counts' => $counts,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
        ]);
    }

    /**
     * Shfaq të dhënat e plota të një biznesi specifik.
     */
    public function show(int $id): JsonResponse
    {
        $business = Business::with(['category', 'settlement', 'services'])->find($id);

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

    /**
     * Krijon një biznes të ri në bazën e të dhënave.
     */
    public function store(Request $request): JsonResponse
    {
        $this->normalizeWebsite($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'settlement_id' => ['required', 'integer', 'exists:settlements,id'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'website' => ['nullable', 'url', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['required', 'in:draft,published,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.*' => ['nullable', 'string', 'max:100'],
            'services' => ['nullable', 'array'],
            'services.*' => ['integer', 'exists:services,id'],
        ], [
            'name.required' => 'Emri i biznesit është i detyrueshëm.',
            'name.max' => 'Emri nuk mund të jetë më i gjatë se 150 karaktere.',
            'category_id.required' => 'Zgjedhja e kategorisë është e detyrueshme.',
            'category_id.exists' => 'Kategoria e përzgjedhur nuk ekziston.',
            'settlement_id.required' => 'Zgjedhja e vendbanimit është e detyrueshme.',
            'settlement_id.exists' => 'Vendbanimi i përzgjedhur nuk ekziston.',
            'email.email' => 'Ju lutem jepni një adresë email të vlefshme.',
            'website.url' => 'Ju lutem jepni një adresë website të vlefshme (p.sh. https://shembull.com).',
            'status.required' => 'Statusi i biznesit është i detyrueshëm.',
            'status.in' => 'Statusi duhet të jetë draft, published ose archived.',
            'services.*.exists' => 'Një nga shërbimet e përzgjedhura nuk ekziston.',
        ]);

        $validated['slug'] = $this->generateUniqueSlug($validated['name']);
        $validated['is_featured'] = $request->boolean('is_featured');

        $serviceIds = $validated['services'] ?? [];
        unset($validated['services']);

        $business = Business::create($validated);

        if (! empty($serviceIds)) {
            $business->services()->sync($serviceIds);
        }

        $business->load(['category', 'settlement', 'services']);

        return response()->json([
            'status' => 'success',
            'message' => 'Biznesi u krijua me sukses.',
            'data' => $business,
        ], 201);
    }

    /**
     * Përditëson një biznes ekzistues.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $business = Business::find($id);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $this->normalizeWebsite($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'settlement_id' => ['required', 'integer', 'exists:settlements,id'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'website' => ['nullable', 'url', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['required', 'in:draft,published,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'opening_hours' => ['nullable', 'array'],
            'opening_hours.*' => ['nullable', 'string', 'max:100'],
            'services' => ['nullable', 'array'],
            'services.*' => ['integer', 'exists:services,id'],
        ], [
            'name.required' => 'Emri i biznesit është i detyrueshëm.',
            'name.max' => 'Emri nuk mund të jetë më i gjatë se 150 karaktere.',
            'category_id.required' => 'Zgjedhja e kategorisë është e detyrueshme.',
            'category_id.exists' => 'Kategoria e përzgjedhur nuk ekziston.',
            'settlement_id.required' => 'Zgjedhja e vendbanimit është e detyrueshme.',
            'settlement_id.exists' => 'Vendbanimi i përzgjedhur nuk ekziston.',
            'email.email' => 'Ju lutem jepni një adresë email të vlefshme.',
            'website.url' => 'Ju lutem jepni një adresë website të vlefshme (p.sh. https://shembull.com).',
            'status.required' => 'Statusi i biznesit është i detyrueshëm.',
            'status.in' => 'Statusi duhet të jetë draft, published ose archived.',
            'services.*.exists' => 'Një nga shërbimet e përzgjedhura nuk ekziston.',
        ]);

        // Nëse emri ka ndryshuar, rigjenero slug-un unik
        if ($validated['name'] !== $business->name) {
            $validated['slug'] = $this->generateUniqueSlug($validated['name'], $business->id);
        }

        $validated['is_featured'] = $request->boolean('is_featured');

        $serviceIds = $validated['services'] ?? null;
        unset($validated['services']);

        $business->update($validated);

        if (is_array($serviceIds)) {
            $business->services()->sync($serviceIds);
        }

        $business->load(['category', 'settlement', 'services']);

        return response()->json([
            'status' => 'success',
            'message' => 'Biznesi u përditësua me sukses.',
            'data' => $business,
        ]);
    }

    /**
     * Ndryshon me shpejtësi statusin e një biznesi.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $business = Business::find($id);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:draft,published,archived'],
        ], [
            'status.required' => 'Statusi është i detyrueshëm.',
            'status.in' => 'Statusi duhet të jetë draft, published ose archived.',
        ]);

        $business->update(['status' => $validated['status']]);
        $business->load(['category', 'settlement', 'services']);

        return response()->json([
            'status' => 'success',
            'message' => "Statusi i biznesit u ndryshua me sukses në '{$validated['status']}'.",
            'data' => $business,
        ]);
    }

    /**
     * Fshin një biznes nga baza e të dhënave.
     */
    public function destroy(int $id): JsonResponse
    {
        $business = Business::find($id);

        if (! $business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        // Shkëput lidhjet me shërbimet dhe fshij biznesin
        $business->services()->detach();
        $business->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Biznesi u fshi me sukses.',
        ]);
    }

    /**
     * Gjeneron një slug unik bazuar në emër.
     */
    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name) ?: 'biznes';
        $slug = $baseSlug;
        $counter = 1;

        while (
            Business::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $counter++;
            $slug = "{$baseSlug}-{$counter}";
        }

        return $slug;
    }

    /**
     * Normalizon URL-në e website-it duke shtuar skemën https:// nëse mungon.
     */
    protected function normalizeWebsite(Request $request): void
    {
        $website = $request->input('website');

        if ($website && is_string($website)) {
            $trimmed = trim($website);
            if ($trimmed !== '' && ! preg_match('~^https?://~i', $trimmed)) {
                $request->merge(['website' => 'https://'.$trimmed]);
            }
        }
    }
}
