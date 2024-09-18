<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinumanPanas extends Model
{
    use HasFactory;
    protected $table = 'minuman_panas';
    protected $fillable = ['name', 'price', 'qty'];
    // If your primary key is not 'id', specify it here
}
