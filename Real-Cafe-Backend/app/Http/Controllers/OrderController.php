<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Camilan;
use App\Models\Coffe;
use App\Models\Jus;
use App\Models\Lalapan;
use App\Models\Milkshake;
use App\Models\Makanan;
use App\Models\MinumanDingin;
use App\Models\MinumanPanas;
use App\Models\Rokok;
use App\Models\Paket;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Models\Receipt;
use App\Models\Shift;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Illuminate\Support\Facades\Log;
//PRINT
use App\Services\PrinterService;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items')->get();
        return response()->json($orders);
    }
    public function live()
    {
        // Filter orders with status 'pending'
        $orders = Order::where('status', 'pending')->with('items')->get();
        return response()->json($orders);
    }
    public function live_food()
    {
        $orders = Order::where('status_makanan', 'pending')
            ->whereHas('items', function ($query) {
                $query->whereIn('item_type', ['camilan', 'lalapan', 'makanan']);
            })
            ->with(['items' => function ($query) {
                $query->whereIn('item_type', ['camilan', 'lalapan', 'makanan']);
            }])
            ->get();
        return response()->json($orders);
    }
    public function live_drink()
    {
        $orders = Order::where('status_minuman', 'pending')
            ->whereHas('items', function ($query) {
                $query->whereIn('item_type', ['coffe', 'jus', 'milkshake', 'minumandingin', 'minumanpanas', 'paket']);
            })
            ->with(['items' => function ($query) {
                $query->whereIn('item_type', ['coffe', 'jus', 'milkshake', 'minumandingin', 'minumanpanas', 'paket']);
            }])
            ->get();
        return response()->json($orders);
    }
    public function today()
    {
        $time_start = Carbon::now('Asia/Jakarta')->startOfDay();
        $time_stop = Carbon::now('Asia/Jakarta')->endOfDay();
        $orders = Order::whereBetween('created_at', [$time_start, $time_stop])->where('status', 'completed')->with('items')->get();
        return response()->json($orders);
    }
    public function shift(Request $request)
    {

        $time_start = Carbon::Parse($request->input('start_time'));
        $time_stop = Carbon::Parse($request->input('end_time'));
        $orders = Order::whereBetween('created_at', [$time_start, $time_stop])->where('status', 'completed')->with('items')->get();
        return response()->json($orders);
    }
    public function ShiftOrders()
    {
        $now = Carbon::now('Asia/Jakarta');
        if (Shift::count() === 0) {
            $time_start = Carbon::now('Asia/Jakarta')->startOfDay();
        } else {
            $lastShift = Shift::latest('end_time')->first();
            $time_start = Carbon::parse($lastShift->end_time);
        }
        $orders = Order::whereBetween('created_at', [$time_start, $now])->with('items')->get();
        return response()->json($orders);
    }
    // Store a newly created order in storage
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'nullable',
            'meja' => 'required|integer', // Validate meja_no\
            'kasir' => 'required',
            'items' => 'required|array',
            'items.*.type' => 'required|string|in:camilan,coffe,jus,lalapan,milkshake,makanan,minumandingin,minumanpanas,paket,rokok',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
            'bayar' => 'required|integer|min:0', // Payment amount
        ]);

        $totalPrice = 0;
        $orderItems = [];
        $totalQty = 0;

        foreach ($request->items as $item) {
            $model = $this->getModel($item['type']);
            $menuItem = $model::findOrFail($item['id']);

            // Check if there's enough stock
            if ($menuItem->qty < $item['qty']) {
                return response()->json(['error' => 'Insufficient stock for item ' . $item['id']], 400);
            }

            // Calculate price and update total
            $itemPrice = $menuItem->price * $item['qty'];
            $totalPrice += $itemPrice;
            $totalQty += $item['qty'];

            // Prepare order item data
            $orderItems[] = [
                'item_id' => $item['id'],
                'item_type' => $item['type'],
                'quantity' => $item['qty'],
                'price' => $itemPrice,
                'item_name' => $menuItem->name,
            ];

            // Subtract the quantity from the stock
            $menuItem->decrement('qty', $item['qty']);
        }
        // Calculate change
        $bayar = $request->bayar;
        $kembalian = $bayar - $totalPrice;



        // Create the order
        $order = Order::create([
            'total_price' => $totalPrice,
            'meja_no' => $request->meja, // Add meja_no here
            'message' => $request->message,
            'kasir' => $request->kasir,
            'bayar' => $bayar
        ]);

        // Save order items
        $order->items()->createMany($orderItems);

        // Format timestamp
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');
        try {

            $timestamp = Carbon::now()->format('Y-m-d H:i:s');
            $connector = new FilePrintConnector("/dev/usb/lp0");
            $printer = new Printer($connector);

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("\nREAL CAFE JATIROTO\n");
            $printer->text("========================================\n");
            $printer->text("$timestamp\n");
            $printer->text("Order ID: {$order->id}\n");
            $printer->text("Meja No: {$order->meja_no}\n");
            $printer->text("Kasir: {$order->kasir}\n");
            $printer->text("========================================\n");
            $printer->text("Menu                               Total\n");

            // Group items by category
            $groupedItems = [];
            foreach ($order->items as $item) {
                $groupedItems[$item->item_type][] = $item;
            }

            $categoryMappings = [
                'minumanpanas' => 'Minuman Panas',
                'minumandingin' => 'Minuman Dingin',
            ];

            // Loop through categories and print each category with its items
            foreach ($groupedItems as $category => $items) {
                $category = $categoryMappings[$category] ?? $category; // Use the mapped name or default to original if no match

                // Print category header (e.g., "Makanan", "Jus")
                $printer->setJustification(Printer::JUSTIFY_LEFT);
                $printer->text(">" . ucfirst($category) . "\n");

                // Loop through items in the category
                foreach ($items as $item) {
                    $printer->text(
                        sprintf(
                            " -%-28s Rp.%d\n",
                            $item->item_name,
                            $item->price
                        )
                    );
                    $printer->text(sprintf("  %3d X Rp.%d\n", $item->quantity, $item->price / $item->quantity));
                }
            }

            $NotaTotal = "Rp." . $order->total_price;
            $kembalian = $bayar - $order->total_price;
            $NotaBayar = "Rp." . $bayar;
            $NotaKembalian = "Rp." . $kembalian;

            $printer->text("----------------------------------------\n");            
            $printer->text(sprintf("Jumlah Pesanan: %-3d %20s\n\n", $order->items->sum('quantity'), $NotaTotal));
            $printer->text(sprintf("Bayar: %-10s %22s\n", "", $NotaBayar));
            $printer->text(sprintf("Kembali: %-12s %18s\n", "", $NotaKembalian));
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("========================================\n");
            $printer->text("TERIMA KASIH\n");
            $printer->text("ATAS KUNJUNGANNYA\n");
            $printer->text("========================================\n");
            $printer->text("PASSWORD :           cafereal123\n\n\n");

            $printer->cut();
            $printer->close();
        } catch (\Exception $e) {
            // Handle any printing exceptions
        }



        return response()->json($order->load('items'), 201);
    }
    /**
     * Generate a PDF for the specified order and save it to a directory.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePdf($id)
    {
        $order = Order::with('items')->findOrFail($id);

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
        $filename = "Order_{$timestamp}_ID-{$id}.pdf";
        $directory = "Receipt/{$year}/{$monthName}";

        // Ensure the directory exists
        if (!Storage::exists($directory)) {
            Storage::makeDirectory($directory);
        }

        $path = "{$directory}/{$filename}";

        // Save the PDF to storage
        Storage::put($path, $pdf->output());

        Receipt::generateAndSavePdf($order);
        // Print the PDF (optional)
        $this->printPdf(storage_path("app/{$path}"));

        return $pdf->download($filename);

        // return response()->json(['message' => 'PDF saved successfully', 'path' => $path], 200);
    }
    protected function printPdf($filePath)
    {
        try {
            // Log a debug message
            Log::info("wakwaw - Printing initiated");
            // Ensure the file exists
            if (!file_exists($filePath)) {
                throw new \Exception("PDF file not found at {$filePath}");
            }

            // Connect to the printer
            $connector = new FilePrintConnector("/dev/usb/lp0"); // Adjust path to printer
            $printer = new Printer($connector);

            // Print the file content (convert PDF to plain text if necessary)
            $fileContent = file_get_contents($filePath);

            // Print the file content
            $printer->text($fileContent);
            $printer->cut();
            $printer->close();
        } catch (\Exception $e) {
        }
    }


    public function markAsCompleted($id)
    {
        $order = Order::findOrFail($id);

        // Update the status to 'completed'
        $order->update([
            'status' => 'completed',
            'status_makanan' => 'completed',
            'status_minuman' => 'completed'
        ]);

        return response()->json(['message' => 'Order marked as completed', 'order' => $order], 200);
    }
    public function markAsCompletedFood($id)
    {
        $order = Order::findOrFail($id);

        // Check if the current order has pending food items
        $hasPendingDrinkItems = $order->items()
            ->whereIn('item_type', ['coffe', 'jus', 'milkshake', 'minumandingin', 'minumanpanas', 'paket'])
            ->exists(); // Check only the related items for the given order

        // If no pending food items exist, mark 'status_minuman' as completed for the current order
        if (!$hasPendingDrinkItems) {
            $order->update(['status_minuman' => 'completed']);
        }

        // Update the status of the current order
        if ($order->status_minuman === 'completed') {
            $order->update([
                'status' => 'completed',
                'status_makanan' => 'completed',
            ]);
        } else {
            $order->update(['status_makanan' => 'completed']);
        }

        return response()->json(['message' => 'Order marked as completed', 'order' => $order], 200);
    }
    public function markAsCompletedDrink($id)
    {
        $order = Order::findOrFail($id);

        // Check if the current order has pending food items
        $hasPendingFoodItems = $order->items()
            ->whereIn('item_type', ['camilan', 'lalapan', 'makanan'])
            ->exists(); // Check only the related items for the given order

        // If no pending food items exist, mark 'status_makanan' as completed for the current order
        if (!$hasPendingFoodItems) {
            $order->update(['status_makanan' => 'completed']);
        }

        // Update the status of the current order
        if ($order->status_makanan === 'completed') {
            $order->update([
                'status' => 'completed',
                'status_minuman' => 'completed',
            ]);
        } else {
            $order->update(['status_minuman' => 'completed']);
        }

        return response()->json(['message' => 'Order marked as completed', 'order' => $order], 200);
    }
    public function ChangeMessage($id, Request $request)
    {
        $order = Order::findOrFail($id);

        // Update the status to 'completed'
        $order->update([
            'message' => $request->input('message'),
        ]);

        return response()->json(['message' => 'Order message changed', 'order' => $order], 200);
    }





    // Display the specified order
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return response()->json($order->load('items'));
    }

    // Helper function to get the model based on type
    private function getModel($type)
    {
        switch ($type) {
            case 'camilan':
                return Camilan::class;
            case 'coffe':
                return Coffe::class;
            case 'jus':
                return Jus::class;
            case 'lalapan':
                return Lalapan::class;
            case 'milkshake':
                return Milkshake::class;
            case 'makanan':
                return Makanan::class;
            case 'minumandingin':
                return MinumanDingin::class;
            case 'minumanpanas':
                return MinumanPanas::class;
            case 'paket':
                return Paket::class;
            case 'rokok':
                return Rokok::class;
            default:
                abort(404, 'Model not found');
        }
    }
    protected $printService;

    public function __construct(PrinterService $printerService)
    {
        $this->printService = $printerService;
    }
    public function printReceipt($orderId)
    {
        try {
            $order = Order::with('items')->findOrFail($orderId);

            $timestamp = Carbon::now()->format('Y-m-d H:i:s');
            $connector = new FilePrintConnector("/dev/usb/lp0");
            $printer = new Printer($connector);

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("\nREAL CAFE JATIROTO\n");
            $printer->text("========================================\n");
            $printer->text("$timestamp\n");
            $printer->text("Order ID: {$order->id}\n");
            $printer->text("Meja No: {$order->meja_no}\n");
            $printer->text("Kasir: {$order->kasir}\n");
            $printer->text("========================================\n");
            $printer->text("Menu                               Total\n");

            // Group items by category
            $groupedItems = [];
            foreach ($order->items as $item) {
                $groupedItems[$item->item_type][] = $item;
            }

            $categoryMappings = [
                'minumanpanas' => 'Minuman Panas',
                'minumandingin' => 'Minuman Dingin',
            ];

            // Loop through categories and print each category with its items
            foreach ($groupedItems as $category => $items) {
                $category = $categoryMappings[$category] ?? $category; // Use the mapped name or default to original if no match

                // Print category header (e.g., "Makanan", "Jus")
                $printer->setJustification(Printer::JUSTIFY_LEFT);
                $printer->text(">" . ucfirst($category) . "\n");

                // Loop through items in the category
                foreach ($items as $item) {
                    $printer->text(
                        sprintf(
                            " -%-28s Rp.%d\n",
                            $item->item_name,
                            $item->price
                        )
                    );
                    $printer->text(sprintf("  %3d X Rp.%d\n", $item->quantity, $item->price / $item->quantity));
                }
            }

            $NotaTotal = "Rp." . $order->total_price;
            $bayar = $order->bayar ?? 0; // Ensure bayar is available
            $kembalian = $bayar - $order->total_price;
            $NotaBayar = "Rp." . $bayar;
            $NotaKembalian = "Rp." . $kembalian;

            $printer->text("----------------------------------------\n");
            $printer->text(sprintf("Jumlah Pesanan: %-3d %20s\n\n", $order->items->sum('quantity'), $NotaTotal));
            $printer->text(sprintf("Bayar: %-10s %22s\n", "", $NotaBayar));
            $printer->text(sprintf("Kembali: %-12s %18s\n", "", $NotaKembalian));
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("========================================\n");
            $printer->text("TERIMA KASIH\n");
            $printer->text("ATAS KUNJUNGANNYA\n");
            $printer->text("========================================\n");
            $printer->text("PASSWORD :           cafereal123\n\n\n");

            $printer->cut();
            $printer->close();
        } catch (\Exception $e) {
            Log::error("Receipt printing failed: " . $e->getMessage());
            return response()->json(['error' => 'Receipt printing failed'], 500); // Return HTTP 500 error

        }
    }
}
