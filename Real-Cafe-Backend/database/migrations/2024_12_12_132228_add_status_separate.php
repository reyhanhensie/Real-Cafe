<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status_makanan')->default('pending'); // Default status can be 'pending'
            $table->string('status_minuman')->default('pending'); // Default status can be 'pending'
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status_makanan');
            $table->dropColumn('status_minuman');
        });
    }
};
