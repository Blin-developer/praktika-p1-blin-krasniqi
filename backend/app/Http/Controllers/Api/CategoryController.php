<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount(['businesses' => function ($q) {
            $q->published();
        }])->orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }
}
