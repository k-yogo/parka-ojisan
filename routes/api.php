<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);

Route::middleware('auth')->group(function () {
  Route::post('/posts', [PostController::class, 'store']);
  Route::delete('/posts/{post}', [PostController::class, 'destroy']);
  Route::post('/posts/{post}/like', [LikeController::class, 'store']);
  Route::delete('/posts/{post}/like', [LikeController::class, 'destroy']);
  Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
  Route::delete('/posts/{post}/comments/{comment}', [CommentController::class, 'destroy']);
});
