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
        //
    }
}
