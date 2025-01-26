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

            $menuTypes = explode(separator: ',', string: $menu);
            $items = explode(separator: ',', string: $item);

            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                })
                ->with(['items' => function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                }])
                ->whereHas('items', function ($query) use ($items) {
                    $query->whereIn('item_name', $items);
                })
                ->with(['items' => function ($query) use ($items) {
                    $query->whereIn('item_name', $items);
                }])
                ->whereBetween('created_at', [$time_low, $time_high])
                ->get();
        } else if (($menu != "All") && ($item === "All")) {
            $menuTypes = explode(separator: ',', string: $menu);
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                })
                ->with(['items' => function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
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
    public function traffic($menu, $item, Request $request)
    {
        $time_low = $request->input('time_low');
        $time_high = $request->input('time_high');
        $time_low = Carbon::parse($time_low)->startOfDay();
        $time_high = Carbon::parse($time_high)->endOfDay();

        if ($menu === "All" && $item === "All") {
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->with('items')
                ->get()
                ->pluck('items')
                ->flatten();
            // Group by 'item_name'
            $data = $orders->groupBy('item_name')->map(function ($group, $itemName) {
                return [
                    'item_type' => $group->first()['item_type'], // Take the item_type from the first occurrence
                    'item_name' => $itemName,
                    'quantity' => $group->sum('quantity'), // Sum the quantities
                    'price' => $group->sum('price'), // Sum the prices
                ];
            })->values(); // Reset the keys to be numeric
        } else if ($menu != 'All' && $item != 'All') {
            $menuTypes = explode(',', $menu);
            $itemTypes = explode(',', $item);

            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->with(['items' => function ($query) use ($menuTypes) {
                    if ($menuTypes) {
                        $query->whereIn('item_type', $menuTypes); // Filter by menu types if provided
                    }
                }])
                ->with(['items' => function ($query) use ($itemTypes) {
                    if ($itemTypes) {
                        $query->whereIn('item_name', $itemTypes); // Filter by item types if provided
                    }
                }])
                ->get()
                ->pluck('items')
                ->flatten();

            // Group by 'item_name'
            $data = $orders->groupBy('item_name')->map(function ($group, $itemName) {
                return [
                    'item_type' => $group->first()['item_type'], // Take the item_type from the first occurrence
                    'item_name' => $itemName,
                    'quantity' => $group->sum('quantity'), // Sum the quantities
                    'price' => $group->sum('price'), // Sum the prices
                ];
            })->values();
            if ($data === null){
                return null;
            }
        }
        return response()->json($data);
    }
        public function AllTime($menu, $item, $type, $period, Request $request)
    {
        $time_low = $request->input('time_low');
        $time_high = $request->input('time_high');
        $time_low = Carbon::parse($time_low)->startOfDay();
        $time_high = Carbon::parse($time_high)->endOfDay();

        if (($menu != "All") && ($item != "All")) {

            $menuTypes = explode(separator: ',', string: $menu);
            $items = explode(separator: ',', string: $item);

            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                })
                ->with(['items' => function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                }])
                ->whereHas('items', function ($query) use ($items) {
                    $query->whereIn('item_name', $items);
                })
                ->with(['items' => function ($query) use ($items) {
                    $query->whereIn('item_name', $items);
                }])
                ->whereBetween('created_at', [$time_low, $time_high])
                ->get();
        } else if (($menu != "All") && ($item === "All")) {
            $menuTypes = explode(separator: ',', string: $menu);
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])
                ->whereHas('items', function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                })
                ->with(['items' => function ($query) use ($menuTypes) {
                    $query->whereIn('item_type', $menuTypes);
                }])
                ->whereBetween('created_at', [$time_low, $time_high])
                ->get();
        } else if (($menu === "All") && ($item === "All")) {
            $orders = Order::whereBetween('created_at', [$time_low, $time_high])->get();
        }

        switch ($period) {
            case 'Hourly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->format('H:00'); // Group by hour
                });
                break;
            case 'Daily':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->format('l'); // Group by day name
                });
                break;
            case 'Monthly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->format('j'); // Group by day of the month
                });
                break;
            case 'Yearly':
                $groupedData = $orders->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)->format('F'); // Group by month name
                });
                break;

            default:
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
