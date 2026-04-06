<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Player;
use App\Models\Owner;
use App\Repositories\Contracts\AuthRepositoryInterface;

class AuthRepository implements AuthRepositoryInterface
{
    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
    public function createPlayerProfile(array $data): Player
    {
        return Player::create($data);
    }

    public function createOwnerProfile(array $data): Owner
    {
        return Owner::create($data);
    }
}