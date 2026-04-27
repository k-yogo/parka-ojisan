<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller {
    public function show(string $username, Post $post) {
        $userId = Auth::id();
        $post->load('user')->loadCount('likes');
        if ($userId) {
            $post->is_liked = $post->likes()->where('user_id', $userId)->exists();
        } else {
            $post->is_liked = false;
        }
        return Inertia::render('Post/Show', [
            'post' => $post,
        ]);
    }
}
