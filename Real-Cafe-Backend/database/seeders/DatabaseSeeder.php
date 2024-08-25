<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Call each seeder class here
        $this->call([
            MinumanDinginSeeder::class,
            MilkshakeSeeder::class,
            MinumanPanasSeeder::class,
            MakananSeeder::class,
            LalapanSeeder::class,
            JusSeeder::class,
            CoffeSeeder::class,
            CamilanSeeder::class,
        ]);
    }
}
