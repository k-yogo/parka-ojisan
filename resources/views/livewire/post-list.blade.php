<div>
    <ul class="flex flex-col gap-y-4">
        @foreach ($posts as $post)
            <li>
                <img src="{{ asset('storage/' . $post->image) }}" alt="" class="w-full" width="{{ $post->width }}"
                    height="{{ $post->height }}">
                <div class="p-4 sm:py-4 sm:px-2 flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        @if ($post->email)
                            <a href="mailto:{{ $post->email }}"
                                class="text-blue-500 underline hover:no-underline">{{ $post->name ?? 'no name' }}</a>
                        @else
                            <span class="">{{ $post->name ?? 'no name' }}</span>
                        @endif
                        <span class="text-sm text-gray-500"
                            title="{{ $post->created_at->format('Y/m/d H:i') }}">{{ $post->created_at->format('Y/m/d') }}</span>
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
</div>
