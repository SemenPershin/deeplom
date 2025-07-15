<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    protected $fillable = [
        "film_name",
        "film_duration",
    ];

    public function filmSessions() {

        return $this->hasMany(FilmSession::class);
    }
}
