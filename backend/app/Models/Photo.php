<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'path',
        'disk',
    ];

    protected $appends = ['url'];

    // Zid url directly f response
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function photoable()
    {
        return $this->morphTo();
    }
}
