<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Film;
use App\Models\FilmSession;
use App\Models\Hall;

class CustomerDataController extends Controller
{
   
    public function getSessionsData($date)
    {
    
        $sessionArr = FilmSession::where('date', '=', $date)->where('is_active', '=', true)->get();

        $filmIds = $sessionArr->pluck('film_id')->unique();

        $filmArr = Film::whereIn('id', $filmIds)->select('film_name', 'film_duration', 'short_description', 'short_description', 'country', 'id')->get();
        
        $userData = [];

        foreach($filmArr as $film) {
            $hallArr = Film::find($film->id)
                            ->filmSessions()
                            ->where('is_active', '=', true)
                            ->where('date', '=', $date)
                            ->with('hall')
                            ->get()
                            ->unique('hall_id')
                            ->pluck('hall.id');

            $sessions = [];

            foreach($hallArr as $hall) {
                $hallName = Hall::find($hall)->name;
                $sessionsTime = Hall::find($hall)
                                    ->filmSessions()
                                    ->where('is_active', '=', true)
                                    ->where('date', '=', $date)
                                    ->where('film_id', '=', $film->id)
                                    ->select('id', 'session_begin')
                                    ->get();

                array_push($sessions,['hallName' => $hallName, 'sessionsTime' => $sessionsTime]) ;
            };             

            array_push($userData, ['filmData' => $film, 'sessionData' => $sessions]);
         };

       
        return $userData;
    }

}
