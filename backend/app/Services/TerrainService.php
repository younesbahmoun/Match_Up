<?php

namespace App\Services;

use App\DataTransferObjects\Terrain\CreateTerrainData;
use App\DataTransferObjects\Terrain\UpdateTerrainData;
use App\Models\Terrain;
use App\Repositories\Contracts\TerrainRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TerrainService
{
    public function __construct(
        protected TerrainRepositoryInterface $terrainRepository
    ) {}

    public function listAll(): Collection
    {
        return $this->terrainRepository->getAll();
    }

    public function listOwnerTerrains($owner): Collection
    {
        return $this->terrainRepository->getByOwnerId($owner);
    }

    public function store($owner, CreateTerrainData $data): Terrain
    {
        // dd($owner);
        $terrain = $this->terrainRepository->create([
            'owner_id' => $owner->id,
            'name' => $data->name,
            'city' => $data->city,
            'address' => $data->address,
            'description' => $data->description,
            'player_count' => $data->playerCount,
            'hour_price' => $data->hourPrice,
        ]);

        // return $terrain->load('owner');
        return $terrain;
    }

    public function update(Terrain $terrain, UpdateTerrainData $data): Terrain
    {
        // dd($data->toArray());
        $this->terrainRepository->update($terrain, $data->toArray());

        // return $terrain->fresh(['owner']);
        return $terrain;
    }

    public function delete(Terrain $terrain): void
    {
        $this->terrainRepository->delete($terrain);
    }
}