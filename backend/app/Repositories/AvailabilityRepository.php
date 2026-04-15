<?php

namespace App\Repositories;

use App\Models\Availability;
use App\Models\Terrain;
use App\Repositories\Contracts\AvailabilityRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AvailabilityRepository implements AvailabilityRepositoryInterface
{
    public function create(array $data): Availability
    {
        return Availability::create($data);
    }

    public function update(Availability $availability, array $data): Availability
    {
        $availability->update($data);

        return $availability->fresh(['terrain']);
    }

    public function delete(Availability $availability): bool
    {
        return $availability->delete();
    }

    public function getTerrainAvailabilities($terrain): Collection
    {
        return $terrain->availabilities()->orderBy('day_of_week')->orderBy('start_time')->get();
    }

    public function hasOverlap($terrain, int $dayOfWeek, string $startTime, string $endTime, ?int $ignoreId = null): bool {
    return $terrain->availabilities()
        ->where('day_of_week', $dayOfWeek)
        ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
        ->where('end_time', '>', $startTime)
        ->where('start_time', '<', $endTime)
        ->exists();
    }
}