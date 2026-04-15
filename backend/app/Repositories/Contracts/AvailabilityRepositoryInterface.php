<?php

namespace App\Repositories\Contracts;

use App\Models\Availability;
use App\Models\Terrain;
use Illuminate\Database\Eloquent\Collection;

interface AvailabilityRepositoryInterface
{
    public function create(array $data): Availability;

    public function update(Availability $availability, array $data): Availability;

    public function delete(Availability $availability): bool;

    public function getTerrainAvailabilities($terrain): Collection;

    public function hasOverlap($terrain, int $dayOfWeek, string $startTime, string $endTime, ?int $ignoreId = null): bool;
}