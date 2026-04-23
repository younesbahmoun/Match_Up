<?php

namespace App\Http\Controllers\Api\V1\Owner;

use App\DataTransferObjects\Terrain\CreateTerrainData;
use App\DataTransferObjects\Terrain\UpdateTerrainData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Terrain\StoreTerrainRequest;
use App\Http\Requests\Api\V1\Terrain\UpdateTerrainRequest;
use App\Http\Resources\TerrainResource;
use App\Models\Terrain;
use App\Services\TerrainService;

class TerrainController extends Controller
{
    public function __construct(
        protected TerrainService $terrainService
    ) {}

    // Public: all terrains
    public function publicIndex()
    {
        $terrains = $this->terrainService->listAll();

        return TerrainResource::collection($terrains);
    }

    // Owner: only his terrains
    public function index()
    {
        // $owner = auth('api')->user();
        $owner = auth('api')->user()->owner;
        // dd($owner->terrains()->get());

        $terrains = $this->terrainService->listOwnerTerrains($owner);

        return TerrainResource::collection($terrains);
    }

    // Public: terrain details
    public function publicShow(Terrain $terrain)
    {
        $terrain->load('owner.user');

        return new TerrainResource($terrain);
    }

    // Owner: one of his terrains
    public function show(Terrain $terrain)
    {
        $this->authorize('update', $terrain);

        $terrain->load('owner.user');

        return new TerrainResource($terrain);
    }

    // Owner only
    public function store(StoreTerrainRequest $request)
    {
        $this->authorize('create', Terrain::class);

        $owner = auth('api')->user()->owner;

        // dd($request->validated());
        // $data = $request->validated();
        // dd($data['player_count'] === 10);

        $dto = CreateTerrainData::fromArray($request->validated());

        // dd($dto);
        // dd($dto->playerCount);

        $terrain = $this->terrainService->store($owner, $dto);

        return new TerrainResource(
            $terrain->load('owner.user')
        );

    }

    // Owner only
    public function update(UpdateTerrainRequest $request, Terrain $terrain)
    {
        $this->authorize('update', $terrain);

        $dto = UpdateTerrainData::fromArray($request->validated());

        $updatedTerrain = $this->terrainService->update($terrain, $dto);

        return new TerrainResource(
            $updatedTerrain->load('owner.user')
        );
    }

    // Owner only
    public function destroy(Terrain $terrain)
    {
        $this->authorize('delete', $terrain);

        $this->terrainService->delete($terrain);

        return response()->json([
            'message' => 'Terrain deleted successfully.',
        ]);
    }
}
