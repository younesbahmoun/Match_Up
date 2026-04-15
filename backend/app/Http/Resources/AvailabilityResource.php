<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'terrain_id' => $this->terrain_id,
            'day_of_week' => $this->day_of_week->value,
            'day_label' => $this->day_of_week->label(),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            // 'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'terrain' => new TerrainResource($this->whenLoaded('terrain')),
        ];
    }
}
