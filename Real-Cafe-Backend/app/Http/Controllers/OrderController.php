<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FoodMenu;
use App\Models\DrinkMenu;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    // Store a newly created order in storage
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.type' => 'required|string|in:food,drink',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $totalPrice = 0;    
        $orderItems = [];

        foreach ($request->items as $item) {
            if ($item['type'] === 'food') {
                $menuItem = FoodMenu::findOrFail($item['id']);
            } else {
                $menuItem = DrinkMenu::findOrFail($item['id']);
            }

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
        ]);

        // Save order items
        $order->items()->createMany($orderItems);

        return response()->json($order, 201);
    }

    // Display the specified order
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return response()->json($order);
    }
}
