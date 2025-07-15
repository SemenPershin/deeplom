<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    protected $fillable = [
        "rows",
        "places",
    ];

    public function seats() {
        
        return $this->hasMany(Seat::class);

    }

   
    
    public function filmSessions() {
        return $this->hasMany(FilmSession::class);
    }
}
