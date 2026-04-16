<?php

namespace App\Repositories;

use App\Models\Reservation;
use App\Repositories\Contracts\ReservationRepositoryInterface;

class ReservationRepository implements ReservationRepositoryInterface
{
    public function create(array $data): Reservation
    {
        return Reservation::create($data);
    }

    // public function update(Reservation $reservation, array $data): Reservation
    public function listReservations($player)
    {
        return $player->reservations()->with('terrain.owner')->latest('date')->latest('start_time')->get();
    }

    // public function delete(Reservation $reservation): bool
    // {
    //     return (bool) $reservation->delete();
    // }

    // public function delete(Reservation $reservation): bool
    // {
    //     return (bool) $reservation->delete();
    // }

    // 17:00 → 19:00 exist
    // 18:00 → 20:00 new
    // new_start < existing_end AND new_end > existing_start
    public function hasOverlap(
        int $terrainId,
        string $date,
        string $startTime,
        string $endTime
    ): bool {
        return Reservation::query()
            ->where('terrain_id', $terrainId)
            ->where('date', $date)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->exists();
    }
}