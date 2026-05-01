<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $mobile = Category::where('slug', 'mobile-phones')->first();
        $laptop = Category::where('slug', 'laptops')->first();
        $men    = Category::where('slug', 'men-clothing')->first();

        $products = [
            [
                'category_id'       => $mobile->id,
                'name'              => 'iPhone 15 Pro',
                'slug'              => 'iphone-15-pro',
                'sku'               => 'IPH-15-PRO',
                'short_description' => 'Latest Apple flagship phone',
                'price'             => 999.00,
                'sale_price'        => 949.00,
                'stock_quantity'    => 50,
                'is_active'         => true,
                'is_featured'       => true,
            ],
            [
                'category_id'       => $mobile->id,
                'name'              => 'Samsung Galaxy S24',
                'slug'              => 'samsung-galaxy-s24',
                'sku'               => 'SAM-S24',
                'short_description' => 'Samsung flagship with AI features',
                'price'             => 899.00,
                'stock_quantity'    => 30,
                'is_active'         => true,
                'is_featured'       => true,
            ],
            [
                'category_id'       => $laptop->id,
                'name'              => 'MacBook Pro M3',
                'slug'              => 'macbook-pro-m3',
                'sku'               => 'MBP-M3-14',
                'short_description' => 'Apple MacBook Pro 14 inch M3',
                'price'             => 1999.00,
                'sale_price'        => 1899.00,
                'stock_quantity'    => 20,
                'is_active'         => true,
                'is_featured'       => true,
            ],
            [
                'category_id'       => $men->id,
                'name'              => 'Classic Oxford Shirt',
                'slug'              => 'classic-oxford-shirt',
                'sku'               => 'CLT-OXF-001',
                'short_description' => 'Premium cotton oxford shirt',
                'price'             => 49.99,
                'stock_quantity'    => 100,
                'is_active'         => true,
                'is_featured'       => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}