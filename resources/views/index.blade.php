<x-layout>
    <ul class="flex flex-col gap-y-4">
        @foreach ($posts as $post)
            <li>
                <img src="{{ asset('storage/' . $post->image) }}" alt="" class="w-full" width="{{ $post->width }}" height="{{ $post->height }}">
                <div class="px-2 py-4 flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        @if ($post->email)
                            <a href="mailto:{{ $post->email }}"
                                class="text-blue-500 underline">{{ $post->name ?? 'no name' }}</a>
                        @else
                            <span class="">{{ $post->name ?? 'no name' }}</span>
                        @endif
                        <span class="text-sm text-gray-500">{{ $post->created_at->format('Y/m/d') }}</span>
                    </div>
                    @if ($post->text)
                        <p>{{ $post->text }}</p>
                    @endif
                </div>
            </li>
        @endforeach
    </ul>
    <div class="py-8 max-w-[95%] mx-auto">
        {{ $posts->links() }}
    </div>
</x-layout>
