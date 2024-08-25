<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // This should be the Blade view that loads your React app
})->where('any', '.*');
