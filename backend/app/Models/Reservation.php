<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'player_id',
        'terrain_id',
        'date',
        'start_time',
        'end_time',
        // 'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            // 'start_time' => 'time:H',
            // 'end_time' => 'time:H',
            // 'status' => ReservationStatus::class,
        ];
    }
}
