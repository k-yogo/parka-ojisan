<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller {
  public function show(string $username) {
    $user = User::where('user_id', $username)->firstOrFail();

    $posts = Inertia::scroll(fn() => $user->posts()->latest()->with('user')->paginate(3));

    return Inertia::render('User/Show', [
      'user' => $user,
      'posts' => $posts,
    ]);
  }
}
