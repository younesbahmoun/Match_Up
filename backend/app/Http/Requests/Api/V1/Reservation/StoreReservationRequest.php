<?php

namespace App\Http\Requests\Api\V1\Reservation;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // return $this->user() && $this->user()->role === UserRole::PLAYER->value;
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'terrain_id' => ['required', 'integer', 'exists:terrains,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i:s'],
            'end_time' => ['required', 'date_format:H:i:s', 'after:start_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'Reservation date must be today or in the future.',
            'end_time.after' => 'End time must be after start time.',
        ];
    }
}
