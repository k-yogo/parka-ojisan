<x-layout>
    <div class="w-full flex justify-center items-center flex-1">
        <form action="{{ route('posts.store') }}" method="post" class="py-4 px-2 w-full flex flex-col gap-y-4"
            enctype="multipart/form-data">
            @csrf
            <div class="flex flex-col gap-y-2">
                <label for="image" class="block text-sm">Image*</label>
                <input type="file" name="image" id="image"
                    class="block w-full border-gray-300 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md text-sm"
                    value="{{ old('image') }}">
                @error('image')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="name" class="block text-sm">Name</label>
                <input type="text" name="name" id="name"
                    class="block w-full border-gray-300 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md"
                    value="{{ old('name') }}">
                @error('name')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="email" class="block text-sm">Email</label>
                <input type="email" name="email" id="email"
                    class="block w-full border-gray-300 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md"
                    value="{{ old('email') }}">
                @error('email')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="text" class="block text-sm">Text*</label>
                <textarea name="text" id="text" rows="4"
                    class="block w-full border-gray-300 border focus:border-blue-500 p-2 rounded-md focus:ring-blue-500"
                    value="{{ old('text') }}"></textarea>
                @error('text')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <button type="submit"
                class="my-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md cursor-pointer">Post</button>
        </form>
    </div>
</x-layout>
