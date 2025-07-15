<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hall;
use App\Models\Seat;


class SeatsController extends Controller
{
    
    public function index()
    {
        $seats = Seat::select('id', 'hall_id', 'seat_number', 'seat_type')->get();

        return response()->json($seats);
    }

    public function store(Request $request)
    {
        $rows = $request->input("rows");
        $places = $request->input("places");

        $hallId = $request->input('hall_id');

        $default = $request->input('default');
        $vip = $request->input('vip');
        $disabled = $request->input('disabled');

        $hall = Hall::find($hallId);
        
        $hall->update(['rows' => $rows]);
        $hall->update(['places' => $places]);

        if (is_array($default)) {
            foreach ($default as $seat) {
                if ($hall->seats()->where('seat_number', '=', $seat)->exists()) {
                    $hall->seats()->where('seat_number', '=', $seat)->update(['seat_type' => 'default']);
                } else {
                    $hall->seats()->create(["seat_number" => $seat, 'seat_type' => 'default']);
                }
                
            };
        }

        if (is_array($vip)) {
            foreach ($vip as $seat) {
                if ($hall->seats()->where('seat_number', '=', $seat)->exists()) {
                    $hall->seats()->where('seat_number', '=', $seat)->update(['seat_type' => 'vip']);
                } else {
                    $hall->seats()->create(["seat_number" => $seat, 'seat_type' => 'vip']);
                }
                
            };
        }

        if (is_array($disabled)) {
            foreach ($disabled as $seat) {
                if ($hall->seats()->where('seat_number', '=', $seat)->exists()) {
                    $hall->seats()->where('seat_number', '=', $seat)->update(['seat_type' => 'disabled']);
                } else {
                    $hall->seats()->create(["seat_number" => $seat, 'seat_type' => 'disabled']);
                }
                
            };
        }

    }
    
    public function price(Request $request) 
    {
        // $priceVip = $request->input('vip_price');
        // $priceDefault = $request->input('default_price');
        // $hallId = $request->input("hall_id");

        // $hall = Hall::find($hallId);

        // $hall->defaultSeats()->update(['price' => $priceDefault]);
        // $hall->vipSeats()->update(['price' => $priceVip]);
    }

}
