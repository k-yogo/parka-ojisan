<?php

namespace App\Services;

use OpenAI;

class ParkaOjisanDetector {
  protected $client;

  public function __construct() {
    // OpenAIクライアントを初期化
    $this->client = OpenAI::client(config('services.openai.api_key'));
  }

  /**
   * 画像がパーカーおじさんかどうかを判定
   *
   * @param string $imagePath 画像ファイルのパス（storage/app/public/images/xxx.webp など）
   * @return array ['is_parka_ojisan' => bool, 'confidence' => string, 'reason' => string]
   */
  public function detect($imagePath) {
    // 1. 画像をbase64エンコード
    $imageData = file_get_contents($imagePath);
    $base64Image = base64_encode($imageData);
    $mimeType = mime_content_type($imagePath);

    // 2. OpenAI APIにリクエスト
    // ステップ1: プロンプト（質問文）を準備
    $prompt = 'この画像を分析してください。以下の条件を満たしているか判定してください：
1. 人物（特に男性、おじさん）が写っている
2. その人物がパーカー（フード付きの上着）を着ている

JSONフォーマットで回答してください：
{
  "is_parka_ojisan": true/false,
  "confidence": "high/medium/low",
  "reason": "判定理由を日本語で簡潔に"
}';

    // ステップ2: テキスト部分を準備
    $textContent = [
      'type' => 'text',
      'text' => $prompt,
    ];

    // ステップ3: 画像部分を準備
    $imageContent = [
      'type' => 'image_url',
      'image_url' => [
        'url' => "data:{$mimeType};base64,{$base64Image}",
      ],
    ];

    // ステップ4: メッセージ全体を準備
    $message = [
      'role' => 'user',
      'content' => [$textContent, $imageContent],
    ];

    // ステップ5: APIリクエスト（シンプル！）
    $response = $this->client->chat()->create([
      'model' => 'gpt-4o-mini',
      'messages' => [$message],
      'max_tokens' => 300,
    ]);

    // 3. レスポンスを解析
    $content = $response->choices[0]->message->content;

    // JSONを抽出（AIが余計なテキストを含む場合があるため）
    $jsonMatch = preg_match('/\{.*\}/s', $content, $matches);
    if ($jsonMatch) {
      $result = json_decode($matches[0], true);
    } else {
      // JSONが取得できない場合のフォールバック
      $result = [
        'is_parka_ojisan' => false,
        'confidence' => 'low',
        'reason' => 'AI判定に失敗しました',
      ];
    }

    return $result;
  }

  /**
   * アップロードされたファイルから直接判定（より便利なメソッド）
   *
   * @param \Illuminate\Http\UploadedFile $file
   * @return array
   */
  public function detectFromUploadedFile($file) {
    // 一時的に保存して判定
    $tempPath = $file->getRealPath();
    return $this->detect($tempPath);
  }
}
