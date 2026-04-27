<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;

Route::get('/posts', [PostController::class, 'index']);

Route::middleware('auth')->group(function () {
  Route::post('/posts', [PostController::class, 'store']);
  Route::delete('/posts/{post}', [PostController::class, 'destroy']);
  Route::post('/posts/{post}/like', [LikeController::class, 'store']);
  Route::delete('/posts/{post}/like', [LikeController::class, 'destroy']);
});
