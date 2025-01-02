<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $table = 'shifts';
    protected $fillable = ['start_time','end_time','nama','omset','uang','pengeluaran','shift'];
    use HasFactory;
}
