<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milkshake extends Model
{
    protected $table = 'milkshake';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
