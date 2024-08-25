<?php

// app/Models/OrderItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'item_id', 'item_type', 'quantity', 'price'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
