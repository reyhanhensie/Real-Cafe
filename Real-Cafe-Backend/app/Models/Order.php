<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['total_price'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
