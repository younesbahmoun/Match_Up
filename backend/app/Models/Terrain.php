<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }
}
