<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuFoto;
use Illuminate\Support\Facades\Storage;


class   MenuFotoController extends Controller
{
    public function index()
    {
        $menus = MenuFoto::all()->map(function ($menu) {
            $menu->image = asset('storage/' . $menu->image);
            return $menu;
        });

        return response()->json($menus);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = $request->file('image')->store('menu_images', 'public');

        $menu = MenuFoto::create([
            'name' => $request->name,
            'image' => $imagePath,
        ]);

        return response()->json($menu);
    }
    public function destroy($id)
    {
        $menu = MenuFoto::findOrFail($id);
        if ($menu->image && storage::disk('public')->exists($menu->image)) {
            storage::disk('public')->delete($menu->image);
        }
        $menu->delete();

        return response()->json(['message' => 'Menu deleted.']);
    }
    public function update(Request $request, $id)
    {
        $menu = MenuFoto::findOrFail($id);

        // Update name
        $menu->name = $request->input('name');

        // If a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete old image
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('menu_images', 'public');
            $menu->image = $imagePath;
        }

        $menu->save();

        // Return updated menu with full URL
        $menu->image = asset('storage/' . $menu->image);
        return response()->json($menu);
    }
}
