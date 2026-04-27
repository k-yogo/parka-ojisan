<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;

class LikeController extends Controller {
    public function store(Post $post) {
        $post->likes()->create(['user_id' => auth()->id()]);
        return response()->json(['message' => 'ok']);
    }

    public function destroy(Post $post) {
        $post->likes()->where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'ok']);
    }
}
