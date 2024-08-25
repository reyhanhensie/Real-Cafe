<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MilkshakeSeeder extends Seeder
{
    /**
     * Seed the milkshake table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('milkshake')->insert([
            [
                'name' => 'BubbleGum',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Red Velvet',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Matcha',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Taro',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Banana',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Strawberry',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Avocado',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Coffee Caramel',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vanilla',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
