<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    public function index(Request $request)
    {
        $query = ShoppingList::with('category');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // If no specific status is requested, exclude 'complete'
            $query->where('status', '!=', 'complete');
        }

        if ($request->has('search')) {
            $query->where('item', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->get());
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|integer|min:0',
            'category_id' => 'required|integer|exists:shopping_item_categories,id',

        ]);

        $shoppingList = ShoppingList::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'status' => 'pending',
        ]);
        
        $shoppingList->load('category');


        return response()->json($shoppingList, 201);
    }


    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,bought,complete',
        ]);

        $shoppingList = ShoppingList::findOrFail($id);
        $shoppingList->status = $request->status;
        $shoppingList->save();
        $shoppingList->load('category');

        return response()->json($shoppingList, 201);
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
