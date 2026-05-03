<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;

class PostController extends Controller {
    public function index(Request $request) {
        $userId = auth()->id();
        $posts = Post::latest()
            ->with('user')
            ->withCount(['likes', 'comments'])
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->when($userId, fn($q) => $q->withExists(['likes as is_liked' => fn($q) => $q->where('user_id', $userId)]))
            ->paginate(10);
        return PostResource::collection($posts);
    }


    public function store(Request $request) {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,webp,avif',
                'max:5120',
                'dimensions:min_width=400,min_height=400',
                function ($attribute, $value, $fail) {
                    $image = getimagesize($value);
                    if ($image) {
                        $width = $image[0];
                        $height = $image[1];
                        $ratio = $width / $height;
                        if ($ratio < 0.25 || $ratio > 4) {
                            $fail('The image aspect ratio must be between 1:4 and 4:1.');
                        }
                    }
                },
            ],
            'text' => 'required|string|min:2|max:400',
        ]);

        $detector = new \App\Services\ParkaOjisanDetector();
        $aiResult = $detector->detectFromUploadedFile($request->file('image'));

        if (!$aiResult['is_parka_ojisan']) {
            return response()->json([
                'errors' => ['image' => 'パーカーおじさんの画像をアップロードしてください！ 理由: ' . $aiResult['reason']]
            ], 422);
        }

        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
        $image = $manager->read($request->file('image'));

        if ($image->width() > 1500) {
            $image->scale(width: 1500);
        }

        $filename = str()->random(40) . '.webp';
        $path = 'images/' . $filename;
        $fullPath = storage_path('app/public/' . $path);
        $image->toWebp(quality: 80)->save($fullPath);

        $post = Post::create([
            'image' => $path,
            'width' => $image->width(),
            'height' => $image->height(),
            'file_size' => filesize($fullPath),
            'text' => $request->text,
            'user_id' => auth()->id(),
        ]);

        $post->load('user');

        return response()->json($post, 201);
    }

    public function destroy(Post $post) {
        if (auth()->id() !== $post->user_id) {
            abort(403);
        }

        Storage::disk('public')->delete($post->image);
        $post->delete();

        return response()->json(['message' => '削除しました']);
    }
}
