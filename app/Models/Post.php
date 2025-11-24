<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model {

    use HasFactory;

    //
    protected $fillable = [
        'image',
        'width',      // 追加
        'height',     // 追加
        'file_size',  // 追加
        'name',
        'email',
        'text',
    ];
}
