<?php

namespace App\Repositories;

use App\Models\Terrain;
use App\Repositories\Contracts\TerrainRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TerrainRepository implements TerrainRepositoryInterface
{
    public function create(array $data): Terrain
    {
        return Terrain::create($data);
    }

    public function getAll(): Collection
    {
        return Terrain::with('owner')->latest()->get();
    }

    public function getByOwnerId($owner): Collection
    {
        // return Terrain::with('owner')->where('user_id', $owner->id)->latest()->get();
        return $owner->terrains()->latest()->get();
    }

    public function update(Terrain $terrain, array $data): bool
    {
        return $terrain->update($data);
    }

    public function delete(Terrain $terrain): bool
    {
        return (bool) $terrain->delete();
    }
}