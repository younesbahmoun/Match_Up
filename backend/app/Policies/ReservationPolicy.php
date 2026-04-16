<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Reservation;
use App\Models\Terrain;
use App\Models\User;

class ReservationPolicy
{

    public function index(User $user): bool
    {
        return $user->role === UserRole::PLAYER->value;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::PLAYER->value;
    }

    public function view(User $user, Reservation $reservation): bool
    {
        return $reservation->player->user_id === $user->id;
    }

    public function delete(User $user, Reservation $reservation): bool
    {
        return $reservation->player->user_id === $user->id;
    }
}