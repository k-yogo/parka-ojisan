<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>


        @php
            $component = $page['component'];
            $props = $page['props'];

            if ($component === 'Post/Show') {
                $ogTitle = $props['post']['user']['name'] . 'の投稿' . ' - パーカーおじさん';
                $ogImage = asset('storage/' . $props['post']['image']);
            } elseif ($component === 'User/Show') {
                $ogTitle = $props['user']['name'] . '(@' . $props['user']['user_id'] . ')' . ' - パーカーおじさん';
                $ogImage = $props['user']['icon_path']
                    ? asset('storage/' . $props['user']['icon_path'])
                    : asset('ogp.png');
            } else {
                $ogTitle = 'パーカーおじさん';
                $ogImage = asset('ogp.png');
            }
        @endphp

        <meta property="og:description" content="パーカーおじさんの画像投稿SNS。アップロード時にAIでパーカーおじさんかどうか判定します。">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:image" content="{{ $ogImage }}">

        <link rel="icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
