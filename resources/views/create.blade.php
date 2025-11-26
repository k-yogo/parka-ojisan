<x-layout>
    <div class="w-full flex justify-center items-center flex-1">
        <form action="{{ route('posts.store') }}" method="post" class="p-4 w-full flex flex-col gap-y-4"
            enctype="multipart/form-data">
            @csrf
            <div class="flex flex-col gap-y-2">
                <label for="image" class="block text-sm">Image</label>

                <div class="flex items-center justify-center w-full">
                    <label for="image"
                        class="flex flex-col items-center justify-center w-full h-64 bg-gray-50 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
                        <div class="flex flex-col items-center justify-center text-gray-600 pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" />
                            </svg>
                            <p class="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p class="text-xs">PNG, JPG, GIF, WebP (MIN. 400x400px)</p>
                        </div>
                        <input id="image" type="file" class="hidden" name="image" />
                    </label>
                </div>
                @error('image')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="name" class="flex justify-between items-center text-sm">
                    <span>Name</span>
                    <span class="text-xs text-gray-500">Optional</span>
                </label>
                <input type="text" name="name" id="name"
                    class="block w-full border-gray-200 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md"
                    value="{{ old('name') }}">
                @error('name')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="email" class="flex justify-between items-center text-sm">
                    <span>Email</span>
                    <span class="text-xs text-gray-500">Optional</span>
                </label>
                <input type="email" name="email" id="email"
                    class="block w-full border-gray-200 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md"
                    value="{{ old('email') }}">
                @error('email')
                    <p class="error text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>
            <div class="flex flex-col gap-y-2">
                <label for="text" class="block text-sm">Text</label>
                <textarea name="text" id="text" rows="4"
                    class="block w-full border-gray-200 border focus:border-blue-500 p-2 rounded-md focus:ring-blue-500"
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
<script>
    // ページ全体でドラッグ&ドロップのデフォルト動作を防ぐ
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    document.addEventListener('DOMContentLoaded', function() {

        const dropZone = document.querySelector('label[for="image"].flex');
        const fileInput = document.getElementById('image');


        if (!dropZone) {
            console.error('❌ dropZone not found!');
            return;
        }

        if (!fileInput) {
            console.error('❌ fileInput not found!');
            return;
        }

        const dropZoneText = dropZone.querySelector('.flex.flex-col.items-center');

        // ドラッグオーバー時のスタイル変更
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('bg-blue-50', 'border-blue-400');
                dropZone.classList.remove('bg-gray-50', 'border-gray-200');
            });
        });

        // ドラッグが離れた時のスタイルを元に戻す
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('bg-blue-50', 'border-blue-400');
            dropZone.classList.add('bg-gray-50', 'border-gray-200');
        });

        // ドロップ時の処理
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // スタイルを元に戻す
            dropZone.classList.remove('bg-blue-50', 'border-blue-400');
            dropZone.classList.add('bg-gray-50', 'border-gray-200');

            const files = e.dataTransfer.files;

            if (files.length > 0) {

                // DataTransferオブジェクトを作成してファイルを設定
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                fileInput.files = dataTransfer.files;


                // 画像プレビューを表示
                displayImagePreview(files[0]);
            }
        });

        // 画像プレビューを表示する関数
        function displayImagePreview(file) {
            console.log('🖼️ Displaying image preview:', file.name);

            // 既存のプレビューがあれば削除
            const existingPreview = dropZone.querySelector('.image-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            const existingDeleteBtn = dropZone.querySelector('.delete-preview-btn');
            if (existingDeleteBtn) {
                existingDeleteBtn.remove();
            }

            // 元のコンテンツを非表示
            dropZoneText.style.display = 'none';

            // 高さをautoに変更
            dropZone.classList.remove('h-64');
            dropZone.style.height = 'auto';

            // FileReaderで画像を読み込む
            const reader = new FileReader();

            reader.onload = function(e) {
                // 画像要素を作成
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-preview w-full rounded-md';
                img.alt = 'Preview';

                // 削除ボタンを作成
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'delete-preview-btn absolute top-1 right-3 text-white hover:text-gray-300 text-3xl font-bold transition-colors cursor-pointer';
                deleteBtn.innerHTML = '✕';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    resetDropZone();
                };

                // dropZoneを相対位置に設定
                dropZone.style.position = 'relative';

                dropZone.appendChild(img);
                dropZone.appendChild(deleteBtn);
                console.log('✅ Image preview displayed with delete button!');
            };

            reader.readAsDataURL(file);
        }

        // ドロップゾーンをリセットする関数
        function resetDropZone() {
            console.log('🔄 Resetting drop zone...');

            // プレビュー画像と削除ボタンを削除
            const existingPreview = dropZone.querySelector('.image-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            const existingDeleteBtn = dropZone.querySelector('.delete-preview-btn');
            if (existingDeleteBtn) {
                existingDeleteBtn.remove();
            }

            // 元のコンテンツを表示
            dropZoneText.style.display = '';

            // 高さを元に戻す
            dropZone.classList.add('h-64');
            dropZone.style.height = '';

            // ファイルinputをクリア
            fileInput.value = '';

            console.log('✅ Drop zone reset!');
        }

        // 通常のファイル選択時にも画像プレビューを表示
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                displayImagePreview(e.target.files[0]);
            }
        });

    });
</script>
