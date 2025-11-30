<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/', function () {
  return view('index');
})->name('posts.index');
Route::get('/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/create/post', [PostController::class, 'store'])->name('posts.store');
