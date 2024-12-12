<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Spending;
use Carbon\Carbon;

class SpendingController extends Controller
{
    public function index()
    {
        $time_start = Carbon::now('Asia/Jakarta')->startOfDay();
        $time_stop = Carbon::now('Asia/Jakarta')->endOfDay();
        $Spending = Spending::whereBetween('created_at', [$time_start, $time_stop])->get();
        return response()->json($Spending);
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
