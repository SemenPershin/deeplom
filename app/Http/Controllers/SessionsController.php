<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hall;
use App\Models\FilmSession;

class SessionsController extends Controller
{
  
    public function index()
    {
        $sessionData = FilmSession::select('id', 'hall_id', 'film_id', 'session_begin', 'session_end', 'date', 'price_vip', 'price_default', 'is_active')->get();
        

        return response()->json($sessionData);
    }

    public function store(Request $request)
    {
        $hallId = $request->input('hall_id');
        $filmId = $request->input('film_id');
        $sessionBegin = $request->input('session_begin');
        $sessionEnd = $request->input('session_end');
        $date = $request->input('date');
        $vipPrice = $request->input('price_vip');
        $defaultPrice = $request->input('price_default');

        $sessionArr = Hall::find($hallId)->filmSessions();

        $overlaidSession = $sessionArr->where('date', '=', $date)->where('session_begin', '<=', $sessionEnd)->where('session_end', '>=', $sessionBegin)->exists();

        if ($overlaidSession) {
            return response()->json(['error' => 'Наложение сеансов'], 422);
        } else {
            $session = new FilmSession();
            $session->film_id = $filmId;
            $session->hall_id = $hallId;

            $session->session_begin = $sessionBegin;
            $session->session_end = $sessionEnd;
            $session->date = $date;

            $session->price_vip = $vipPrice;
            $session->price_default = $defaultPrice;

            $session->save();
        }

    }
    
    public function update(Request $request, string $id)
    {
        $session = FilmSession::find($id);

        $hallId = $request->input('hall_id');
        $filmId = $request->input('film_id');
        $sessionBegin = $request->input('session_begin');
        $sessionEnd = $request->input('session_end');
        $date = $request->input('date');
        $vipPrice = $request->input('price_vip');
        $defaultPrice = $request->input('price_default');

        $session->film_id = $filmId;
        $session->hall_id = $hallId;

        $session->session_begin = $sessionBegin;
        $session->session_end = $sessionEnd;
        $session->date = $date;

        $session->price_vip = $vipPrice;
        $session->price_default = $defaultPrice;

        $session->save();
    }

     public function activate(Request $request)
    {
        $idArr = $request->input('ids');
        
        if(is_array($idArr)) {
            foreach ($idArr as $id) {
                $session = FilmSession::find($id);
                $session->update(['is_active' => true]);
            }
        }
        
        
    }

    public function deactivate(Request $request)
    {
        $idArr = $request->input('ids');
        
        if(is_array($idArr)) {
            foreach ($idArr as $id) {
                $session = FilmSession::find($id);
                $session->update(['is_active' => false]);
            }
        }
        
        
    }

    public function destroy(string $id)
    {
        FilmSession::destroy($id);
    }
}
