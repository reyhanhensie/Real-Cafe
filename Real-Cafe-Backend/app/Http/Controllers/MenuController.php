<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Camilan;
use App\Models\Coffe;
use App\Models\Jus;
use App\Models\Lalapan;
use App\Models\Makanan;
use App\Models\Milkshake;
use App\Models\MinumanDingin;
use App\Models\MinumanPanas;
use App\Models\Paket;
use App\Models\Rokok;

class MenuController extends Controller
{
    public function index()
    {
        $Camilan = Camilan::all();
        $Coffe = Coffe::all();
        $Jus = Jus::all();
        $Lalapan = Lalapan::all();
        $Makanan = Makanan::all();
        $Milkshake = Milkshake::all();
        $MinumanDingin = MinumanDingin::all();
        $MinumanPanas = MinumanPanas::all();
        $Paket = Paket::all();
        $Rokok = Rokok::all();

        return response()->json([
            'Camilan' => $Camilan,
            'Coffe' => $Coffe,
            'Jus' => $Jus,
            'Lalapan' => $Lalapan,
            'Makanan' => $Makanan,
            'Milkshake' => $Milkshake,
            'Minuman Dingin' => $MinumanDingin,
            'Minuman Panas' => $MinumanPanas,
            'Paket' => $Paket,
            'Rokok' => $Rokok
        ]);
    }
}
