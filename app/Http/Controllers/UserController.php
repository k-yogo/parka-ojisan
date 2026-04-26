<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller {
  public function show(string $username) {
    $user = User::where('user_id', $username)->firstOrFail();
    $userId = auth()->id();

    $posts = Inertia::scroll(fn() => $user->posts()->latest()
      ->with('user')
      ->withCount('likes')
      ->when($userId, fn($q) => $q->withExists(['likes as is_liked' => fn($q) => $q->where('user_id', $userId)]))
      ->paginate(3));

    return Inertia::render('User/Show', [
      'user' => $user,
      'posts' => $posts,
    ]);
  }
}
