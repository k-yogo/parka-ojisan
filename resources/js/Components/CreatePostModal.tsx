import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';

export default function CreatePostModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const queryClient = useQueryClient();

    const [image, setImage] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ image?: string; text?: string }>({});
    const [dots, setDots] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!processing) return;
        const timer = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(timer);
    }, [processing]);

    const handleFile = (file: File) => {
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const resetImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        setImage(null);
        setText('');
        setPreview(null);
        setErrors({});
        onClose();
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('text', text);

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1] ?? '',
                ),
            },
            body: formData,
        });

        setProcessing(false);

        if (response.status === 422) {
            const json = await response.json();
            setErrors(json.errors);
            return;
        }

        if (response.ok) {
            router.flash(() => ({ success: '投稿しました' }));
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setImage(null);
            setText('');
            resetImage();
            onClose();
        }
    };

    return (
        <Modal show={show} onClose={handleClose} className="max-w-xl">
            <div className="relative p-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-2 right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                >
                    <X size={32} />
                </button>
                <div className="mx-auto flex w-full max-w-md flex-col gap-y-4">
                    <h2 className="text-center text-sm">パーカーおじさんの画像を追加</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm">Image</label>
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Preview" className="w-full rounded-md" />
                                    <button
                                        type="button"
                                        onClick={resetImage}
                                        className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-colors ${
                                        isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex flex-col items-center px-2 text-gray-600">
                                        <svg className="mb-4 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs">PNG, JPG, GIF, WebP (MIN. 400x400px)</p>
                                        <p className="mt-2 text-xs text-gray-500">🤖 AIがパーカーおじさんか判定します</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) handleFile(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            )}
                            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="text" className="text-sm">
                                Text
                            </label>
                            <textarea
                                id="text"
                                rows={4}
                                className="block w-full rounded-md border border-gray-200 p-2 focus:border-blue-500 focus:ring-blue-500"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {errors.text && <p className="text-sm text-red-500">{errors.text}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="my-2 cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    解析中
                                    <span className="inline-block w-6 text-left">{dots}</span>
                                </>
                            ) : (
                                '投稿'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
