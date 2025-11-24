<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            //
            'image' => 'https://placehold.jp/1000x1000.png',  // ダミー画像のパス
            'name' => fake()->optional(0.3)->name(),       // ランダムな名前
            'email' => fake()->optional(0.1)->safeEmail(), // 10%の確率でメールアドレス、90%でnull
            'text' => fake()->realText(150), // ランダムな本文（200文字程度）
        ];
    }
}
