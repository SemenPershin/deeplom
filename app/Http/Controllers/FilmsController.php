<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Film;
use App\Http\Requests\FilmStoreRequest;

class FilmsController extends Controller
{
    public function index()
    {
        $data = Film::select('id', 'film_name', 'film_duration', 'short_description', 'country')->get();
        return response()->json($data);
    }

    public function store(FilmStoreRequest $request)
    {   
       
        $filmName = $request->input("name");
        $filmDuration = $request->input("time");
        $filmDescription = $request->input("description");
        $filmCountry = $request->input("country");

        $film = new Film();
        $film->film_name = $filmName;
        $film->film_duration = $filmDuration;
        $film->short_description = $filmDescription;
        $film->country = $filmCountry;
        $film->save();

    }

    public function update(Request $request, string $id)
    {   
        $filmName = $request->input("name");
        $filmDuration = $request->input("time");
        $filmDescription = $request->input("description");
        $filmCountry = $request->input("country");

        Film::find($id)->update(['film_name' => $filmName, 'film_duration' => $filmDuration, 'short_description' => $filmDescription, 'country' => $filmCountry]);
    }

    public function destroy(string $id)
    {
        Film::destroy($id);
    }
}
