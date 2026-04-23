<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Cache::remember('categories:all', 600, function () {
            return Category::where('is_active', true)
                ->whereNull('parent_id')
                ->with('children')
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json(['categories' => $categories]);
    }
}