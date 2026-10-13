<?php

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
    Route::get('/businesses', [BusinessController::class, 'index']);
    Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/settlements', [SettlementController::class, 'index']);
});

// Direct aliases (/api/businesses, etc.) për thjeshtësi dhe kompatibilitet
Route::get('/businesses', [BusinessController::class, 'index']);
Route::get('/businesses/{idOrSlug}', [BusinessController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/settlements', [SettlementController::class, 'index']);
