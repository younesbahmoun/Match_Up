<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Owner\DashboardController;
use App\Http\Controllers\Api\V1\Owner\TerrainController;
use App\Http\Controllers\Api\V1\Owner\AvailabilityController;
use App\Http\Controllers\Api\V1\Owner\ReservationController as OwnerReservationController;
use App\Http\Controllers\Api\V1\Player\ReservationController;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:api')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
        });
    });

    // Public Routes
    Route::prefix('terrains')->group(function () {
        Route::get('/', [TerrainController::class, 'publicIndex']);
        Route::get('{terrain}', [TerrainController::class, 'publicShow']);
        Route::get('{terrain}/availabilities/{availability}', [AvailabilityController::class, 'publicShow']);
        Route::get('{terrain}/availabilities', [AvailabilityController::class, 'publicIndex']);
    });


    // Route::prefix('owner/terrains')->middleware(['auth:api', 'role:owner'])->group(function () {
    //     // Terrain
    //     // Route::apiResource('terrains', TerrainController::class)->except(['show', 'index']);
    //     Route::get('/', [TerrainController::class, 'index']);
    //     Route::get('/{terrain}', [TerrainController::class, 'show']);
    //     Route::post('/', [TerrainController::class, 'store']);
    //     // Route::put('/terrains/{terrain}', [TerrainController::class, 'update']);
    //     Route::patch('/{terrain}', [TerrainController::class, 'update']);
    //     Route::delete('/{terrain}', [TerrainController::class, 'destroy']);

    //     // Availability
    //     Route::prefix('{terrain}')->scopeBindings()->group(function () {
    //         // Route::get('availabilities', [AvailabilityController::class, 'index']);
    //         // Route::post('availabilities', [AvailabilityController::class, 'store']);
    //         // Route::get('availabilities/{availability}', [AvailabilityController::class, 'show']);
    //         // Route::patch('availabilities/{availability}', [AvailabilityController::class, 'update']);
    //         // Route::delete('availabilities/{availability}', [AvailabilityController::class, 'destroy']);
    //         Route::apiResource('availabilities', AvailabilityController::class);
    //     });
    // });

    // Owner Routes
    Route::prefix('owner')->middleware(['auth:api', 'role:owner'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'show']);
        Route::get('reservations/calendar', [OwnerReservationController::class, 'calendar']);
        Route::get('reservations', [OwnerReservationController::class, 'index']);
        Route::get('reservations/{reservation}', [OwnerReservationController::class, 'show']);
        Route::apiResource('terrains', TerrainController::class);
        Route::get('terrains/{terrain}/reservations', [OwnerReservationController::class, 'terrainIndex']);

        Route::prefix('terrains/{terrain}')->scopeBindings()->group(function () {
            Route::apiResource('availabilities', AvailabilityController::class);
        });
    });

    // Player Routes
    Route::prefix('player')->middleware(['auth:api', 'role:player'])->group(function () {
        Route::post('terrains/{terrain}/reservations', [ReservationController::class, 'store']);
        Route::get('reservations', [ReservationController::class, 'index']);
        Route::get('reservations/{reservation}', [ReservationController::class, 'show']);
        // Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy']);
    });
});
