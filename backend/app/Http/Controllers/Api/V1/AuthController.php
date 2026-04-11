<?php

namespace App\Http\Controllers\Api\V1;

use App\DataTransferObjects\Auth\LoginData;
use App\DataTransferObjects\Auth\RegisterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\AuthResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {
    }

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

    public function refresh(): AuthResource
    {
        return new AuthResource(
            $this->authService->refresh()
        );
    }


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'Reset link sent.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new \Exception('Reset failed');
        }

        return response()->json([
            'message' => 'Password reset successful'
        ]);
    }
}   