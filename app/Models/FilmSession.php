<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FilmSession extends Model
{
    protected $fillable = [
        "session_begin",
        'session_end',
        'film_id',
        'hall_id',
        'price_vip',
        'price_default',
        'is_active'
    ];

    public function film() {
        
        return $this->belongsTo(Film::class);
    }
    
    public function hall() {

        return $this->belongsTo(Hall::class);
    }
}
