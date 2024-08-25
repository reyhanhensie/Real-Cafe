<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DrinkMenu; // Import your model

class DrinkMenuController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return DrinkMenu::all(); // Return all Drink menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $DrinkMenu = DrinkMenu::create($request->all());

        return response()->json($DrinkMenu, 201);
    }

    // Display the specified resource
    public function show(DrinkMenu $DrinkMenu)
    {
        return $DrinkMenu;
    }

    // Update the specified resource in storage
    public function update(Request $request, DrinkMenu $DrinkMenu)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $DrinkMenu->update($request->all());

        return response()->json($DrinkMenu, 200);
    }

    // Remove the specified resource from storage
    public function destroy(DrinkMenu $DrinkMenu)
    {
        $DrinkMenu->delete();

        return response()->json(null, 204);
    }
}
