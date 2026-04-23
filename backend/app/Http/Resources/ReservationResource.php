<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $amount = null;

        if ($this->relationLoaded('terrain') && $this->terrain) {
            $startTime = Carbon::createFromFormat('H:i:s', $this->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $this->end_time);
            $durationInMinutes = $endTime->diffInMinutes($startTime);
            $amount = round(($durationInMinutes / 60) * (float) $this->terrain->hour_price, 2);
        }

        return [
            'id' => $this->id,
            'terrain_id' => $this->terrain_id,
            'date' => $this->date->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'amount' => $amount,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'terrain' => new TerrainResource($this->whenLoaded('terrain')),
            'player' => $this->whenLoaded('player', function () {
                $user = $this->player?->user;

                if (! $user) {
                    return null;
                }

                return [
                    'id' => $this->player->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];
            }),
        ];
    }
}
