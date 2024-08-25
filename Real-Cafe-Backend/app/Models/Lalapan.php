<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lalapan extends Model
{
    protected $table = 'lalapan';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
