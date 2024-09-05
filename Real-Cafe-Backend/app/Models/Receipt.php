<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class Receipt extends Model
{
    protected $table = 'receipts';
    protected $fillable = [
        'order_id',
        'file_path',
    ];

    public static function generateAndSavePdf($order)
    {
        $data = [
            'mejaNo' => $order->meja_no,
            'orderItems' => $order->items,
            'totalPrice' => $order->total_price,
            'message' => $order->message,
        ];

        // Create PDF
        $pdf = Pdf::loadView('pdf.order_receipt', $data);

        // Define the file path with timestamp
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->format('n'); // Numeric month (1-12)

        // Map numeric month to Indonesian name
        $months = [
            1 => '1_Januari',
            2 => '2_Februari',
            3 => '3_Maret',
            4 => '4_April',
            5 => '5_Mei',
            6 => '6_Juni',
            7 => '7_Juli',
            8 => '8_Agustus',
            9 => '9_September',
            10 => '10_Oktober',
            11 => '11_November',
            12 => '12_Desember'
        ];
        $monthName = $months[$month];
        $timestamp = $now->format('Y-m-d\TH:i:s');
        $timestamp = str_replace([':'], ['_'], $timestamp);
        $filename = "Order_{$timestamp}_ID-{$order->id}.pdf";
        $directory = "Receipt/{$year}/{$monthName}";

        $path = "{$directory}/{$filename}";

        // Save the PDF to storage
        // Storage::put($path, $pdf->output());

        // Save file path into database
        self::create([
            'order_id' => $order->id,
            'file_path' => $path,
        ]);

        return $path;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
