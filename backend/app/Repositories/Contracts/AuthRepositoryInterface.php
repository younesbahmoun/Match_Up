<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface AuthRepositoryInterface
{
    public function createUser(array $data): User;

    public function findByEmail(string $email): ?User;
    public function createPlayerProfile(array $data);
    public function createOwnerProfile(array $data);
}