<?php

namespace App\Policies;

use App\Models\Terrain;
use App\Models\User;
use App\Enums\UserRole;


class TerrainPolicy
{
    public function view(User $user, Terrain $terrain): bool
    {
        return true;
    }

    public function viewAny(User $user, Terrain $terrain): bool
    {
        return true;
    }


    public function create(User $user): bool
    {
        return $user->role === UserRole::OWNER->value;
    }

    public function update(User $user, Terrain $terrain): bool
    {
        return $terrain->owner_id === $user->id;
    }

    public function delete(User $user, Terrain $terrain): bool
    {
        return $terrain->owner_id === $user->id;
    }
}