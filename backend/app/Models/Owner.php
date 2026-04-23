<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Owner extends Model
{
    protected $fillable = ['user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function terrains()
    {
        return $this->hasMany(Terrain::class);
    }

    public function availabilities(): HasManyThrough
    {
        return $this->hasManyThrough(
            Availability::class,
            Terrain::class,
            'owner_id',
            'terrain_id'
        );
    }

    public function reservations(): HasManyThrough
    {
        return $this->hasManyThrough(
            Reservation::class,
            Terrain::class,
            'owner_id',
            'terrain_id'
        );
    }
}
