<?php

namespace App\DataTransferObjects\Auth;

use App\Models\User;

final class AuthResultData
{
    public function __construct(
        public readonly string $accessToken,
        public readonly string $tokenType,
        public readonly int $expiresIn,
        public readonly User $user,
    ) {}
}