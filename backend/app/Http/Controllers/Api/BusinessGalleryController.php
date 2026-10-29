<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessMenuItem;
use App\Models\BusinessPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class BusinessGalleryController extends Controller
{
    /**
     * Verifikon nëse përdoruesi është admin ose pronar i këtij biznesi.
     */
    protected function authorizeBusinessManagement(Request $request, Business $business): bool
    {
        $user = $request->user();
        if (! $user) {
            return false;
        }

        $isAdmin = (bool) ($user->is_admin ?? false);
        $isOwner = $business->owner_id && (int) $business->owner_id === (int) $user->id;

        return $isAdmin || $isOwner;
    }

    // ==========================================
    // GALERIA E FOTOVE (PHOTOS)
    // ==========================================

    /**
     * Merr të gjitha fotot e një biznesi.
     */
    public function photos(string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();
        $photos = $business->photos;

        return response()->json([
            'status' => 'success',
            'business_id' => $business->id,
            'business_name' => $business->name,
            'count' => $photos->count(),
            'data' => $photos,
        ]);
    }

    /**
     * Shton një foto të re në galeri (URL ose upload skedari).
     */
    public function storePhoto(Request $request, string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();

        if (! $this->authorizeBusinessManagement($request, $business)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të shtuar foto në këtë biznes.',
            ], 403);
        }

        $imageUrl = $request->input('image_url');

        // Nëse vjen si skedar imazhi i ngarkuar direkt nga kompjuteri
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
                'caption' => ['nullable', 'string', 'max:255'],
            ]);

            /** @var UploadedFile $file */
            $file = $request->file('image');
            $ext = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = 'biz_' . $business->id . '_' . time() . '_' . uniqid() . '.' . $ext;
            $file->storeAs('businesses/gallery', $filename, 'public');
            $imageUrl = asset('storage/businesses/gallery/' . $filename);
        } else {
            $request->validate([
                'image_url' => ['required', 'string', 'max:1000'],
                'caption' => ['nullable', 'string', 'max:255'],
            ]);
        }

        $photo = BusinessPhoto::create([
            'business_id' => $business->id,
            'image_url' => $imageUrl,
            'caption' => $request->input('caption'),
            'is_primary' => $request->boolean('is_primary', false),
            'sort_order' => (int) $request->input('sort_order', 0),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Fotoja u shtua me sukses në galeri.',
            'data' => $photo,
        ], 201);
    }

    /**
     * Fshin një foto nga galeria.
     */
    public function deletePhoto(Request $request, int $photoId): JsonResponse
    {
        $photo = BusinessPhoto::findOrFail($photoId);
        $business = $photo->business;

        if (! $this->authorizeBusinessManagement($request, $business)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të fshirë këtë foto.',
            ], 403);
        }

        $photo->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Fotoja u fshi me sukses nga galeria.',
        ]);
    }

    // ==========================================
    // MENYJA DIGJITALE (DIGITAL MENU)
    // ==========================================

    /**
     * Merr menynë digjitale të një biznesi.
     */
    public function menuItems(string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();
        $items = $business->menuItems;

        // Grupo sipas kategorive të menysë
        $grouped = $items->groupBy('menu_category');

        return response()->json([
            'status' => 'success',
            'business_id' => $business->id,
            'business_name' => $business->name,
            'count' => $items->count(),
            'data' => $items,
            'grouped' => $grouped,
        ]);
    }

    /**
     * Shton një artikull të ri në menynë digjitale.
     */
    public function storeMenuItem(Request $request, string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();

        if (! $this->authorizeBusinessManagement($request, $business)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të menaxhuar menynë e këtij biznesi.',
            ], 403);
        }

        $validated = $request->validate([
            'menu_category' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'is_vegetarian' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_available' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $item = $business->menuItems()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Artikulli u shtua në meny me sukses.',
            'data' => $item,
        ], 201);
    }

    /**
     * Përditëson një artikull ekzistues të menysë.
     */
    public function updateMenuItem(Request $request, int $itemId): JsonResponse
    {
        $item = BusinessMenuItem::findOrFail($itemId);
        $business = $item->business;

        if (! $this->authorizeBusinessManagement($request, $business)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të modifikuar këtë artikull.',
            ], 403);
        }

        $validated = $request->validate([
            'menu_category' => ['sometimes', 'required', 'string', 'max:100'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'is_vegetarian' => ['boolean'],
            'is_popular' => ['boolean'],
            'is_available' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $item->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Artikulli i menysë u përditësua me sukses.',
            'data' => $item,
        ]);
    }

    /**
     * Fshin një artikull nga menyja.
     */
    public function deleteMenuItem(Request $request, int $itemId): JsonResponse
    {
        $item = BusinessMenuItem::findOrFail($itemId);
        $business = $item->business;

        if (! $this->authorizeBusinessManagement($request, $business)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nuk keni autorizim për të fshirë këtë artikull.',
            ], 403);
        }

        $item->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Artikulli u fshi nga menyja.',
        ]);
    }
}

