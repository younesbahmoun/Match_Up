<?php

namespace App\Services;

use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\DataTransferObjects\Reservation\CreateReservationData;
use App\Models\Owner;
use App\Models\Reservation;
use App\Models\Terrain;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

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

    public function listOwnerReservations(Owner $owner, array $filters = []): Collection
    {
        return $this->reservationRepository->listOwnerReservations($owner, $filters);
    }

    public function listTerrainReservations(Terrain $terrain, array $filters = []): Collection
    {
        return $this->reservationRepository->listTerrainReservations($terrain, $filters);
    }

    public function findOwnerReservation(Owner $owner, int $reservationId): ?Reservation
    {
        return $this->reservationRepository->findOwnerReservation($owner, $reservationId);
    }

    public function getCalendarDays(Owner $owner, Carbon $month): array
    {
        $startOfMonth = $month->copy()->startOfMonth()->toDateString();
        $endOfMonth = $month->copy()->endOfMonth()->toDateString();

        $reservations = $this->listOwnerReservations($owner, [
            'date_from' => $startOfMonth,
            'date_to' => $endOfMonth,
        ]);

        return $reservations
            ->groupBy(fn (Reservation $reservation) => $reservation->date->format('Y-m-d'))
            ->map(function (Collection $dayReservations, string $date) {
                return [
                    'date' => $date,
                    'reservation_count' => $dayReservations->count(),
                    'confirmed_count' => $dayReservations
                        ->where('status', Reservation::STATUS_CONFIRMED)
                        ->count(),
                    'pending_count' => $dayReservations
                        ->where('status', Reservation::STATUS_PENDING_PAYMENT)
                        ->count(),
                    'failed_count' => $dayReservations
                        ->filter(fn (Reservation $reservation) => in_array(
                            $reservation->status,
                            [Reservation::STATUS_EXPIRED, Reservation::STATUS_PAYMENT_FAILED],
                            true
                        ))
                        ->count(),
                ];
            })
            ->values()
            ->all();
    }

    public function getMonthSummary(Owner $owner, Carbon $month): array
    {
        $startOfMonth = $month->copy()->startOfMonth()->toDateString();
        $endOfMonth = $month->copy()->endOfMonth()->toDateString();

        $reservations = $this->listOwnerReservations($owner, [
            'date_from' => $startOfMonth,
            'date_to' => $endOfMonth,
        ]);

        $revenue = $reservations
            ->where('status', Reservation::STATUS_CONFIRMED)
            ->sum(function (Reservation $reservation) {
                return $this->calculateAmount($reservation);
            });

        return [
            'reservations_this_month' => $reservations->count(),
            'revenue_this_month' => round($revenue, 2),
        ];
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

    private function calculateAmount(Reservation $reservation): float
    {
        if (! $reservation->relationLoaded('terrain')) {
            $reservation->load('terrain');
        }

        $startTime = Carbon::createFromFormat('H:i:s', $reservation->start_time);
        $endTime = Carbon::createFromFormat('H:i:s', $reservation->end_time);
        $durationInMinutes = $endTime->diffInMinutes($startTime);

        return ($durationInMinutes / 60) * (float) $reservation->terrain->hour_price;
    }


    // public function delete(Reservation $reservation): void
    // {
    //     $this->reservationRepository->delete($reservation);
    // }
}
