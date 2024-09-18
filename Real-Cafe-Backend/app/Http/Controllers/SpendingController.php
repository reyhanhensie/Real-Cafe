<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spending;

class SpendingController extends Controller
{
    public function index()
    {
        return Spending::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'deskripsi' => 'required|string|max:255', // Corrected field name
            'total' => 'required|numeric',
        ]);

        $spending = Spending::create($request->all());

        return response()->json($spending, 201);
    }

    public function show(Spending $Spending)
    {
        return $Spending;
    }

    public function update(Request $request, Spending $Spending)
    {
        $request->validate([
            'deskripsi' => 'sometimes|required|string|max:255', // Corrected field name
            'total' => 'sometimes|required|numeric',
        ]);

        $Spending->update($request->all());

        return response()->json($Spending, 200);
    }

    public function destroy(Spending $Spending)
    {
        $Spending->delete();

        return response()->json(null, 204);
    }
}
