<?php

namespace App\Repositories\Contracts;

use App\Models\Owner;
use App\Models\Terrain;
use Illuminate\Database\Eloquent\Collection;

interface TerrainRepositoryInterface
{
    public function create(array $data): Terrain;

    public function getAll(): Collection;

    public function getByOwnerId(Owner $owner): Collection;

    public function update(Terrain $terrain, array $data): bool;

    public function delete(Terrain $terrain): bool;
}
