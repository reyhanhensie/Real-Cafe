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
    public function show($id)
    {
        return Milkshake::findOrFail(id: $id);
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        // Find the specific resource by its ID
        $data = Milkshake::findOrFail(id: $id);

        // Update the resource with the validated data
        $data->update($request->all());

        // Return a success response
        return response()->json([
            'data' => $data
        ], 200);
    }

    // Remove the specified resource from storage
    public function destroy(Milkshake $Milkshake)
    {
        $Milkshake->delete();

        return response()->json(null, 204);
    }
}
