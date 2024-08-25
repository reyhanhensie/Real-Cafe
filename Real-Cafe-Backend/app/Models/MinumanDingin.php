<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinumanDingin extends Model
{
    protected $table = 'minuman_dingin';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
