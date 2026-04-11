<?php

namespace App\Policies;

use App\Models\Terrain;
use App\Models\User;

class TerrainPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'owner';
    }

    public function update(User $user, Terrain $terrain): bool
    {
        return $user->role === 'owner' && $terrain->user_id === $user->id;
    }

    public function delete(User $user, Terrain $terrain): bool
    {
        return $user->role === 'owner' && $terrain->user_id === $user->id;
    }
}