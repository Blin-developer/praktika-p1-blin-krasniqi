<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SettlementController;
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
    // Publik
    Route::get('/businesses', [BusinessController::class, 'index']);
    Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/settlements', [SettlementController::class, 'index']);

    // Autentikimi i administratorit (Sanctum)
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // Zona administrative e mbrojtur
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
    });
});

// Direct aliases për kompatibilitet
Route::get('/businesses', [BusinessController::class, 'index']);
Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/settlements', [SettlementController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
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
});

