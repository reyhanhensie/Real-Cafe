<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Milkshake; // Import your model

class MilkshakeController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return Milkshake::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $Milkshake = Milkshake::create($request->all());

        return response()->json($Milkshake, 201);
    }

    // Display the specified resource
    public function show(Milkshake $Milkshake)
    {
        return $Milkshake;
    }

    // Update the specified resource in storage
    public function update(Request $request, Milkshake $Milkshake)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $Milkshake->update($request->all());

        return response()->json($Milkshake, 200);
    }

    // Remove the specified resource from storage
    public function destroy(Milkshake $Milkshake)
    {
        $Milkshake->delete();

        return response()->json(null, 204);
    }
}
