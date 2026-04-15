<?php

namespace App\Http\Requests\Api\V1\Terrain;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\DayOfWeek;

class StoreAvailabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'terrain_id' => ['required', 'integer', 'exists:terrains,id'],
            'day_of_week' => ['required', new Enum(DayOfWeek::class)],
            'start_time' => ['required', 'date_format:H:i:s'],
            'end_time' => ['required', 'date_format:H:i:s', 'after:start_time'], //after_or_equal
            // 'is_active' => ['sometimes', 'boolean'],
        ];
    }

    // public function messages() {
    //     return [
    //         'day_of_week' => 'test',
    //     ];
    // }
}
