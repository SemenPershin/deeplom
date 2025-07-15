<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HallManagement;
use App\Http\Controllers\SeatsController;
use App\Http\Controllers\FilmsController;
use App\Http\Controllers\SessionsController;
use App\Http\Controllers\CustomerDataController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/welcome/{date}', [CustomerDataController::class, 'getSessionsData']);

Route::get('/hall/{id}', [HallController::class, 'returnPage']);

Route::post('/ticket', [TicketController::class, 'index']);

Route::get('/login', function() {
    return Inertia::render('login');
})->name('login');
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth'])->group(function () {

    Route::get('/admin', function() {
    return Inertia::render('admin');
    })->name('admin');

    Route::post('/halls', [HallManagement::class, 'store']);
    Route::get('/halls', [HallManagement::class, 'index']);
    Route::delete('/halls/{id}', [HallManagement::class, 'destroy']);

    Route::post('/seats', [SeatsController::class, "store"]);
    Route::get('/seats', [SeatsController::class, 'index']);

    Route::post('/seats/price', [SeatsController::class, "price"]);

    Route::post('/film', [FilmsController::class, 'store']);
    Route::post('/film/{id}', [FilmsController::class, 'update']);
    Route::get('/film', [FilmsController::class, 'index']);
    Route::delete('/film/{id}', [FilmsController::class, 'destroy']);

    Route::post('/session', [SessionsController::class, 'store']);
    Route::post('/session/activate', [SessionsController::class, 'activate']);
    Route::post('/session/deactivate', [SessionsController::class, 'deactivate']);
    Route::post('/session/{id}', [SessionsController::class, 'update']);
    
    Route::get('/session', [SessionsController::class, 'index']);
    Route::delete('/session/{id}', [SessionsController::class, 'destroy']);
});


