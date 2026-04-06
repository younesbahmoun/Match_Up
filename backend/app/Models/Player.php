<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Player extends Model
// {
//     public function user() {
//         return $this->belongsTo(User::class);
//     }

//     // public function team() {
//     //     return $this->belongsTo(Team::class);
//     // }

//     // public function position() {
//     //     return $this->belongsTo(Position::class);
//     // }

//     // public function matches() {
//     //     return $this->belongsToMany(Match::class, 'match_player', 'player_id', 'match_id');
//     // }

//     // public function stats() {
//     //     return $this->hasMany(PlayerStats::class);
//     // }

// }


namespace App\Models;
use Illuminate\Database\Eloquent\Model;


class Player extends Model
{
    protected $fillable = ['user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}