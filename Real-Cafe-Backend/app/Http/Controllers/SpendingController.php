<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;
use App\Models\Spending;
use Carbon\Carbon;

class SpendingController extends Controller
{
    public function index()
    {
        $now = Carbon::now('Asia/Jakarta');
        if (Shift::count() === 0) {
            $time_start = Carbon::now('Asia/Jakarta')->startOfDay();
        } else {
            $lastShift = Shift::latest('end_time')->first();
            $time_start = Carbon::parse($lastShift->end_time);
        }

        $Spending = Spending::whereBetween('created_at', [$time_start, $now])->get();
        return response()->json($Spending);
    }
    public function ShiftSpending()
    {
        $now = Carbon::now('Asia/Jakarta');
        if (Shift::count() === 0) {
            $time_start = Carbon::now('Asia/Jakarta')->startOfDay();
        } else {
            $lastShift = Shift::latest('end_time')->first();
            $time_start = Carbon::parse($lastShift->end_time);
        }

        $Spending = Spending::whereBetween('created_at', [$time_start, $now])->sum('total');
        if ($Spending === 0 || $Spending === null) {
            return response()->json(0);
        }
        return response()->json($Spending);
    }
    public function shift(Request $request)
    {

        $time_start = Carbon::Parse($request->input('start_time'));
        $time_stop = Carbon::Parse($request->input('end_time'));
        $data = Spending::whereBetween('created_at', [$time_start, $time_stop])->get();
        return response()->json($data);
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
