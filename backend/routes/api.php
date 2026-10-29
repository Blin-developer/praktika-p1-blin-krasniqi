<?php

use App\Http\Controllers\Api\AdminAdvertisementController;
use App\Http\Controllers\Api\AdminBusinessController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettlementController;
use App\Http\Controllers\Api\UserFavoriteController;
use App\Http\Controllers\Api\BusinessReviewController;
use App\Http\Controllers\Api\BusinessClaimController;
use App\Http\Controllers\Api\BusinessOwnerController;
use App\Http\Controllers\Api\BusinessDealController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Katalogu i Bizneseve të Lipjanit
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Lipjan Businesses API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// V1 Prefix Group
Route::prefix('v1')->group(function () {
    // Publik - Biznese, Kategori, Vendbanime, Shërbime
    Route::get('/businesses', [BusinessController::class, 'index']);
    Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
    Route::get('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/settlements', [SettlementController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/businesses/{idOrSlug}/claim-status', [BusinessClaimController::class, 'checkStatus']);
    Route::get('/deals', [BusinessDealController::class, 'publicDeals']);
    Route::get('/businesses/{idOrSlug}/deals', [BusinessDealController::class, 'businessDeals']);

    // Vlerësime dhe Kërkesa për Pronësi nga përdoruesi i kyçur
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'store']);
        Route::delete('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'destroy']);

        // Kërkimi i pronësisë së biznesit ("Claim your Business")
        Route::post('/businesses/{idOrSlug}/claim', [BusinessClaimController::class, 'store']);

        // Portali i Pronarit të Biznesit (vetë-menaxhim)
        Route::get('/owner/businesses', [BusinessOwnerController::class, 'myBusinesses']);
        Route::get('/owner/businesses/{id}', [BusinessOwnerController::class, 'show']);
        Route::put('/owner/businesses/{id}', [BusinessOwnerController::class, 'update']);

        // Menaxhimi i Ofertave nga Pronari / Përdoruesi i autorizuar
        Route::post('/deals', [BusinessDealController::class, 'store']);
        Route::put('/deals/{id}', [BusinessDealController::class, 'update']);
        Route::delete('/deals/{id}', [BusinessDealController::class, 'destroy']);
    });

    // Publik - Reklama aktive me rregulla kohore
    Route::get('/advertisements', [AdvertisementController::class, 'index']);
    Route::post('/advertisements/{id}/click', [AdvertisementController::class, 'trackClick']);
    Route::post('/advertisements/{id}/impression', [AdvertisementController::class, 'trackImpression']);

    // Autentikimi i përdoruesve dhe administratorëve
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/user-login', [AuthController::class, 'userLogin']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'changePassword']);
        });
    });

    // Zona e përdoruesit të autentikuar (Bizneset e ruajtura / Favorites)
    Route::middleware('auth:sanctum')->prefix('user')->group(function () {
        Route::get('/favorites', [UserFavoriteController::class, 'index']);
        Route::get('/favorites/{businessId}', [UserFavoriteController::class, 'status']);
        Route::post('/favorites/{businessId}', [UserFavoriteController::class, 'toggle']);
        Route::delete('/favorites/{businessId}', [UserFavoriteController::class, 'destroy']);
    });

    // Zona administrative e mbrojtur (auth:sanctum + admin)
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/test', function (Request $request) {
            return response()->json([
                'status' => 'ok',
                'message' => 'Qasja administrative u verifikua me sukses.',
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'is_admin' => $request->user()->is_admin,
                ],
            ]);
        });

        // Menaxhimi i bizneseve
        Route::get('/businesses', [AdminBusinessController::class, 'index']);
        Route::post('/businesses', [AdminBusinessController::class, 'store']);
        Route::get('/businesses/{id}', [AdminBusinessController::class, 'show']);
        Route::put('/businesses/{id}', [AdminBusinessController::class, 'update']);
        Route::patch('/businesses/{id}/status', [AdminBusinessController::class, 'updateStatus']);
        Route::delete('/businesses/{id}', [AdminBusinessController::class, 'destroy']);

        // Menaxhimi i reklamave profesionale
        Route::get('/advertisements', [AdminAdvertisementController::class, 'index']);
        Route::post('/advertisements', [AdminAdvertisementController::class, 'store']);
        Route::get('/advertisements/{id}', [AdminAdvertisementController::class, 'show']);
        Route::put('/advertisements/{id}', [AdminAdvertisementController::class, 'update']);
        Route::patch('/advertisements/{id}/toggle', [AdminAdvertisementController::class, 'toggle']);
        Route::delete('/advertisements/{id}', [AdminAdvertisementController::class, 'destroy']);
        Route::post('/upload-image', [AdminAdvertisementController::class, 'uploadImage']);
        Route::get('/reviews', [BusinessReviewController::class, 'adminIndex']);
        Route::delete('/reviews/{id}', [BusinessReviewController::class, 'adminDestroy']);
        Route::get('/claims', [BusinessClaimController::class, 'adminIndex']);
        Route::post('/claims/{id}/approve', [BusinessClaimController::class, 'adminApprove']);
        Route::post('/claims/{id}/reject', [BusinessClaimController::class, 'adminReject']);
        Route::get('/deals', [BusinessDealController::class, 'adminIndex']);
        Route::post('/deals', [BusinessDealController::class, 'store']);
        Route::put('/deals/{id}', [BusinessDealController::class, 'update']);
        Route::delete('/deals/{id}', [BusinessDealController::class, 'destroy']);
    });
});

