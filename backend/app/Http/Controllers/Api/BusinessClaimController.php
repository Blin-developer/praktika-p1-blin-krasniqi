<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ClaimStatusUpdatedMail;
use App\Mail\ClaimSubmittedAdminMail;
use App\Models\Business;
use App\Models\BusinessClaim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BusinessClaimController extends Controller
{
    /**
     * Kontrollon statusin e kërkesës së përdoruesit për pronësi të këtij biznesi.
     */
    public function checkStatus(Request $request, string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (! $business) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $user    = $request->user('sanctum') ?: $request->user();
        $isOwner = $business->owner_id && $user && (int) $business->owner_id === (int) $user->id;

        $userClaim = null;
        if ($user) {
            $userClaim = BusinessClaim::where('business_id', $business->id)
                ->where('user_id', $user->id)
                ->latest()
                ->first();
        }

        return response()->json([
            'status'                => 'success',
            'business_id'           => $business->id,
            'is_claimed'            => (bool) $business->owner_id,
            'is_current_user_owner' => $isOwner,
            'user_claim'            => $userClaim,
        ]);
    }

    /**
     * Dërgon një kërkesë të re për marrjen e pronësisë së biznesit ("Claim Business").
     * Dërgon email notifikim tek administratori.
     */
    public function store(Request $request, string $idOrSlug): JsonResponse
    {
        $business = Business::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (! $business) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Biznesi nuk u gjet.',
            ], 404);
        }

        $user = $request->user();

        // Nëse biznesi ka tashmë pronar të verifikuar
        if ($business->owner_id) {
            if ($business->owner_id === $user->id) {
                return response()->json([
                    'status'  => 'info',
                    'message' => 'Ju tashmë jeni pronari i verifikuar i këtij biznesi.',
                ]);
            }

            return response()->json([
                'status'  => 'error',
                'message' => 'Ky biznes ka tashmë një pronar të verifikuar në sistem. Nëse mendoni se ka ndodhur gabim, kontaktoni administratën e komunës.',
            ], 422);
        }

        // Kontrollo nëse përdoruesi ka tashmë një kërkesë 'pending'
        $existingPending = BusinessClaim::where('business_id', $business->id)
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return response()->json([
                'status'  => 'warning',
                'message' => 'Ju tashmë keni dërguar një kërkesë për këtë biznes, e cila është në pritje të shqyrtimit nga administratori.',
                'claim'   => $existingPending,
            ], 422);
        }

        $validated = $request->validate([
            'full_name'          => ['required', 'string', 'max:255'],
            'phone'              => ['required', 'string', 'max:50'],
            'email'              => ['required', 'email', 'max:255'],
            'business_role'      => ['required', 'string', 'max:100'],
            'verification_notes' => ['required', 'string', 'max:2000'],
        ], [
            'full_name.required'          => 'Ju lutem shënoni emrin dhe mbiemrin tuaj të plotë.',
            'phone.required'              => 'Numri i telefonit është i detyrueshëm për verifikim.',
            'email.required'              => 'Email adresa është e detyrueshme.',
            'business_role.required'      => 'Ju lutem specifikoni rolin tuaj në biznes (p.sh. Pronar, Menaxher).',
            'verification_notes.required' => 'Ju lutem jepni dëshmi ose informacione verifikuese (p.sh. Numrin Unik Identifikues / NUI të ARBK-së).',
        ]);

        $claim = BusinessClaim::create([
            'business_id'        => $business->id,
            'user_id'            => $user->id,
            'full_name'          => $validated['full_name'],
            'phone'              => $validated['phone'],
            'email'              => $validated['email'],
            'business_role'      => $validated['business_role'],
            'verification_notes' => $validated['verification_notes'],
            'status'             => 'pending',
        ]);

        // ✉️ Dërgo email notifikim tek administratori
        $claim->load(['business.category', 'user']);
        $adminEmail = config('mail.admin_notification_email', env('ADMIN_NOTIFICATION_EMAIL', 'blinkrasniqi824@gmail.com'));

        try {
            Mail::to($adminEmail)->send(new ClaimSubmittedAdminMail($claim));
        } catch (\Throwable $e) {
            Log::error('ClaimSubmittedAdminMail dështoi: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Kërkesa juaj për pronësi u dërgua me sukses! Administrata e Komunës do ta shqyrtojë dhe do t\'ju njoftojë.',
            'data'    => $claim,
        ], 201);
    }

    /**
     * Merr të gjitha kërkesat e pronësisë për panelin administrativ.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = BusinessClaim::with([
            'business:id,name,slug,category_id,phone,address',
            'business.category:id,name',
            'user:id,name,email',
            'reviewer:id,name',
        ])->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('verification_notes', 'like', "%{$search}%")
                  ->orWhereHas('business', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $claims = $query->paginate(15);

        return response()->json([
            'status'       => 'success',
            'data'         => $claims->items(),
            'total'        => $claims->total(),
            'current_page' => $claims->currentPage(),
            'last_page'    => $claims->lastPage(),
        ]);
    }

    /**
     * Aprovon kërkesën për pronësi: biznesi i caktohet përdoruesit të aprovuar.
     * Dërgon email notifikim tek aplikanti.
     */
    public function adminApprove(Request $request, int $id): JsonResponse
    {
        $claim = BusinessClaim::with(['business.category', 'user'])->find($id);

        if (! $claim) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kërkesa nuk u gjet.',
            ], 404);
        }

        $admin      = $request->user();
        $adminNotes = $request->input('admin_notes');

        $claim->status      = 'approved';
        $claim->admin_notes = $adminNotes;
        $claim->reviewed_by = $admin->id;
        $claim->reviewed_at = now();
        $claim->save();

        // Cakto pronarin në biznes
        if ($claim->business) {
            $claim->business->owner_id = $claim->user_id;
            $claim->business->save();

            // Refuzo automatikisht kërkesat e tjera 'pending' për këtë biznes
            BusinessClaim::where('business_id', $claim->business_id)
                ->where('id', '!=', $claim->id)
                ->where('status', 'pending')
                ->update([
                    'status'      => 'rejected',
                    'admin_notes' => 'Një kërkesë tjetër u aprovua për këtë biznes.',
                    'reviewed_by' => $admin->id,
                    'reviewed_at' => now(),
                ]);
        }

        // ✉️ Dërgo email notifikim tek aplikanti
        try {
            if ($claim->user && $claim->user->email) {
                Mail::to($claim->user->email)->send(new ClaimStatusUpdatedMail($claim));
            }
        } catch (\Throwable $e) {
            Log::error('ClaimStatusUpdatedMail (approve) dështoi: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => "Kërkesa u aprovua. Përdoruesi tani ka qasje të plotë për përditësimin e biznesit \"{$claim->business->name}\".",
            'data'    => $claim,
        ]);
    }

    /**
     * Refuzon kërkesën për pronësi nga administratori.
     * Dërgon email notifikim tek aplikanti.
     */
    public function adminReject(Request $request, int $id): JsonResponse
    {
        $claim = BusinessClaim::with(['business.category', 'user'])->find($id);

        if (! $claim) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kërkesa nuk u gjet.',
            ], 404);
        }

        $admin      = $request->user();
        $adminNotes = $request->input('admin_notes');

        $claim->status      = 'rejected';
        $claim->admin_notes = $adminNotes;
        $claim->reviewed_by = $admin->id;
        $claim->reviewed_at = now();
        $claim->save();

        // ✉️ Dërgo email notifikim tek aplikanti
        try {
            if ($claim->user && $claim->user->email) {
                Mail::to($claim->user->email)->send(new ClaimStatusUpdatedMail($claim));
            }
        } catch (\Throwable $e) {
            Log::error('ClaimStatusUpdatedMail (reject) dështoi: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Kërkesa për pronësi u refuzua me sukses.',
            'data'    => $claim,
        ]);
    }
}
