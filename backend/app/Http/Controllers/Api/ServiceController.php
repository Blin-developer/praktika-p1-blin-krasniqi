<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Merr listën e të gjitha shërbimeve të disponueshme.
     */
    public function index(): JsonResponse
    {
        $services = Service::orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'count' => $services->count(),
            'data' => $services,
        ]);
    }
}
