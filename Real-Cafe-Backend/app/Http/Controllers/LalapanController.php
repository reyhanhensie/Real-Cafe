<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lalapan; // Import your model

class LalapanController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return Lalapan::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $Lalapan = Lalapan::create($request->all());

        return response()->json($Lalapan, 201);
    }

    // Display the specified resource
    public function show(Lalapan $Lalapan)
    {
        return $Lalapan;
    }

    // Update the specified resource in storage
    public function update(Request $request, Lalapan $Lalapan)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $Lalapan->update($request->all());

        return response()->json($Lalapan, 200);
    }

    // Remove the specified resource from storage
    public function destroy(Lalapan $Lalapan)
    {
        $Lalapan->delete();

        return response()->json(null, 204);
    }
}
