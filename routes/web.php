<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/', [PostController::class, 'index'])->name('posts.index');
Route::get('/create/', [PostController::class, 'create'])->name('posts.create');
Route::post('/create/post', [PostController::class, 'store'])->name('posts.store');