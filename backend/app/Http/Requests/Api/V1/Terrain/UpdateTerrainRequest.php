<?php

namespace App\Http\Requests\Api\V1\Terrain;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTerrainRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:255'],
            'address' => ['sometimes', 'string', 'max:500'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'player_count' => ['sometimes', 'integer', 'min:1'],
            'hour_price' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
