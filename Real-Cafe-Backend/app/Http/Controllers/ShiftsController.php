<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Shift;
use App\Models\Spending;
use Carbon\Carbon;

use App\Services\PrinterService;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;

class ShiftsController extends Controller
{
    //
    public function Shift(Request $request)
    {
        $now = Carbon::now();
        $startOfDay = Carbon::now()->startOfDay();

        if (Shift::count() === 0) {
            $turnover = Order::where('created_at', '<=', $now)->sum('total_price');
            $spending = Spending::where('created_at', '<=', $now)->sum('total');
            $qtyOmset = Order::where('created_at', '<=', $now)->count();
            $qtyPengeluaran = Spending::where('created_at', '<=', $now)->count();

            Shift::create([
                'start_time' => $startOfDay,
                'end_time' => $now,
                'shift' => 1,
                'omset' => $turnover,
                'qty_omset' => $qtyOmset,
                'uang' => $request->input('uang'),
                'pengeluaran' => $spending,
                'qty_pengeluaran' => $qtyPengeluaran,
                'nama' => $request->input('nama'),
            ]);
        } else {
            $lastShift = Shift::latest('end_time')->first();

            $newShiftNumber = $lastShift->end_time->isSameDay($now) ? $lastShift->shift + 1 : 1;

            $turnover = Order::where('created_at', '>', $lastShift->end_time)
                ->where('created_at', '<=', $now)
                ->sum('total_price');
            $spending = Spending::where('created_at', '>', $lastShift->end_time)
                ->where('created_at', '<=', $now)
                ->sum('total');
            $qtyOmset = Order::where('created_at', '>', $lastShift->end_time)
                ->where('created_at', '<=', $now)
                ->count();
            $qtyPengeluaran = Spending::where('created_at', '>', $lastShift->end_time)
                ->where('created_at', '<=', $now)
                ->count();

            Shift::create([
                'start_time' => $lastShift->end_time,
                'end_time' => $now,
                'shift' => $newShiftNumber,
                'omset' => $turnover,
                'qty_omset' => $qtyOmset,
                'uang' => $request->input('uang'),
                'pengeluaran' => $spending,
                'qty_pengeluaran' => $qtyPengeluaran,
                'nama' => $request->input('nama'),
            ]);
        }

        $this->ShiftPrint(); // Call updated print method without errors

        return response()->json([
            'message' => 'Shift updated successfully!',
        ]);
    }

    public function ShiftPrint(Request $request = null)
    {
        $id = $request?->input('id');
        $Shift = $id ? Shift::find($id) : Shift::latest('id')->first();

        if (!$Shift) {
            return response()->json(['error' => 'Shift not found'], 404);
        }

        try {
            $connector = new FilePrintConnector(env('PRINTER_PATH', '/dev/usb/lp0'));
            $printer = new Printer($connector);

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("\nREAL CAFE JATIROTO\n");
            $printer->text("================================\n");
            $printer->text("LAPORAN KEUANGAN SHIFT {$Shift->shift}\n");
            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $printer->text("Shift Mulai: {$Shift->start_time}\n");
            $printer->text("Shift Selesai: {$Shift->end_time}\n\n");
            $printer->text("Kasir: {$Shift->nama}\n");
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("================================\n");
            $printer->text("Detail                     Total\n");

            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $penjualan = 'Rp' . $Shift->omset;
            $printer->text(sprintf("Penjualan: %-7s %11s\n", "", $penjualan));
            $printer->text(sprintf(" Jumlah Pesanan = %d X\n", $Shift->qty_omset));

            $pengeluaran = 'Rp' . $Shift->pengeluaran;
            $printer->text(sprintf("Pengeluaran: %-5s %9s\n", "", $pengeluaran));
            $printer->text(sprintf(" Jumlah Pengeluaran = %d X\n", $Shift->qty_pengeluaran));

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("================================\n");

            $Total = 'Rp.' . ($Shift->omset - $Shift->pengeluaran);
            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $printer->text(sprintf("Total: %-11s %9s\n", "", $Total));

            $printer->text(sprintf("Uang Laci: %-7s %11s\n", "", $Shift->uang));

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("================================\n");

            $printer->cut();
            $printer->close();
        } catch (\Exception $e) {
        }
    }
}