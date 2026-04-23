<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Terrain;
use App\Services\ReservationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $owner = auth('api')->user()->owner;
        $filters = $this->validatedFilters($request);
        $reservations = $this->reservationService->listOwnerReservations($owner, $filters);

        return ReservationResource::collection($reservations);
    }

    public function show(Reservation $reservation): ReservationResource
    {
        $owner = auth('api')->user()->owner;
        $reservation = $this->reservationService->findOwnerReservation($owner, $reservation->id);

        if (! $reservation) {
            throw new NotFoundHttpException();
        }

        return new ReservationResource($reservation);
    }

    public function calendar(Request $request)
    {
        $owner = auth('api')->user()->owner;
        $month = $this->resolveMonth($request->query('month'));

        return response()->json([
            'month' => $month->format('Y-m'),
            'calendar_days' => $this->reservationService->getCalendarDays($owner, $month),
        ]);
    }

    public function terrainIndex(Request $request, Terrain $terrain): AnonymousResourceCollection
    {
        abort_unless(
            $terrain->owner_id === auth('api')->user()?->owner?->id,
            404
        );

        $filters = $this->validatedFilters($request);
        $reservations = $this->reservationService->listTerrainReservations($terrain, $filters);

        return ReservationResource::collection($reservations);
    }

    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'terrain_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'string'],
            'date' => ['nullable', 'date'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
    }

    private function resolveMonth(mixed $value): Carbon
    {
        if (! is_string($value) || trim($value) === '') {
            return now()->startOfMonth();
        }

        try {
            return Carbon::createFromFormat('Y-m', $value)->startOfMonth();
        } catch (\Throwable) {
            return now()->startOfMonth();
        }
    }
}
