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
    public function show($id)
    {
        return MinumanDingin::findOrFail(id: $id);
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
        $data = MinumanDingin::findOrFail(id: $id);

        // Update the resource with the validated data
        $data->update($request->all());

        // Return a success response
        return response()->json([
            'data' => $data
        ], 200);
    }

    // Remove the specified resource from storage
    public function destroy(MinumanDingin $MinumanDingin)
    {
        $MinumanDingin->delete();

        return response()->json(null, 204);
    }
}
