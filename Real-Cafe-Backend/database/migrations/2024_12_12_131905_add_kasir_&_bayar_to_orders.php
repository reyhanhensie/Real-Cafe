<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('kasir')->nullable(); // Adding message column
            $table->integer('bayar')->nullable(); // Adding meja_no column
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('kasir');
            $table->dropColumn('bayar'); // Adding meja_no column
        });
    }
};
