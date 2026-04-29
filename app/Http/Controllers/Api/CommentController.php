<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;

class CommentController extends Controller {
    public function index(Post $post) {
        $comments = $post->comments()
            ->with('user')
            ->latest()
            ->paginate(3);
        return response()->json($comments);
    }

    public function store(Request $request, Post $post) {
        $request->validate(['text' => 'required']);
        $comment = $post->comments()->create([
            'user_id' => auth()->id(),
            'text' => $request->text,
        ]);
        $comment->load('user');
        return response()->json($comment, 201);
    }

    public function destroy(Post $post, Comment $comment) {
        abort_if($comment->user_id !== auth()->id(), 403);
        $comment->delete();
        return response()->json(['message' => 'ok']);
    }
}
