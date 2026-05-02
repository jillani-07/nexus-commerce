<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $mobile  = Category::where('slug', 'mobile-phones')->first();
        $laptop  = Category::where('slug', 'laptops')->first();
        $men     = Category::where('slug', 'men-clothing')->first();
        $women   = Category::where('slug', 'women-clothing')->first();
        $sports  = Category::where('slug', 'sports')->first();
        $home    = Category::where('slug', 'home-living')->first();
        $books   = Category::where('slug', 'books')->first();

        $products = [
            [
                'category_id' => $mobile->id,
                'name' => 'iPhone 15 Pro',
                'slug' => 'iphone-15-pro',
                'sku' => 'IPH-15-PRO',
                'short_description' => 'Latest Apple flagship with titanium design',
                'price' => 999.00, 'sale_price' => 949.00,
                'stock_quantity' => 50, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
            ],
            [
                'category_id' => $mobile->id,
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => 'samsung-galaxy-s24-ultra',
                'sku' => 'SAM-S24-ULTRA',
                'short_description' => 'Samsung flagship with built-in S Pen',
                'price' => 1199.00, 'sale_price' => null,
                'stock_quantity' => 30, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
            ],
            [
                'category_id' => $mobile->id,
                'name' => 'Google Pixel 8 Pro',
                'slug' => 'google-pixel-8-pro',
                'sku' => 'GOO-PIX-8P',
                'short_description' => 'Best Android camera phone with AI features',
                'price' => 899.00, 'sale_price' => 799.00,
                'stock_quantity' => 25, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
            ],
            [
                'category_id' => $laptop->id,
                'name' => 'MacBook Pro M3 14"',
                'slug' => 'macbook-pro-m3-14',
                'sku' => 'MBP-M3-14',
                'short_description' => 'Apple M3 chip with stunning Liquid Retina display',
                'price' => 1999.00, 'sale_price' => 1899.00,
                'stock_quantity' => 20, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
            ],
            [
                'category_id' => $laptop->id,
                'name' => 'Dell XPS 15',
                'slug' => 'dell-xps-15',
                'sku' => 'DEL-XPS-15',
                'short_description' => 'Premium Windows laptop with OLED display',
                'price' => 1599.00, 'sale_price' => null,
                'stock_quantity' => 15, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600',
            ],
            [
                'category_id' => $men->id,
                'name' => 'Classic Oxford Shirt',
                'slug' => 'classic-oxford-shirt',
                'sku' => 'CLT-OXF-001',
                'short_description' => 'Premium 100% cotton Oxford shirt',
                'price' => 49.99, 'sale_price' => null,
                'stock_quantity' => 100, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
            ],
            [
                'category_id' => $men->id,
                'name' => 'Slim Fit Chinos',
                'slug' => 'slim-fit-chinos',
                'sku' => 'CLT-CHN-001',
                'short_description' => 'Modern slim fit chinos for everyday wear',
                'price' => 59.99, 'sale_price' => 44.99,
                'stock_quantity' => 80, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600',
            ],
            [
                'category_id' => $women->id,
                'name' => 'Floral Summer Dress',
                'slug' => 'floral-summer-dress',
                'sku' => 'CLT-DRS-001',
                'short_description' => 'Light and breezy floral print summer dress',
                'price' => 69.99, 'sale_price' => 49.99,
                'stock_quantity' => 60, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
            ],
            [
                'category_id' => $women->id,
                'name' => 'Leather Handbag',
                'slug' => 'leather-handbag',
                'sku' => 'CLT-BAG-001',
                'short_description' => 'Genuine leather handbag with gold hardware',
                'price' => 129.99, 'sale_price' => null,
                'stock_quantity' => 40, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
            ],
            [
                'category_id' => $sports->id,
                'name' => 'Running Shoes Pro',
                'slug' => 'running-shoes-pro',
                'sku' => 'SPT-SHO-001',
                'short_description' => 'Lightweight running shoes with foam cushioning',
                'price' => 89.99, 'sale_price' => 74.99,
                'stock_quantity' => 70, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
            ],
            [
                'category_id' => $sports->id,
                'name' => 'Yoga Mat Premium',
                'slug' => 'yoga-mat-premium',
                'sku' => 'SPT-YGA-001',
                'short_description' => 'Non-slip premium yoga mat with carry strap',
                'price' => 34.99, 'sale_price' => null,
                'stock_quantity' => 90, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
            ],
            [
                'category_id' => $home->id,
                'name' => 'Ceramic Coffee Mug Set',
                'slug' => 'ceramic-coffee-mug-set',
                'sku' => 'HOM-MUG-001',
                'short_description' => 'Set of 4 handcrafted ceramic coffee mugs',
                'price' => 39.99, 'sale_price' => 29.99,
                'stock_quantity' => 50, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
            ],
            [
                'category_id' => $home->id,
                'name' => 'Scandinavian Table Lamp',
                'slug' => 'scandinavian-table-lamp',
                'sku' => 'HOM-LMP-001',
                'short_description' => 'Minimalist wooden base table lamp',
                'price' => 79.99, 'sale_price' => null,
                'stock_quantity' => 30, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
            ],
            [
                'category_id' => $books->id,
                'name' => 'Clean Code',
                'slug' => 'clean-code-book',
                'sku' => 'BOK-CC-001',
                'short_description' => 'A Handbook of Agile Software Craftsmanship',
                'price' => 24.99, 'sale_price' => 19.99,
                'stock_quantity' => 100, 'is_active' => true, 'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
            ],
            [
                'category_id' => $books->id,
                'name' => 'The DevOps Handbook',
                'slug' => 'devops-handbook',
                'sku' => 'BOK-DOP-001',
                'short_description' => 'How to create world-class agility and reliability',
                'price' => 29.99, 'sale_price' => null,
                'stock_quantity' => 80, 'is_active' => true, 'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
            ],
        ];

        foreach ($products as $productData) {
            $imageUrl = $productData['image'];
            unset($productData['image']);

            $product = Product::create($productData);

            ProductImage::create([
                'product_id' => $product->id,
                'image_url'  => $imageUrl,
                'alt_text'   => $product->name,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }
    }
}