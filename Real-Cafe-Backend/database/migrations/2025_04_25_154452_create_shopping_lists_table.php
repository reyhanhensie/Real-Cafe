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
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->text('category');
            $table->text('description');
            $table->integer('category_id'); // Changed from decimal to integer

            $table->integer('price')->nullable(); // Changed from decimal to integer
            $table->enum('status', ['pending', 'bought', 'complete'])->default('pending');
            $table->timestamps();

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopping_lists');
    }
};
