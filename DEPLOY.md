# デプロイ手順

## 本番環境の構成

### サーバー
- スターレンタルサーバー
- PHP: `/usr/bin/php8.4`（デフォルトの `php` コマンドは 8.0 なので注意）
- Composer: `/usr/bin/composer`
- URL: `https://parka-ojisan.yogo.dev/`

### ディレクトリ構成

```
~/yogo.dev/
├── parka-ojisan/           ← Laravel アプリ本体（git 管理）
│   ├── public/
│   │   ├── build/          ← ビルド済みアセット（git 管理）
│   │   ├── storage         ← storage/app/public へのシンボリックリンク（git 管理外）
│   │   └── ...
│   └── ...
└── public_html/
    └── parka-ojisan/       ← ドキュメントルート（git 管理外）
        ├── .user.ini        ← サーバー固有の PHP 設定
        ├── .htaccess        → ../../parka-ojisan/public/.htaccess へのシンボリックリンク
        ├── index.php        → ../../parka-ojisan/public/index.php へのシンボリックリンク
        ├── favicon.ico      → ../../parka-ojisan/public/favicon.ico へのシンボリックリンク
        ├── ogp.png          → ../../parka-ojisan/public/ogp.png へのシンボリックリンク
        ├── apple-touch-icon.png → ../../parka-ojisan/public/apple-touch-icon.png へのシンボリックリンク
        ├── robots.txt       → ../../parka-ojisan/public/robots.txt へのシンボリックリンク
        ├── build            → ../../parka-ojisan/public/build へのシンボリックリンク
        └── storage          → ../../parka-ojisan/public/storage へのシンボリックリンク
```

### ローカル環境との主な違い

| 項目 | ローカル（Docker/Sail） | 本番サーバー |
|---|---|---|
| PHP 実行 | コンテナ内の `php` | `/usr/bin/php8.4` |
| Composer | `sail composer` | `/usr/bin/composer` |
| `vendor/` | `sail composer install` で生成 | サーバー上で `composer install` |
| `public/build/` | ローカルでビルド | GitHub Actions でビルド・転送 |
| `public/storage` | コンテナ内の絶対パスで symlink | `artisan storage:link` でサーバーパスで作成 |
| DB | Docker の MySQL コンテナ | サーバーの MySQL |

---

## 注意事項

- `storage/app/public/` にアップロード画像が保存されている。サーバー上のディレクトリを削除・再構築する際は**必ず事前にバックアップすること**。
- `storage/` は git 管理外のため、`git pull` や再クローンでは復元できない。

```bash
# storage のバックアップ
cp -r ~/yogo.dev/parka-ojisan/storage ~/yogo.dev/storage.backup
```

---

## 初回セットアップ（サーバー上）

```bash
# 1. リポジトリをクローン
cd ~/yogo.dev
git clone git@github.com:k-yogo/parka-ojisan.git

# 2. .env を作成・設定
cp .env.example .env
# .env を編集して DB 接続情報・OPENAI_API_KEY などを設定

# 3. 依存関係をインストール
cd ~/yogo.dev/parka-ojisan
/usr/bin/php8.4 /usr/bin/composer install --no-dev --optimize-autoloader

# 4. アプリケーションキーを生成
/usr/bin/php8.4 artisan key:generate

# 5. マイグレーション実行
/usr/bin/php8.4 artisan migrate

# 6. storage symlink を作成（public/storage → storage/app/public）
/usr/bin/php8.4 artisan storage:link

# 7. ドキュメントルートの symlink を設定
cd ~/yogo.dev/public_html/parka-ojisan
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/.htaccess .htaccess
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/index.php index.php
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/favicon.ico favicon.ico
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/ogp.png ogp.png
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/apple-touch-icon.png apple-touch-icon.png
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/robots.txt robots.txt
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/build build
ln -sf /home/yogo/yogo.dev/parka-ojisan/public/storage storage
```

---

## 通常のデプロイ（自動）

`main` ブランチに push すると GitHub Actions が自動でデプロイします。

```bash
# ローカルでの作業フロー（ビルド不要！）
git add .
git commit -m "..."
git push origin main   # これだけで自動デプロイ！
```

### GitHub Actions が実行する内容

1. `npm ci && npm run build`（ランナー上でアセットをビルド）
2. `rsync` で `public/build/` をサーバーに転送
3. `git pull origin main`（PHP ファイルを更新）
4. `composer install --no-dev --optimize-autoloader`
5. `artisan migrate --force`
6. `artisan config:cache / route:cache / view:cache`

---

## GitHub Actions の設定

以下のシークレットを GitHub リポジトリの Settings → Secrets に登録してください。

| シークレット名 | 内容 |
|---|---|
| `SERVER_HOST` | サーバーのホスト名 |
| `SERVER_USER` | SSH ユーザー名 |
| `SERVER_SSH_KEY` | デプロイ用 SSH 秘密鍵 |
| `SERVER_PORT` | SSH ポート番号 |

### デプロイ用 SSH キーの生成（初回のみ）

```bash
# ローカルで実行
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/parka-ojisan-deploy -N ""

# 公開鍵をサーバーに登録
ssh-copy-id -i ~/.ssh/parka-ojisan-deploy.pub ユーザー名@サーバーホスト名
```
