<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Film;
use App\Models\FilmSession;
use App\Models\Hall;
use App\Models\Ticket;

class HallController extends Controller
{
    
    public function returnPage($id)

    {
        $hallName = FilmSession::find($id)->hall()->value('name');
        $sessionBegin = FilmSession::find($id)->session_begin;
        $filmName = FilmSession::find($id)->film()->value('film_name');

        $vipPrice = FilmSession::find($id)->price_vip;
        $defaultPrice = FilmSession::find($id)->price_default;

        $seatsArr = FilmSession::find($id)->hall->seats;
        foreach($seatsArr as &$seat) {
            if (Ticket::where('seat_id', $seat->id)->exists()) {
                $seat->seat_type = 'taken';
            }
        }
        $hallInfo = FilmSession::find($id)->hall()->select('rows', 'places')->get();

        $sessionInfo = ['hall_name' => $hallName, 'session_begin' => $sessionBegin, 'film_name' => $filmName, 'session_id' => $id, 'price_vip' => $vipPrice, 'price_default' => $defaultPrice];


        return Inertia::render('hall', ['sessionInfo' => $sessionInfo, 'seats' => $seatsArr, 'hallInfo' => $hallInfo]);;
    }

}
