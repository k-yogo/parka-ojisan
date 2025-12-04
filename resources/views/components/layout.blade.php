<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="og:description" content="パーカーおじさんの画像掲示板。アップロード時にAIでパーカーおじさんかどうか判定します。">
    <meta name="og:url" content="{{ url('/') }}">
    <meta name="og:image" content="{{ asset('ogp.png') }}">
    <meta name="og:type" content="website">
    <meta name="og:title" content="パーカーおじさん">
    <title>パーカーおじさん</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="flex flex-col min-h-dvh text-gray-950 bg-white">
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
    <footer class="p-4 text-center text-sm text-gray-600 border-t border-gray-200 bg-white">
        <div class="flex flex-col items-center gap-2">
            <a href="https://github.com/k-yogo/parka-ojisan" target="_blank" rel="noopener noreferrer"
                class="hover:opacity-70 transition-opacity" aria-label="GitHub Repository">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            </a>
            <p>&copy; {{ date('Y') }} パーカーおじさん</p>
        </div>
    </footer>
</body>

</html>
