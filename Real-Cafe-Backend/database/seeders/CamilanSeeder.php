<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CamilanSeeder extends Seeder
{
    /**
     * Seed the camilan table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('camilan')->insert([
            [
                'name' => 'Kentang',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tahu Crispy',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Brokoli Crispy',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Onion Rings',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jamur Crispy',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cilok',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cireng',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Burger Sapi',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Burger Ayam',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sosis Bakar',
                'price' => 13000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Roti Bakar',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Roti Maryam',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pisang Goreng',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tempe Mendoan',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nugget',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
