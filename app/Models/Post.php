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
        'user_id',    // 追加
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function likes() {
        return $this->hasMany(Like::class);
    }

    public function isLikedBy(User $user): bool {
        return $this->likes()->where('user_id', $user->id)->exists();
    }
}
