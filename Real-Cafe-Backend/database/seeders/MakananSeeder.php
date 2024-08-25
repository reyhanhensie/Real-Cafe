<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MakananSeeder extends Seeder
{
    /**
     * Seed the makanan table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('makanan')->insert([
            [
                'name' => 'Ayam Geprek',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Telur Geprek',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fuyunghai',
                'price' => 20000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Capcay',
                'price' => 22000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mie Goreng',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mie Kuah',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nasi Goreng Reguler',
                'price' => 13000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nasi Goreng Spesial',
                'price' => 18000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nasi Goreng Ikan Asin',
                'price' => 17000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nasi Goreng Seafood',
                'price' => 20000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
