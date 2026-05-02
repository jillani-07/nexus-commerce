<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::create([
            'name' => 'Electronics', 'slug' => 'electronics',
            'image_url' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            'is_active' => true, 'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Mobile Phones', 'slug' => 'mobile-phones',
            'parent_id' => $electronics->id,
            'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            'is_active' => true, 'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Laptops', 'slug' => 'laptops',
            'parent_id' => $electronics->id,
            'image_url' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            'is_active' => true, 'sort_order' => 2,
        ]);

        $clothing = Category::create([
            'name' => 'Clothing', 'slug' => 'clothing',
            'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            'is_active' => true, 'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Men', 'slug' => 'men-clothing',
            'parent_id' => $clothing->id,
            'image_url' => 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400',
            'is_active' => true, 'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Women', 'slug' => 'women-clothing',
            'parent_id' => $clothing->id,
            'image_url' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
            'is_active' => true, 'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Sports', 'slug' => 'sports',
            'image_url' => 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
            'is_active' => true, 'sort_order' => 3,
        ]);

        Category::create([
            'name' => 'Home & Living', 'slug' => 'home-living',
            'image_url' => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
            'is_active' => true, 'sort_order' => 4,
        ]);

        Category::create([
            'name' => 'Books', 'slug' => 'books',
            'image_url' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            'is_active' => true, 'sort_order' => 5,
        ]);
    }
}