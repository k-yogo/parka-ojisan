<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller {
  public function show(string $username) {
    $user = User::withCount('posts')->where('user_id', $username)->firstOrFail();

    return Inertia::render('User/Show', [
      'user' => $user,
    ]);
  }
}
