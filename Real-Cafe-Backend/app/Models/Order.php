<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'total_price',
    ];

    // Define the relationship with OrderItem
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
