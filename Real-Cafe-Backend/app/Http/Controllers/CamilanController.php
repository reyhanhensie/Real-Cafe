<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Camilan; // Import your model

class CamilanController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return Camilan::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $Camilan = Camilan::create($request->all());

        return response()->json($Camilan, 201);
    }

    // Display the specified resource
    public function show(Camilan $Camilan)
    {
        return $Camilan;
    }

    // Update the specified resource in storage
    public function update(Request $request, Camilan $Camilan)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $Camilan->update($request->all());

        return response()->json($Camilan, 200);
    }

    // Remove the specified resource from storage
    public function destroy(Camilan $Camilan)
    {
        $Camilan->delete();

        return response()->json(null, 204);
    }
}
