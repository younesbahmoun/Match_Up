<?php

namespace App\Policies;

use App\Models\Terrain;
use App\Models\Availability;
use App\Models\User;

class AvailabilityPolicy
{
    public function viewAny(User $user, Availability $availability): bool
    {
        return true;
    }

    public function view(User $user, Availability $availability): bool
    {
        return true;
    }

    public function create(User $user, Terrain $terrain): bool
    {
        return $terrain->owner_id === $user->owner?->id;
    }
    
    public function update(User $user, Availability $availability): bool
    {
        return $availability->terrain->owner_id === $user->owner?->id;
    }

    public function delete(User $user, Availability $availability): bool
    {
        return $availability->terrain->owner_id === $user->owner?->id;
    }
}
