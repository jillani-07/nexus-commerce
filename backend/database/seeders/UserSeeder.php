<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'              => 'Admin User',
            'email'             => 'admin@nexuscommerce.com',
            'password'          => 'Admin@12345',
            'role'              => 'admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Test Customer',
            'email'             => 'customer@nexuscommerce.com',
            'password'          => 'Customer@12345',
            'role'              => 'customer',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);
    }
}