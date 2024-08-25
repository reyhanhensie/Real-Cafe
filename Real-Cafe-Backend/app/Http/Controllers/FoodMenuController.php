<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FoodMenu; // Import your model

class FoodMenuController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        return FoodMenu::all(); // Return all food menu items
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer',
        ]);

        $foodMenu = FoodMenu::create($request->all());

        return response()->json($foodMenu, 201);
    }

    // Display the specified resource
    public function show(FoodMenu $foodMenu)
    {
        return $foodMenu;
    }

    // Update the specified resource in storage
    public function update(Request $request, FoodMenu $foodMenu)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'qty' => 'sometimes|required|integer',
        ]);

        $foodMenu->update($request->all());

        return response()->json($foodMenu, 200);
    }

    // Remove the specified resource from storage
    public function destroy(FoodMenu $foodMenu)
    {
        $foodMenu->delete();

        return response()->json(null, 204);
    }
}
