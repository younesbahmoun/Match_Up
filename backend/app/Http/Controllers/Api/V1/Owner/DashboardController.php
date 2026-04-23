<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Services\ReservationService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $owner = auth('api')->user()->owner;
        $month = $this->resolveMonth($request->query('month'));
        $recentReservations = $this->reservationService->listOwnerReservations($owner, [
            'limit' => 5,
        ]);
        $monthSummary = $this->reservationService->getMonthSummary($owner, $month);

        return response()->json([
            'month' => $month->format('Y-m'),
            'stats' => [
                'total_terrains' => $owner->terrains()->count(),
                'active_slots' => $owner->availabilities()->count(),
                'reservations_this_month' => $monthSummary['reservations_this_month'],
                'revenue_this_month' => $monthSummary['revenue_this_month'],
            ],
            'recent_reservations' => ReservationResource::collection($recentReservations)->resolve(),
            'calendar_days' => $this->reservationService->getCalendarDays($owner, $month),
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
