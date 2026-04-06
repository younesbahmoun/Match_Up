<?php

namespace App\Services;

use App\DataTransferObjects\Auth\AuthResultData;
use App\DataTransferObjects\Auth\LoginData;
use App\DataTransferObjects\Auth\RegisterData;
use App\Repositories\Contracts\AuthRepositoryInterface;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository
    ) {}

    public function register(RegisterData $data): AuthResultData
    {
        $user = DB::transaction(function () use ($data) {
            $user = $this->authRepository->createUser([
                'name' => $data->name,
                'email' => $data->email,
                'password' => $data->password,
                'role' => $data->role,
            ]);

            if ($data->role === 'player') {
                $this->authRepository->createPlayerProfile([
                    'user_id' => $user->id,
                ]);
            }

            if ($data->role === 'owner') {
                $this->authRepository->createOwnerProfile([
                    'user_id' => $user->id,
                    // 'phone' => $data->phone,
                ]);
            }

            return $user->load(['player', 'owner']);
        });

        $token = JWTAuth::fromUser($user);

        return new AuthResultData(
            accessToken: $token,
            tokenType: 'bearer',
            expiresIn: auth('api')->factory()->getTTL() * 60,
            user: $user,
        );
    }

    public function login(LoginData $data): AuthResultData
    {
        $token = auth('api')->attempt([
            'email' => $data->email,
            'password' => $data->password,
        ]);

        if (! $token) {
            throw new UnauthorizedHttpException('', 'Invalid credentials.');
        }

        $user = auth('api')->user();

        return new AuthResultData(
            accessToken: $token,
            tokenType: 'bearer',
            expiresIn: auth('api')->factory()->getTTL() * 60,
            user: $user,
        );
    }

    public function me(): ?\App\Models\User
    {
        return auth('api')->user();
    }

    public function logout(): void
    {
        auth('api')->logout();
    }
}