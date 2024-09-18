<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spending extends Model
{
    use HasFactory;
    protected $table = 'pengeluaran';
    protected $fillable = ['deskripsi', 'total']; // Include 'status' in fillable
}
