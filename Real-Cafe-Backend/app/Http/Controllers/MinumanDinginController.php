<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MinumanDingin; // Import your model

class MinumanDinginController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return MinumanDingin::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $MinumanDingin = MinumanDingin::create($request->all());

        return response()->json($MinumanDingin, 201);
    }

    // Display the specified resource
    public function show(MinumanDingin $MinumanDingin)
    {
        return $MinumanDingin;
    }

    // Update the specified resource in storage
    public function update(Request $request, MinumanDingin $MinumanDingin)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $MinumanDingin->update($request->all());

        return response()->json($MinumanDingin, 200);
    }

    // Remove the specified resource from storage
    public function destroy(MinumanDingin $MinumanDingin)
    {
        $MinumanDingin->delete();

        return response()->json(null, 204);
    }
}
