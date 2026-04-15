<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Owner\TerrainController;
use App\Http\Controllers\Api\V1\Owner\AvailabilityController;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:api')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
        });

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // Public Terrain Routes
    Route::get('/terrains', [TerrainController::class, 'publicIndex']);
    Route::get('/terrains/{terrain}', [TerrainController::class, 'show']);


    Route::prefix('owner')->middleware(['auth:api', 'role:owner'])->group(function () {
        // Terrain
        // Route::apiResource('terrains', TerrainController::class)->except(['show', 'index']);
        Route::get('/terrains', [TerrainController::class, 'index']);
        Route::post('/terrains', [TerrainController::class, 'store']);
        // Route::put('/terrains/{terrain}', [TerrainController::class, 'update']);
        Route::patch('/terrains/{terrain}', [TerrainController::class, 'update']);
        Route::delete('/terrains/{terrain}', [TerrainController::class, 'destroy']);

        // Availability
        Route::prefix('terrains/{terrain}')->scopeBindings()->group(function () {
            Route::get('availabilities', [AvailabilityController::class, 'index']);
            Route::post('availabilities', [AvailabilityController::class, 'store']);
            Route::get('availabilities/{availability}', [AvailabilityController::class, 'show']);
            Route::patch('availabilities/{availability}', [AvailabilityController::class, 'update']);
            Route::delete('availabilities/{availability}', [AvailabilityController::class, 'destroy']);
        });
    });
});