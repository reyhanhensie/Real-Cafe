<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rokok extends Model
{
    use HasFactory;
    protected $table = 'rokok';
    protected $fillable = ['name', 'price', 'qty'];
    // If your primary key is not 'id', specify it here
}
