<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewReviewNotificationMail;
use App\Models\Business;
use App\Models\BusinessReview;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BusinessReviewController extends Controller
{
    /**
     * Merr të gjitha vlerësimet dhe përshtypjet për një biznes.
     */
    public function index(string $idOrSlug): JsonResponse
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

        $reviews = BusinessReview::with('user:id,name')
            ->where('business_id', $business->id)
            ->latest()
            ->get();

        $count = $reviews->count();
        $average = $count > 0 ? round((float) $reviews->avg('rating'), 1) : null;

        $distribution = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'status' => 'success',
            'business_id' => $business->id,
            'count' => $count,
            'average' => $average,
            'distribution' => $distribution,
            'data' => $reviews,
        ]);
    }

    /**
     * Shton ose përditëson vlerësimin e përdoruesit të kyçur për një biznes.
     */
    public function store(Request $request, string $idOrSlug): JsonResponse
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

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ], [
            'rating.required' => 'Ju lutem jepni një vlerësim me yje nga 1 në 5.',
            'rating.integer' => 'Vlerësimi duhet të jetë numër i plotë.',
            'rating.min' => 'Vlerësimi minimal është 1 yll.',
            'rating.max' => 'Vlerësimi maksimal është 5 yje.',
            'comment.max' => 'Komenti nuk mund të ketë më shumë se 1000 karaktere.',
        ]);

        $user = $request->user();

        $review = BusinessReview::updateOrCreate(
            [
                'business_id' => $business->id,
                'user_id' => $user->id,
            ],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        $review->load('user:id,name');

        // Llogarit mesataren e re
        $allReviews = BusinessReview::where('business_id', $business->id)->get();
        $count      = $allReviews->count();
        $average    = round((float) $allReviews->avg('rating'), 1);

        // ✉️ Dërgo email notifikim tek administratori
        $review->load(['business.category', 'user']);
        $adminEmail = env('ADMIN_NOTIFICATION_EMAIL', 'blinkrasniqi824@gmail.com');

        try {
            Mail::to($adminEmail)->send(new NewReviewNotificationMail($review, true));
        } catch (\Throwable $e) {
            Log::error('NewReviewNotificationMail (admin) dështoi: ' . $e->getMessage());
        }

        // ✉️ Dërgo email notifikim tek pronari i biznesit (nëse ka dhe nuk është i njëjti person)
        try {
            if ($business->owner_id) {
                $owner = User::find($business->owner_id);
                if ($owner && $owner->email && $owner->id !== $user->id) {
                    Mail::to($owner->email)->send(new NewReviewNotificationMail($review, false));
                }
            }
        } catch (\Throwable $e) {
            Log::error('NewReviewNotificationMail (owner) dështoi: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Vlerësimi juaj u ruajt me sukses.',
            'data' => $review,
            'average' => $average,
            'count' => $count,
        ]);
    }

    /**
     * Fshin vlerësimin e përdoruesit të kyçur për biznesin.
     */
    public function destroy(Request $request, string $idOrSlug): JsonResponse
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

        $user = $request->user();

        BusinessReview::where('business_id', $business->id)
            ->where('user_id', $user->id)
            ->delete();

        $allReviews = BusinessReview::where('business_id', $business->id)->get();
        $count = $allReviews->count();
        $average = $count > 0 ? round((float) $allReviews->avg('rating'), 1) : null;

        return response()->json([
            'status' => 'success',
            'message' => 'Vlerësimi juaj u fshi me sukses.',
            'average' => $average,
            'count' => $count,
        ]);
    }

    /**
     * Merr të gjitha vlerësimet për panelin administrativ (moderim).
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = BusinessReview::with([
            'user:id,name,email',
            'business:id,name,slug,category_id',
            'business.category:id,name',
        ])->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('business', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($rating = $request->input('rating')) {
            $query->where('rating', (int) $rating);
        }

        $reviews = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $reviews->items(),
            'total' => $reviews->total(),
            'current_page' => $reviews->currentPage(),
            'last_page' => $reviews->lastPage(),
        ]);
    }

    /**
     * Fshin një vlerësim nga administratori (moderim).
     */
    public function adminDestroy(int $id): JsonResponse
    {
        $review = BusinessReview::find($id);

        if (! $review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vlerësimi nuk u gjet.',
            ], 404);
        }

        $review->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vlerësimi u fshi nga administratori.',
        ]);
    }
}

