<?php

namespace App\Repositories\Contracts;

use App\Models\Owner;
use App\Models\Reservation;
use App\Models\Terrain;
use Illuminate\Database\Eloquent\Collection;

interface ReservationRepositoryInterface
{
    public function create(array $data): Reservation;

    public function listReservations($player): Collection;

    public function listOwnerReservations(Owner $owner, array $filters = []): Collection;

    public function listTerrainReservations(Terrain $terrain, array $filters = []): Collection;

    public function findOwnerReservation(Owner $owner, int $reservationId): ?Reservation;

    public function hasOverlap(
        int $terrainId,
        string $date,
        string $startTime,
        string $endTime
    ): bool;
}
