<?php

namespace App\Services;

use OpenAI;

class ParkaOjisanDetector {
    protected $client;

    public function __construct() {
        $this->client = OpenAI::client(config('services.openai.api_key'));
    }

    public function detect($imagePath) {
        $imageData = file_get_contents($imagePath);
        $base64Image = base64_encode($imageData);
        $mimeType = mime_content_type($imagePath);

        $prompt = 'この画像を分析してください。以下の条件を満たしているか判定してください：
1. 人物（特に男性、おじさん）が写っている
2. その人物がパーカー（フード付きの衣服。ただしフード付きのもの身に着けていれば柔軟にパーカーであると判断してよい。例えばウェットスーツなどであっても）を着ている

JSONフォーマットで回答してください：
{
  "is_parka_ojisan": true/false,
  "confidence": "high/medium/low",
  "reason": "判定理由を日本語で簡潔に"
}';

        $textContent = [
            'type' => 'text',
            'text' => $prompt,
        ];

        $imageContent = [
            'type' => 'image_url',
            'image_url' => [
                'url' => "data:{$mimeType};base64,{$base64Image}",
            ],
        ];

        $message = [
            'role' => 'user',
            'content' => [$textContent, $imageContent],
        ];

        $response = $this->client->chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => [$message],
            'max_tokens' => 300,
        ]);

        $content = $response->choices[0]->message->content;

        $jsonMatch = preg_match('/\{.*\}/s', $content, $matches);
        if ($jsonMatch) {
            $result = json_decode($matches[0], true);
        } else {
            $result = [
                'is_parka_ojisan' => false,
                'confidence' => 'low',
                'reason' => 'AI判定に失敗しました',
            ];
        }

        return $result;
    }

    public function detectFromUploadedFile($file) {
        $tempPath = $file->getRealPath();
        return $this->detect($tempPath);
    }
}
