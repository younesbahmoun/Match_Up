<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\AuthRepository;
use App\Repositories\Contracts\AuthRepositoryInterface;
use App\Repositories\Contracts\TerrainRepositoryInterface;
use App\Repositories\TerrainRepository;
use App\Repositories\Contracts\AvailabilityRepositoryInterface;
use App\Repositories\AvailabilityRepository;
use App\Repositories\ReservationRepository;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(TerrainRepositoryInterface::class, TerrainRepository::class);
        $this->app->bind(AvailabilityRepositoryInterface::class,AvailabilityRepository::class);
        $this->app->bind(ReservationRepositoryInterface::class, ReservationRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        // 2 requests per minute per user or IP address
        // RateLimiter::for('api', function (Request $request) {
        //     return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        // });

        // For login/register — limit brute force (5/min)
        // RateLimiter::for('auth', function (Request $request) {
        //     return Limit::perMinute(5)
        //         ->by($request->input('email') . '|' . $request->ip())
        //         ->response(function () {
        //             return response()->json([
        //                 'message' => 'Trop de tentatives. Réessayez dans 1 minute.',
        //             ], 429);
        //         });
        // });
    }
}
