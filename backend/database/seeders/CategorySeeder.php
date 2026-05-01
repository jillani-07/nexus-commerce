<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::create([
            'name'       => 'Electronics',
            'slug'       => 'electronics',
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name'       => 'Mobile Phones',
            'slug'       => 'mobile-phones',
            'parent_id'  => $electronics->id,
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name'       => 'Laptops',
            'slug'       => 'laptops',
            'parent_id'  => $electronics->id,
            'is_active'  => true,
            'sort_order' => 2,
        ]);

        $clothing = Category::create([
            'name'       => 'Clothing',
            'slug'       => 'clothing',
            'is_active'  => true,
            'sort_order' => 2,
        ]);

        Category::create([
            'name'       => 'Men',
            'slug'       => 'men-clothing',
            'parent_id'  => $clothing->id,
            'is_active'  => true,
            'sort_order' => 1,
        ]);

        Category::create([
            'name'       => 'Women',
            'slug'       => 'women-clothing',
            'parent_id'  => $clothing->id,
            'is_active'  => true,
            'sort_order' => 2,
        ]);
    }
}