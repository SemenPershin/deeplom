<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hall;

class HallManagement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Hall::select("id", 'name', 'rows', 'places')->get();
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $nameOfHall = $request->input("name");
        $hall = new Hall();
        $hall->name = $nameOfHall;
        $hall->rows = 10;
        $hall->places = 10;
        $hall->save();

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Hall::destroy($id);
    }
}
