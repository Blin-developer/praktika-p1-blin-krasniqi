<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Settlement;
use Illuminate\Http\JsonResponse;

class SettlementController extends Controller
{
    public function index(): JsonResponse
    {
        $settlements = Settlement::withCount(['businesses' => function ($q) {
            $q->published();
        }])->orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $settlements,
        ]);
    }
}
