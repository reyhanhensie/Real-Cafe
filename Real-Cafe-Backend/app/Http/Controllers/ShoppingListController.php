<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    public function index(Request $request)
    {
        $query = ShoppingList::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('item', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'item' => 'required|string|max:255',
            'price' => 'nullable|integer|min:0',
        ]);

        $shoppingList = ShoppingList::create([
            'item' => $request->item,
            'price' => $request->price,
        ]);

        return response()->json($shoppingList, 201);
    }


    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,bought,deleted',
        ]);

        $shoppingList = ShoppingList::findOrFail($id);
        $shoppingList->status = $request->status;
        $shoppingList->save();

        return response()->json(['message' => 'Status updated successfully.']);
    }
    
    public function update($id, Request $request)
    {
        $request->validate([
            'item' => 'nullable|string|max:255',
            'price' => 'nullable|integer|min:0',
        ]);

        $shoppingList = ShoppingList::findOrFail($id);

        if ($request->has('item')) {
            $shoppingList->item = $request->item;
        }

        if ($request->has('price')) {
            $shoppingList->price = $request->price;
        }

        $shoppingList->save();

        return response()->json(['message' => 'Item updated successfully.']);
    }

 
    public function destroy($id)
    {
        $shoppingList = ShoppingList::findOrFail($id);
        $shoppingList->delete();

        return response()->json(['message' => 'Item deleted successfully.']);
    }
}
