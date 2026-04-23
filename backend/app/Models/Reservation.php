<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_PAYMENT_FAILED = 'payment_failed';

    protected $fillable = [
        'player_id',
        'terrain_id',
        'date',
        'start_time',
        'end_time',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'confirmed_at' => 'datetime',
        ];
    }

    public function player()
    {
        return $this->belongsTo(Player::class, 'player_id');
    }

    public function terrain()
    {
        return $this->belongsTo(Terrain::class, 'terrain_id');
    }
}
