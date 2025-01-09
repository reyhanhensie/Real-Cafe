<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MinumanPanas; // Import your model
use Illuminate\Support\Facades\Log;


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
    public function show($id)
    {
        $minumanPanas = MinumanPanas::find($id);
        if (!$minumanPanas) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        return response()->json($minumanPanas);
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
        $data = MinumanPanas::findOrFail(id: $id);

        // Update the resource with the validated data
        $data->update($request->all());

        // Log the updated data
        Log::info('Update Request Data:', $data->toArray());

        // Return a success response
        return response()->json([
            'data' => $data
        ], 200);
    }






    // Remove the specified resource from storage
    public function destroy($id)
    {
        $minumanPanas = MinumanPanas::findOrFail($id); // Use the ID passed in the request

        $minumanPanas->delete();

        return response()->json(null, 204);
    }
}
