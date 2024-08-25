<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\FoodMenuController;
use App\Http\Controllers\DrinkMenuController;

Route::apiResource('food-menu', FoodMenuController::class);
Route::apiResource('drink-menu', DrinkMenuController::class);

Route::get('/test', [TestController::class, 'index']);

use App\Http\Controllers\OrderController;

Route::post('/orders', [OrderController::class, 'store']); // Create an order
Route::get('/orders/{id}', [OrderController::class, 'show']); // Retrieve an order