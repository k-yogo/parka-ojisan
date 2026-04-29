<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $postIds = Post::pluck('id');
        $userIds = User::pluck('id');

        foreach ($postIds as $postId) {
            $count = rand(1, 10);
            for ($i = 0; $i < $count; $i++) {
                Comment::create([
                    'post_id' => $postId,
                    'user_id' => $userIds->random(),
                    'text' => fake()->realText(50),
                ]);
            }
        }
    }
}
