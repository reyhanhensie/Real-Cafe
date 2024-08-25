<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\CamilanController;
use App\Http\Controllers\CoffeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JusController;
use App\Http\Controllers\LalapanController;
use App\Http\Controllers\MakananController;
use App\Http\Controllers\MilkshakeController;
use App\Http\Controllers\MinumanDinginController;
use App\Http\Controllers\MinumanPanasController;

Route::apiResource('Camilan', CamilanController::class);
Route::apiResource('Coffe', CoffeController::class);
Route::apiResource('Jus', JusController::class);
Route::apiResource('Lalapan', LalapanController::class);
Route::apiResource('Makanan', MakananController::class);
Route::apiResource('Milkshake', MilkshakeController::class);
Route::apiResource('MinumanDingin', MinumanDinginController::class);
Route::apiResource('MinumanPanas', MinumanPanasController::class);


Route::get('/orders', [OrderController::class, 'index']); // Create an order
Route::post('/send-order', [OrderController::class, 'store']); // Create an order
Route::get('/order/{id}', [OrderController::class, 'show']); // Retrieve an order
Route::patch('/order/{id}/complete', [OrderController::class, 'markAsCompleted']);
