<?php

namespace App\Services;

use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\DataTransferObjects\Reservation\CreateReservationData;
use App\Models\Reservation;
use App\Models\Terrain;
use App\Models\User;
use Carbon\Carbon;
use DomainException;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {
    }

    public function listReservations($player)
    {
        return $this->reservationRepository->listReservations($player);
    }

    public function create(CreateReservationData $data, Terrain $terrain, $player): Reservation
    {
        $reservationDate = Carbon::parse($data->date);
        $dayOfWeek = (int) $reservationDate->dayOfWeekIso; // 1 monday ... 7 sunday

        $hasMatchingAvailability = $terrain->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', '<=', $data->startTime)
            ->where('end_time', '>=', $data->endTime)
            ->exists();

        if (!$hasMatchingAvailability) {
            throw new DomainException('The selected time is outside terrain availability.');
        }

        $hasOverlap = $this->reservationRepository->hasOverlap(
            terrainId: $terrain->id,
            date: $data->date,
            startTime: $data->startTime,
            endTime: $data->endTime,
        );

        if ($hasOverlap) {
            throw new DomainException('This terrain is already reserved for the selected time range.');
        }

        $reservation = $this->reservationRepository->create([
            'player_id' => $player->id,
            'terrain_id' => $terrain->id,
            'date' => $data->date,
            'start_time' => $data->startTime,
            'end_time' => $data->endTime,
        ]);

        return $reservation->load('terrain');
    }


    // public function delete(Reservation $reservation): void
    // {
    //     $this->reservationRepository->delete($reservation);
    // }
}