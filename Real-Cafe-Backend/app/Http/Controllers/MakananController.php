<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Makanan; // Import your model

class MakananController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return Makanan::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $Makanan = Makanan::create($request->all());

        return response()->json($Makanan, 201);
    }

    // Display the specified resource
    public function show(Makanan $Makanan)
    {
        return $Makanan;
    }

    // Update the specified resource in storage
    public function update(Request $request, Makanan $Makanan)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $Makanan->update($request->all());

        return response()->json($Makanan, 200);
    }

    // Remove the specified resource from storage
    public function destroy(Makanan $Makanan)
    {
        $Makanan->delete();

        return response()->json(null, 204);
    }
}
