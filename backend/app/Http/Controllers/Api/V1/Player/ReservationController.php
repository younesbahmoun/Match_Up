<?php

namespace App\Http\Controllers\Api\V1\Player;

use App\DataTransferObjects\Reservation\CreateReservationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Reservation\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Terrain;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService,
    ) {
    }

    public function index() {
        $reservations = $this->reservationService->listReservations(auth('api')->user()->player);
        return ReservationResource::collection($reservations);
    }

    public function show(Reservation $reservation) {
        return new ReservationResource($reservation->load('terrain.owner'));
    }
    

    public function store(StoreReservationRequest $request, Terrain $terrain)
    {
        // $this->authorize('create', [Reservation::class, $terrain]);
        // dd(auth('api')->user()->player->reservations->player_id);
        $data = CreateReservationData::fromArray($request->validated(), $terrain->id);

        $reservation = $this->reservationService->create($data, $terrain, auth('api')->user()->player);

        return new ReservationResource($reservation);
    }

    // public function destroy(Reservation $reservation)
    // {
    //     $this->authorize('delete', $reservation);

    //     $this->reservationService->delete($reservation);

    //     return response()->json([
    //         'message' => 'Reservation deleted successfully.',
    //     ]);
    // }
}