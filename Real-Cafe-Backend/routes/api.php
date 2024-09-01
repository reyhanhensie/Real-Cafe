<?php
use Illuminate\Http\Request;
use App\Http\Controllers\SecretController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CamilanController;
use App\Http\Controllers\CoffeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JusController;
use App\Http\Controllers\LalapanController;
use App\Http\Controllers\MakananController;
use App\Http\Controllers\MilkshakeController;
use App\Http\Controllers\MinumanDinginController;
use App\Http\Controllers\MinumanPanasController;


// AUTHENTICATION
Route::middleware('web')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/secret', [SecretController::class, 'show']);
    // Route::get('/another', [AnotherController::class, 'show']);
    // More authenticated routes here
});

Route::middleware('auth:sanctum')->get('/auth/check', function (Request $request) {
    return response()->json(['user' => $request->user()]);
});

Route::post('register', [AuthController::class, 'register']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::post('logout', [AuthController::class, 'logout']);

Route::apiResource('Camilan', CamilanController::class);
Route::apiResource('Coffe', CoffeController::class);
Route::apiResource('Jus', JusController::class);
Route::apiResource('Lalapan', LalapanController::class);
Route::apiResource('Makanan', MakananController::class);
Route::apiResource('Milkshake', MilkshakeController::class);
Route::apiResource('MinumanDingin', MinumanDinginController::class);
Route::apiResource('MinumanPanas', MinumanPanasController::class);


Route::get('Menu', [MenuController::class, 'index']);
Route::get('/live-orders', [OrderController::class, 'live']); // Create an order
Route::get('/orders', [OrderController::class, 'index']); // Create an order
Route::post('/send-order', [OrderController::class, 'store']); // Create an order
Route::get('/order/{id}', [OrderController::class, 'show']); // Retrieve an order
Route::patch('/order/{id}/complete', [OrderController::class, 'markAsCompleted']);
