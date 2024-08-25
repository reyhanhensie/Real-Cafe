<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoffeSeeder extends Seeder
{
    /**
     * Seed the coffe table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('coffe')->insert([
            [
                'name' => 'Espresso',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Americano',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cappuccino',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Latte',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mocchacino',
                'price' => 18000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Macchiato',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Affogato',
                'price' => 18000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'V60',
                'price' => 15000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vietnam Drip',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kopi Susu',
                'price' => 12000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Robusta Tubruk',
                'price' => 7000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Arabika Tubruk',
                'price' => 10000,
                'qty' => 99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
