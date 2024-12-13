<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index($menu, $item, $type, $period, Request $request)
    {
        $time_low = $request->input('time_low');
        $time_high = $request->input('time_high');
        $time_low = Carbon::parse($time_low)->startOfDay();
        $time_high = Carbon::parse($time_high)->endOfDay();

        if (($menu != "All") && ($item != "All")) {
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($item) {
                    $query->whereIn('item_name', [$item]);
                })
                ->with(['items' => function ($query) use ($item) {
                    $query->whereIn('item_name', [$item]);
                }])
                ->whereBetween('created_at', [$time_low, $time_high])
                ->get();
        } else if (($menu != "All") && ($item === "All")) {
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($menu) {
                    $query->whereIn('item_type', [$menu]);
                })
                ->with(['items' => function ($query) use ($menu) {
                    $query->whereIn('item_type', [$menu]);
                }])
                ->whereBetween('created_at', [$time_low, $time_high])
                ->get();
        } else if (($menu === "All") && ($item === "All")) {
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])->get();
        }

        switch ($period) {
            case 'Free':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at); // Group by date
                });
                break;
            case 'Hourly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->startOfHour(); // Group by date
                });
                break;
            case 'Daily':
                // Group the orders by the day
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->toDateString(); // Group by date
                });
                break;

            case 'Weekly':
                // Group the orders by the week (start of the week)
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->startOfWeek()->toDateString(); // Group by the start of the week
                });
                break;
            case 'Monthly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->startOfMonth()->toDateString(); // Group by the start of the week
                });
                break;
            case 'Yearly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->startOfYear()->toDateString(); // Group by the start of the week
                });
                break;



            default:
                // Handle cases where the period is not recognized
                return response()->json(['error' => 'Invalid period type'], 400);
        }

        // Process data based on the type ('revenue' or 'sales')
        switch ($type) {
            case 'Revenue':
                if (($menu != "All") || ($item != "All")) {
                    $groupedData = $groupedData->map(function ($group) {
                        return $group->sum(function ($order) {
                            return $order->items->sum('price'); // Sum of total_price for each order
                        });
                    });
                } else {
                    // Calculate total revenue for each group (sum of total_price)
                    $groupedData = $groupedData->map(function ($group) {
                        return $group->sum('total_price'); // Sum of total_price for each group
                    });
                }
                break;

            case 'Sales':
                if (($menu != "All") || ($item != "All")) {
                    $groupedData = $groupedData->map(function ($group) {
                        return $group->sum(function ($order) {
                            return $order->items->sum('quantity'); // Sum of total_price for each order
                        });
                    });
                } else {
                    // Count the number of orders for each group
                    $groupedData = $groupedData->map(function ($group) {
                        return $group->count(); // Count the number of orders for each group
                    });
                }
                break;
            default:
                return response()->json(['error' => 'Invalid data type'], 400);
        }

        return response()->json($groupedData);
    }
}
