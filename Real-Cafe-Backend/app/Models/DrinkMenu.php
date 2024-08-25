<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DrinkMenu extends Model
{
    protected $table = 'drink_menu';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
