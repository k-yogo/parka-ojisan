<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="robots" content="noindex">
    <meta name="og:image" content="{{ asset('ogp.jpg') }}">
    <meta name="og:description" content="パーカーおじさんの画像掲示板。アップロード時にAIでパーカーおじさんかどうか判定します。">
    <title>パーカーおじさん</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="flex flex-col min-h-dvh text-gray-950">
    <header class="p-4 flex justify-between items-center sticky top-0 bg-white z-10 border-b border-gray-200">
        <h1><a href="{{ route('posts.index') }}" class="hover:opacity-70" aria-label="Home">パーカーおじさん</a></h1>
        <a href="{{ route('posts.create') }}" class="hover:opacity-70" aria-label="New Post" title="New Post">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                viewBox="0 0 24 24" id="new-post">
                <path fill="currentColor" fill-rule="evenodd"
                    d="M1.5 7C1.5 3.96243 3.96243 1.5 7 1.5H17C20.0376 1.5 22.5 3.96243 22.5 7V17C22.5 20.0376 20.0376 22.5 17 22.5H7C3.96243 22.5 1.5 20.0376 1.5 17V7ZM7 2.5C4.51472 2.5 2.5 4.51472 2.5 7V17C2.5 19.4853 4.51472 21.5 7 21.5H17C19.4853 21.5 21.5 19.4853 21.5 17V7C21.5 4.51472 19.4853 2.5 17 2.5H7Z"
                    clip-rule="evenodd"></path>
                <path fill="currentColor" fill-rule="evenodd" d="M11.5 18V6H12.5V18H11.5Z" clip-rule="evenodd"></path>
                <path fill="currentColor" fill-rule="evenodd" d="M18 12.5H6V11.5H18V12.5Z" clip-rule="evenodd"></path>
            </svg>
        </a>
    </header>
    <main class="w-full max-w-md mx-auto flex-1 flex flex-col">
        {{ $slot }}
    </main>
</body>

</html>
