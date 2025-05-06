<?php

namespace App\Http\Controllers;

use App\Models\ShoppingItemCategory;
use App\Models\ShoppingItem;
use Illuminate\Http\Request;

class ShoppingItemController extends Controller
{
    // GET /shopping-items
    public function index(Request $request)
    {
        $query = ShoppingItem::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->get());
    }
    // Replace the duplicate `index` with this:
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|unique:shopping_items,name,' . $id,
            'category_id' => 'required|integer|exists:shopping_item_categories,id',
        ]);

        // Find the item to update
        $item = ShoppingItem::findOrFail($id);

        // Update item details
        $item->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
        ]);
        $item->load('category');

        return response()->json($item, 201);
    }


    // GET /categories
    public function getCategories()
    {
        return response()->json(ShoppingItemCategory::all());
    }

    // POST /shopping-items
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'name' => 'required|string|unique:shopping_items,name',
            'category_id' => 'required|integer|exists:shopping_item_categories,id',
        ]);

        // Create ShoppingItem with category
        $item = ShoppingItem::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
        ]);
        $item->load('category');

        return response()->json($item, 201);
    }

    // POST /categories
    public function storeCategory(Request $request)
    {
        // Validate category
        $validated = $request->validate([
            'name' => 'required|string|unique:shopping_item_categories,name',
        ]);

        // Create category
        $category = ShoppingItemCategory::create($validated);

        return response()->json($category, 201);
    }

    // GET /shopping-items/{id}
    public function show($id)
    {
        $item = ShoppingItem::with('category')->findOrFail($id);
        return response()->json($item);
    }
}
