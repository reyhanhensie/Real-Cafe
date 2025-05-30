<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category', 'description', 'price', 'status', 'category_id'];
    public function category()
    {
        return $this->belongsTo(ShoppingItemCategory::class);
    }
}
