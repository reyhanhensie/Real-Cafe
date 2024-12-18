<?php

namespace App\Http\Controllers;

use App\Services\PrinterService;

class PrintController extends Controller
{
    protected $printService;

    public function __construct(PrinterService $printerService)
    {
        $this->printService = $printerService;
    }

    public function print()
    {
        try {
            $message = "Hello from Laravel!";
            $this->printService->printReceipt($message);

            return response()->json(['message' => 'Print job sent successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