// Direct aliases për thjeshtësi dhe kompatibilitet të plotë me frontend
Route::get('/businesses', [BusinessController::class, 'index']);
Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
Route::get('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'index']);
Route::get('/businesses/{idOrSlug}/claim-status', [BusinessClaimController::class, 'checkStatus']);
Route::get('/deals', [BusinessDealController::class, 'publicDeals']);
Route::get('/businesses/{idOrSlug}/deals', [BusinessDealController::class, 'businessDeals']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/settlements', [SettlementController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'store']);
    Route::delete('/businesses/{idOrSlug}/reviews', [BusinessReviewController::class, 'destroy']);
    Route::post('/businesses/{idOrSlug}/claim', [BusinessClaimController::class, 'store']);
    Route::get('/owner/businesses', [BusinessOwnerController::class, 'myBusinesses']);
    Route::get('/owner/businesses/{id}', [BusinessOwnerController::class, 'show']);
    Route::put('/owner/businesses/{id}', [BusinessOwnerController::class, 'update']);
    Route::post('/deals', [BusinessDealController::class, 'store']);
    Route::put('/deals/{id}', [BusinessDealController::class, 'update']);
    Route::delete('/deals/{id}', [BusinessDealController::class, 'destroy']);
});

Route::get('/advertisements', [AdvertisementController::class, 'index']);
Route::post('/advertisements/{id}/click', [AdvertisementController::class, 'trackClick']);
Route::post('/advertisements/{id}/impression', [AdvertisementController::class, 'trackImpression']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/user-login', [AuthController::class, 'userLogin']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/favorites', [UserFavoriteController::class, 'index']);
    Route::get('/favorites/{businessId}', [UserFavoriteController::class, 'status']);
    Route::post('/favorites/{businessId}', [UserFavoriteController::class, 'toggle']);
    Route::delete('/favorites/{businessId}', [UserFavoriteController::class, 'destroy']);
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/test', function (Request $request) {
        return response()->json([
            'status' => 'ok',
            'message' => 'Qasja administrative u verifikua me sukses.',
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'is_admin' => $request->user()->is_admin,
            ],
        ]);
    });

    Route::get('/businesses', [AdminBusinessController::class, 'index']);
    Route::post('/businesses', [AdminBusinessController::class, 'store']);
    Route::get('/businesses/{id}', [AdminBusinessController::class, 'show']);
    Route::put('/businesses/{id}', [AdminBusinessController::class, 'update']);
    Route::patch('/businesses/{id}/status', [AdminBusinessController::class, 'updateStatus']);
    Route::delete('/businesses/{id}', [AdminBusinessController::class, 'destroy']);

    Route::get('/advertisements', [AdminAdvertisementController::class, 'index']);
    Route::post('/advertisements', [AdminAdvertisementController::class, 'store']);
    Route::get('/advertisements/{id}', [AdminAdvertisementController::class, 'show']);
    Route::put('/advertisements/{id}', [AdminAdvertisementController::class, 'update']);
    Route::patch('/advertisements/{id}/toggle', [AdminAdvertisementController::class, 'toggle']);
    Route::delete('/advertisements/{id}', [AdminAdvertisementController::class, 'destroy']);
    Route::post('/upload-image', [AdminAdvertisementController::class, 'uploadImage']);
    Route::get('/reviews', [BusinessReviewController::class, 'adminIndex']);
    Route::delete('/reviews/{id}', [BusinessReviewController::class, 'adminDestroy']);
    Route::get('/claims', [BusinessClaimController::class, 'adminIndex']);
    Route::post('/claims/{id}/approve', [BusinessClaimController::class, 'adminApprove']);
    Route::post('/claims/{id}/reject', [BusinessClaimController::class, 'adminReject']);
});
