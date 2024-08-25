<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\FoodMenuController;

Route::apiResource('food-menu', FoodMenuController::class);

Route::get('/test', [TestController::class, 'index']);