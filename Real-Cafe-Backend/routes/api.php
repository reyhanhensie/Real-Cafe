<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\CamilanController;
use App\Http\Controllers\OrderController;

Route::apiResource('camilan', CamilanController::class);

Route::get('/orders', [OrderController::class, 'index']); // Create an order
Route::post('/order', [OrderController::class, 'store']); // Create an order
Route::get('/order/{id}', [OrderController::class, 'show']); // Retrieve an order
Route::patch('/order/{id}/complete', [OrderController::class, 'markAsCompleted']);
