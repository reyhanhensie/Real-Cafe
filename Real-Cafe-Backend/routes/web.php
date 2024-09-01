<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// routes/web.php
Route::middleware('auth:sanctum')->get('/secret');


Route::get('/{any}', function () {
    return view('index'); // This should be the Blade view that loads your React app
})->where('any', '.*');
