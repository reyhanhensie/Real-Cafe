<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['total_price', 'meja_no','bayar', 'message', 'status','kasir', 'status_makanan', 'status_minuman']; // Include 'status' in fillable

    // Define the relationship with OrderItem
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
