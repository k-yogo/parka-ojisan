# パーカーおじさん
パーカーを着たおじさんの画像を投稿するサイトです。<br>
投稿時にAIが画像を判定し、パーカーおじさん以外の画像は投稿できません。<br>
レスポンシブ対応しているのでスマホからもご確認いただけます。

<!-- スクリーンショットがあれば追加 -->
<img width="1400" alt="スクリーンショット" src="https://github.com/user-attachments/assets/c8a26e15-e05f-4f42-bcf1-cffb363dcc2d">

# URL
https://parka-ojisan.k-yogo.dev/

# 使用技術
- PHP 8.4
- Laravel 12
- MySQL 8.0
- Tailwind CSS 4
- Vite 7
- OpenAI API (GPT-4o-mini)
- Intervention Image (画像処理)

# 開発環境
- Docker / Docker Compose
- Laravel Sail

# 本番環境
- スターレンタルサーバー

# 機能一覧
- 画像投稿機能
  - ドラッグ&ドロップ対応
  - 画像プレビュー表示
  - 自動リサイズ・WebP変換 (Intervention Image)
- AI画像判定機能
  - OpenAI GPT-4o-mini による画像分析
  - パーカーおじさん以外は投稿拒否
- バリデーション機能
  - 画像サイズ制限 (最小400x400px)
  - アスペクト比制限 (1:3 〜 3:1)
  - ファイル形式制限 (PNG, JPG, GIF, WebP)
- ページネーション機能
- レスポンシブデザイン (Tailwind CSS)

# ローカル環境構築

## 必要なもの
- Docker Desktop
- OpenAI API Key

## セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/k-yogo/parka-ojisan.git
cd parka-ojisan

# .envファイルを作成
cp .env.example .env

# OpenAI APIキーを設定
# .env ファイルに以下を追加
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Sailを起動
./vendor/bin/sail up -d

# 依存関係をインストール
./vendor/bin/sail composer install
./vendor/bin/sail npm install

# アプリケーションキーを生成
./vendor/bin/sail artisan key:generate

# マイグレーション実行
./vendor/bin/sail artisan migrate

# アセットをビルド
./vendor/bin/sail npm run build

# ストレージリンクを作成
./vendor/bin/sail artisan storage:link
```

## 開発サーバー起動

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

<!-- アクセス: http://localhost -->

<!-- # テスト

```bash
./vendor/bin/sail artisan test
``` -->
