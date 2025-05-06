<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingItemCategory extends Model
{
    protected $fillable = ['name'];

    // Relation to ShoppingItem (one category can have many items)
    public function shoppingItems()
    {
        return $this->hasMany(ShoppingItem::class);
    }
    public function ShoppingList()
    {
        return $this->hasMany(ShoppingList::class);
    }
}
