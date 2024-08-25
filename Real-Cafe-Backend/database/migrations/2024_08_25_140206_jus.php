<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('jus', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('name'); // Food name
            $table->decimal('price', 8,0); // Price with 8 digits total and 2 decimals
            $table->integer('qty'); // Quantity
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('jus');
    }
};