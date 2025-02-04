<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'item_id', 'item_type', 'quantity', 'price', 'item_name'];

    // Accessor for item_name
    public function getItemNameAttribute()
    {
        $modelClass = $this->resolveModelClass($this->item_type);
        $item = $modelClass::find($this->item_id);
        return $item ? $item->name : 'Unknown'; // Fallback if item is not found
    }

    // Helper function to resolve model class based on item type
    private function resolveModelClass($type)
    {
        $models = [
            'camilan' => \App\Models\Camilan::class,
            'coffe' => \App\Models\Coffe::class,
            'jus' => \App\Models\Jus::class,
            'lalapan' => \App\Models\Lalapan::class,
            'milkshake' => \App\Models\Milkshake::class,
            'makanan' => \App\Models\Makanan::class,
            'minumandingin' => \App\Models\MinumanDingin::class,
            'minumanpanas' => \App\Models\MinumanPanas::class,
            'paket' => \App\Models\Paket::class,
            'rokok' => \App\Models\Rokok::class,
        ];

        return $models[$type] ?? null;
    }
}
