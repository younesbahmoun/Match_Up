<?php

namespace App\Repositories;

use App\Models\Owner;
use App\Models\Reservation;
use App\Models\Terrain;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ReservationRepository implements ReservationRepositoryInterface
{
    public function create(array $data): Reservation
    {
        return Reservation::create($data);
    }

    public function listReservations($player): Collection
    {
        return $player->reservations()
            ->with(['terrain.owner.user', 'player.user'])
            ->latest('date')
            ->latest('start_time')
            ->get();
    }

    public function listOwnerReservations(Owner $owner, array $filters = []): Collection
    {
        return $this->applyFilters(
            $this->ownerQuery($owner),
            $filters
        )
            ->latest('date')
            ->latest('start_time')
            ->get();
    }

    public function listTerrainReservations(Terrain $terrain, array $filters = []): Collection
    {
        return $this->applyFilters(
            Reservation::query()
                ->where('terrain_id', $terrain->id)
                ->with(['terrain.owner.user', 'player.user']),
            $filters
        )
            ->latest('date')
            ->latest('start_time')
            ->get();
    }

    public function findOwnerReservation(Owner $owner, int $reservationId): ?Reservation
    {
        return $this->ownerQuery($owner)
            ->where('id', $reservationId)
            ->first();
    }

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

    private function ownerQuery(Owner $owner): Builder
    {
        return Reservation::query()
            ->whereHas('terrain', function (Builder $query) use ($owner) {
                $query->where('owner_id', $owner->id);
            })
            ->with(['terrain.owner.user', 'player.user']);
    }

    private function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['terrain_id'] ?? null, function (Builder $builder, $terrainId) {
                $builder->where('terrain_id', $terrainId);
            })
            ->when($filters['status'] ?? null, function (Builder $builder, $status) {
                $builder->where('status', $status);
            })
            ->when($filters['date'] ?? null, function (Builder $builder, $date) {
                $builder->whereDate('date', $date);
            })
            ->when($filters['date_from'] ?? null, function (Builder $builder, $dateFrom) {
                $builder->whereDate('date', '>=', $dateFrom);
            })
            ->when($filters['date_to'] ?? null, function (Builder $builder, $dateTo) {
                $builder->whereDate('date', '<=', $dateTo);
            })
            ->when($filters['limit'] ?? null, function (Builder $builder, $limit) {
                $builder->limit((int) $limit);
            });
    }
}
