<?php

namespace App\Services;

use App\DataTransferObjects\Terrain\CreateAvailabilityData;
use App\DataTransferObjects\Terrain\UpdateAvailabilityData;
use App\Models\Availability;
use App\Models\Terrain;
use App\Repositories\Contracts\AvailabilityRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;

class AvailabilityService
{
    public function __construct(
        private readonly AvailabilityRepositoryInterface $availabilityRepository
    ) {
    }

    public function getTerrainAvailabilities($terrain): Collection
    {
        return $this->availabilityRepository->getTerrainAvailabilities($terrain);
    }

    public function create(CreateAvailabilityData $data, Terrain $terrain): Availability
    {
        $this->ensureNoOverlap($terrain, $data->dayOfWeek->value, $data->startTime, $data->endTime);

        // new_start < existing_end && new_end > existing_start
        $availability = $this->availabilityRepository->create([
            'terrain_id' => $terrain->id,
            'day_of_week' => $data->dayOfWeek->value,
            'start_time' => $data->startTime,
            'end_time' => $data->endTime,
        ]);

        return $availability->fresh(['terrain']);
    }

    // public function update(Availability $availability, UpdateAvailabilityData $data): Availability
    // {
    //     $currentDayOfWeek = $availability->day_of_week->value;
    //     $currentStartTime = $availability->start_time;
    //     $currentEndTime = $availability->end_time;

    //     $newDayOfWeek = $data->dayOfWeekProvided
    //         ? $data->dayOfWeek?->value
    //         : $currentDayOfWeek;

    //     $newStartTime = $data->startTimeProvided
    //         ? $data->startTime
    //         : $currentStartTime;

    //     $newEndTime = $data->endTimeProvided
    //         ? $data->endTime
    //         : $currentEndTime;


    //     return $this->availabilityRepository->update($availability, $data->toArray());
    // }


    public function update(UpdateAvailabilityData $data, Availability $availability): Availability
    {
        $this->ensureNoOverlap(
            $availability->terrain,
            $availability->day_of_week->value,
            $data->startTime,
            $data->endTime,
            $availability->id
        );

        $availability = $this->availabilityRepository->update($availability, [
            'start_time' => $data->startTime,
            'end_time' => $data->endTime,
        ]);

        return $availability->fresh(['terrain']);
    }
    public function delete(Availability $availability): bool
    {
        return $this->availabilityRepository->delete($availability);
    }

    private function ensureNoOverlap($terrain, $dayOfWeek, $startTime, $endTime, ?int $ignoreId = null): void
    {
        if ($this->availabilityRepository->hasOverlap($terrain, $dayOfWeek, $startTime, $endTime, $ignoreId)) {
            throw new DomainException('Please choose another time.');
        }
    }


}