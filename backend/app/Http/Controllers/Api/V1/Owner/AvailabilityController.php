<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\DataTransferObjects\Terrain\CreateAvailabilityData;
use App\DataTransferObjects\Terrain\UpdateAvailabilityData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Terrain\UpdateAvailabilityRequest;
use App\Http\Requests\Api\V1\Terrain\StoreAvailabilityRequest;
use App\Http\Resources\AvailabilityResource;
use App\Models\Availability;
use App\Models\Terrain;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AvailabilityController extends Controller
{
    public function __construct(
        private readonly AvailabilityService $availabilityService
    ) {}

    public function publicIndex(Terrain $terrain): AnonymousResourceCollection
    {
        $availabilities = $this->availabilityService->getTerrainAvailabilities($terrain);

        return AvailabilityResource::collection($availabilities);
    }

    public function index(Terrain $terrain): AnonymousResourceCollection
    {
        $this->ensureOwnerTerrain($terrain);

        $availabilities = $this->availabilityService->getTerrainAvailabilities($terrain);

        return AvailabilityResource::collection(
            $availabilities
        );
    }

    public function store(StoreAvailabilityRequest $request, Terrain $terrain)
    {
        // $this->authorize('create', [Availability::class, $terrain]);
        $this->authorize('create', $terrain);
        // dd($request->validated());

        $data = CreateAvailabilityData::fromArray($request->validated());

        // dd($data);

        $availability = $this->availabilityService->create($data, $terrain);
        // dd($availability);
        return new AvailabilityResource($availability);
    }

    public function publicShow(Terrain $terrain, Availability $availability): AvailabilityResource
    {
        return new AvailabilityResource($availability);
    }

    public function show(Terrain $terrain, Availability $availability): AvailabilityResource
    {
        $this->ensureOwnerTerrain($terrain);

        return new AvailabilityResource(
            $availability
            // $availability->loadMissing('terrain')
        );
    }

    public function update(
        UpdateAvailabilityRequest $request,
        Terrain $terrain,
        Availability $availability
    ): AvailabilityResource {
        $this->authorize('update', [$terrain, $availability]);

        $data = UpdateAvailabilityData::fromArray($request->validated());

        $availability = $this->availabilityService->update($data, $availability);

        return new AvailabilityResource($availability);
    }

    public function destroy(Terrain $terrain, Availability $availability): JsonResponse
    {
        $this->authorize('delete', $availability);
        $this->availabilityService->delete($availability);

        return response()->json([
            'message' => 'Availability deleted successfully.',
        ]);
    }

    private function ensureOwnerTerrain(Terrain $terrain): void
    {
        abort_unless(
            $terrain->owner_id === auth('api')->user()?->owner?->id,
            404
        );
    }
}
