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

class OrderController extends Controller
{
    public function index(){
        $orders = Order::with('items')->get();
        return response()->json($orders);
    }
    // Store a newly created order in storage
    public function store(Request $request)
    {
        $request->validate([
            'meja' => 'required|integer', // Validate meja_no
            'items' => 'required|array',
            'items.*.type' => 'required|string|in:camilan,coffe,jus,lalapan,milkshake,makanan,minumandingin,minumanpanas',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
        ]);
    
        $totalPrice = 0;    
        $orderItems = [];
    
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
    
            // Prepare order item data
            $orderItems[] = [
                'item_id' => $item['id'],
                'item_type' => $item['type'],
                'quantity' => $item['qty'],
                'price' => $itemPrice,
            ];
    
            // Subtract the quantity from the stock
            $menuItem->decrement('qty', $item['qty']);
        }
    
        // Create the order
        $order = Order::create([
            'total_price' => $totalPrice,
            'meja_no' => $request->meja, // Add meja_no here
        ]);
    
        // Save order items
        $order->items()->createMany($orderItems);
    
        return response()->json($order->load('items'), 201);
    }
    
    public function markAsCompleted($id)
{
    $order = Order::findOrFail($id);

    // Update the status to 'completed'
    $order->update(['status' => 'completed']);

    return response()->json(['message' => 'Order marked as completed', 'order' => $order], 200);
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
            default:
                abort(404, 'Model not found');
        }
    }
}
