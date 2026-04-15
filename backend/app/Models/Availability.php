<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\DayOfWeek;

class Availability extends Model
{
    protected $fillable = [
        'terrain_id',
        'day_of_week',
        'start_time',
        'end_time',
        // 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => DayOfWeek::class,
            // 'is_active' => 'boolean',
        ];
    }
}
