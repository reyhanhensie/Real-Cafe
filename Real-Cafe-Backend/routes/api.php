<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CamilanController;
use App\Http\Controllers\CoffeController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JusController;
use App\Http\Controllers\LalapanController;
use App\Http\Controllers\MakananController;
use App\Http\Controllers\MilkshakeController;
use App\Http\Controllers\MinumanDinginController;
use App\Http\Controllers\MinumanPanasController;
use App\Http\Controllers\PaketController;
use App\Http\Controllers\SpendingController;
// PRINTING
use App\Http\Controllers\PrintController;
use App\Http\Controllers\RokokController;
use App\Http\Controllers\ShiftsController;

// AUTHENTICATION
Route::middleware('web')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::post('login', [AuthController::class, 'login']);


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('register', [AuthController::class, 'register']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::apiResource('Camilan', CamilanController::class);
Route::apiResource('Coffe', CoffeController::class);
Route::apiResource('Jus', JusController::class);
Route::apiResource('Lalapan', LalapanController::class);
Route::apiResource('Makanan', MakananController::class);
Route::apiResource('Milkshake', MilkshakeController::class);
Route::apiResource('MinumanDingin', MinumanDinginController::class);
Route::apiResource(name: 'MinumanPanas', controller: MinumanPanasController::class);
Route::apiResource(name: 'Paket', controller: PaketController::class);
Route::apiResource(name: 'Rokok', controller: RokokController::class);
Route::apiResource('Spending', SpendingController::class);

Route::get('Menu', [MenuController::class, 'index']);
Route::get('/live-orders', [OrderController::class, 'live']); // Create an order
Route::get('/live-food', [OrderController::class, 'live_food']); // Create an order
Route::get('/live-drink', [OrderController::class, 'live_drink']); // Create an order
Route::get('/orders', [OrderController::class, 'index']); // Create an order
Route::get('/today-orders', [OrderController::class, 'today']); // Create an order
Route::get('/receipt/{id}', [OrderController::class, 'generatePdf']);
Route::post('/send-order', [OrderController::class, 'store']); // Create an order
Route::get('/order/{id}', [OrderController::class, 'show']); // Retrieve an order
Route::patch('/order/{id}/complete', [OrderController::class, 'markAsCompleted']);
Route::patch('/order/{id}/complete/food', [OrderController::class, 'markAsCompletedFood']);
Route::patch('/order/{id}/complete/drink', [OrderController::class, 'markAsCompletedDrink']);
Route::patch('/order/{id}/message', [OrderController::class, 'changeMessage']);

Route::get('/finance/{menu}/{item}/{type}/{period}', [FinanceController::class, 'index']);
Route::get('/AllTime/{menu}/{item}/{type}/{period}', [FinanceController::class, 'AllTime']);
Route::get('/traffic/{menu}/{item}', [FinanceController::class, 'traffic']);


Route::get('/print/{id}', [OrderController::class, 'printReceipt']);

//SHIFT
Route::get('/Shift', [ShiftsController::class, 'index']); // Create an order
Route::post('/ShiftPrint', [ShiftsController::class, 'ShiftPrint']); // Create an order

Route::get('/ShiftSummary', [ShiftsController::class, 'filter']); // Create an order

Route::post('/ShiftChange', [ShiftsController::class, 'Shift']); // Create an order
Route::get('/ShiftSpending', [SpendingController::class, 'ShiftSpending']); // Create an order
Route::get('/ShiftSpendingFilter', [SpendingController::class, 'shift']); // Create an order

Route::get('/ShiftOrder', [OrderController::class, 'ShiftOrders']); // Create an order
Route::get('/ShiftOrderFilter', [OrderController::class, 'shift']); // Create an order

Route::get('/test', [ShiftsController::class, 'test']);
