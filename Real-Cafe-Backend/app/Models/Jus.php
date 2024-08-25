<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jus extends Model
{
    protected $table = 'jus';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
