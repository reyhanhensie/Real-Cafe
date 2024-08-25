<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MinumanDinginSeeder extends Seeder
{
    /**
     * Seed the minuman_dingin table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('minuman_dingin')->insert([
            [
                'name' => 'Es Cappucino',
                'price' => 8000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Susu Coklat',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Joshua',
                'price' => 8000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Susu Soda',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Susu UHT',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Lemon Tea',
                'price' => 8000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Jeruk Manis',
                'price' => 8000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Jeruk Nipis',
                'price' => 7000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Teh Manis',
                'price' => 6000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dalgona Coffe',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Kopi Susu',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Matcha',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Squash',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Air Mineral',
                'price' => 5000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],  
        ]);
    }
}
