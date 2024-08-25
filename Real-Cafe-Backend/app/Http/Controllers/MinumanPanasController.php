<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MinumanPanas; // Import your model

class MinumanPanasController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return MinumanPanas::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $MinumanPanas = MinumanPanas::create($request->all());

        return response()->json($MinumanPanas, 201);
    }

    // Display the specified resource
    public function show(MinumanPanas $MinumanPanas)
    {
        return $MinumanPanas;
    }

    // Update the specified resource in storage
    public function update(Request $request, MinumanPanas $MinumanPanas)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $MinumanPanas->update($request->all());

        return response()->json($MinumanPanas, 200);
    }

    // Remove the specified resource from storage
    public function destroy(MinumanPanas $MinumanPanas)
    {
        $MinumanPanas->delete();

        return response()->json(null, 204);
    }
}
