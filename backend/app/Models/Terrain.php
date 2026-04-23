<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Terrain extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'address',
        'description',
        'city',
        // 'price_per_hour',
        'hour_price',
        'player_count',
        // 'image',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class, 'owner_id');
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
