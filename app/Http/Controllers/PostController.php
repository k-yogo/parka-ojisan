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
    //
    public function index() {
        return Inertia::render('Index', [
            'posts' => Inertia::scroll(fn() => Post::latest()->paginate(10)),
        ]);
    }

    public function create() {
        return view('create');
    }

    public function store(Request $request) {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,webp,avif',
                'max:5120',
                'dimensions:min_width=400,min_height=400',  // 最低400×400px
                function ($attribute, $value, $fail) {
                    $image = getimagesize($value);
                    if ($image) {
                        $width = $image[0];
                        $height = $image[1];
                        $ratio = $width / $height;

                        // 縦横比が 1:5 から 5:1 の範囲内かチェック
                        if ($ratio < 0.33 || $ratio > 3) {
                            $fail('The image aspect ratio must be between 1:3 and 3:1.');
                        }
                    }
                },
            ],
            'name' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'text' => 'required|string|min:3|max:400',
        ]);

        // 2. AI判定（保存する前に！）
        if ($request->hasFile('image')) {
            $detector = new \App\Services\ParkaOjisanDetector();
            $aiResult = $detector->detectFromUploadedFile($request->file('image'));

            // パーカーおじさんでない場合はエラー
            if (!$aiResult['is_parka_ojisan']) {
                return back()
                    ->withErrors(['image' => 'パーカーおじさんの画像をアップロードしてください！ 理由: ' . $aiResult['reason']])
                    ->withInput();
            }
        }

        if ($request->hasFile('image')) {
            // Imagickドライバーを使用
            $manager = new ImageManager(new Driver());

            // 画像を読み込む
            $image = $manager->read($request->file('image'));

            // 横幅が1500pxより大きい場合はリサイズ（縦横比は維持）
            if ($image->width() > 1500) {
                $image->scale(width: 1500);
            }

            // ファイル名を生成（ユニークな名前）※拡張子を .webp に変更
            $filename = str()->random(40) . '.webp';

            // storage/app/public/images に WebP形式で保存
            $path = 'images/' . $filename;
            $fullPath = storage_path('app/public/' . $path);
            $image->toWebp(quality: 80)->save($fullPath);

            // 最終的な幅・高さ・ファイルサイズを取得
            $width = $image->width();
            $height = $image->height();
            $fileSize = filesize($fullPath); // バイト単位

            // データベースに保存
            Post::create([
                'image' => $path,
                'width' => $width,
                'height' => $height,
                'file_size' => $fileSize,
                'name' => $request->name,
                'email' => $request->email,
                'text' => $request->text,
                'user_id' => Auth::id(),
            ]);
        }

        Inertia::flash('success', '投稿が完了しました！');

        return redirect()->route('posts.index');
    }

    public function destroy(Post $post) {
        if (Auth::id() !== $post->user_id) {
            abort(403);
        }

        Storage::disk('public')->delete($post->image);
        $post->delete();

        Inertia::flash('success', '投稿を削除しました！');

        return redirect()->route('posts.index');
    }
}
