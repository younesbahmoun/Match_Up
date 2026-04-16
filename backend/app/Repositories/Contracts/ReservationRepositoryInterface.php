<?php

namespace App\Repositories\Contracts;

use App\Models\Reservation;

interface ReservationRepositoryInterface
{
    public function create(array $data): Reservation;
    // public function delete(Reservation $reservation): bool;
    public function listReservations($player);
    public function hasOverlap(
        int $terrainId,
        string $date,
        string $startTime,
        string $endTime
    ): bool;
}