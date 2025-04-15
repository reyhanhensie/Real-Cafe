<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuFoto extends Model
{
    protected $table = 'menufoto';

    protected $fillable = ['name', 'image'];

}
