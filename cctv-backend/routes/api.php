<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CCTVController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - HOMM Saranam CCTV Monitoring
|--------------------------------------------------------------------------
*/

// Test Endpoint (untuk memastikan API berjalan)
Route::get('/ping', function () {
    return response()->json(['message' => 'API Backend CCTV HOMM Saranam Aktif!'], 200);
});

// Endpoint CCTV Master Data
Route::get('/cctvs', [CCTVController::class, 'index']);
Route::post('/cctvs', [CCTVController::class, 'store']);
Route::get('/cctvs/{id}', [CCTVController::class, 'show']);
Route::put('/cctvs/{id}', [CCTVController::class, 'update']);
Route::delete('/cctvs/{id}', [CCTVController::class, 'destroy']);

// Endpoint Tiket Pelaporan Maintenance
Route::get('/tickets', [TicketController::class, 'index']);
Route::post('/tickets', [TicketController::class, 'store']);
Route::get('/tickets/{id}', [TicketController::class, 'show']);
Route::put('/tickets/{id}', [TicketController::class, 'update']);

// Route User Management
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::post('/login', [AuthController::class, 'login']);