<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jus; // Import your model

class JusController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return Jus::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $Jus = Jus::create($request->all());

        return response()->json($Jus, 201);
    }

    // Display the specified resource
    public function show(Jus $Jus)
    {
        return $Jus;
    }

    // Update the specified resource in storage
    public function update(Request $request, Jus $Jus)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $Jus->update($request->all());

        return response()->json($Jus, 200);
    }

    // Remove the specified resource from storage
    public function destroy(Jus $Jus)
    {
        $Jus->delete();

        return response()->json(null, 204);
    }
}
