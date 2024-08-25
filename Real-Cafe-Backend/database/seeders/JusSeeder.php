<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JusSeeder extends Seeder
{
    /**
     * Seed the jus table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('jus')->insert([
            [
                'name' => 'Jus Jambu',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Nanas',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Apel',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Tomat',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Melon',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Buah Naga',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Sirsat',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Leci',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Nangka',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Alpukat',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Wortel',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jus Tropical',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
