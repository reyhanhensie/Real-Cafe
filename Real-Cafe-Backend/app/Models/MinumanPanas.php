<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinumanPanas extends Model
{
    protected $table = 'minuman_panas';
    protected $fillable = ['name', 'price', 'qty'];
    use HasFactory;
}
