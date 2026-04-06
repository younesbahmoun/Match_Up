<?php

namespace App\Http\Controllers\Api\V1;

use App\DataTransferObjects\Auth\LoginData;
use App\DataTransferObjects\Auth\RegisterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\Auth\AuthResource;
use App\Http\Resources\Auth\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): AuthResource
    {
        $dto = RegisterData::fromArray($request->validated());
        $result = $this->authService->register($dto);
        return new AuthResource($result);
    }

    public function login(LoginRequest $request): AuthResource
    {
        $dto = LoginData::fromArray($request->validated());
        $result = $this->authService->login($dto);

        return new AuthResource($result);
    }

    public function me(): UserResource
    {
        return new UserResource($this->authService->me());
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}