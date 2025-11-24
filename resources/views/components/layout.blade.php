<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>パーカーおじさん</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="flex flex-col min-h-dvh">
    <header class="p-4 shadow-sm flex justify-between items-center sticky top-0 bg-white z-10">
        <h1><a href="{{ route('posts.index') }}">パーカーおじさん</a></h1>
        <a href="{{ route('posts.create') }}/"><svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="plus">
                <path d="M2 17h13v13a1 1 0 1 0 2 0V17h13a1 1 0 1 0 0-2H17V2a1 1 0 1 0-2 0v13H2a1 1 0 1 0 0 2z"></path>
            </svg></a>
    </header>
    <main class="w-full max-w-lg mx-auto flex-1 flex flex-col">
      {{$slot}}
    </main>
</body>

</html>
