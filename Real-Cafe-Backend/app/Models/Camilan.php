<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camilan extends Model
{
    protected $table = 'camilan';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
