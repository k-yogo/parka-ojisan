import Modal from '@/Components/Modal';
import { router, useForm } from '@inertiajs/react';
import { DragEvent, useEffect, useRef, useState } from 'react';

export default function CreatePostModal({
    show,
    onClose,
}: {
    show: boolean;
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        image: File | null;
        text: string;
    }>({
        image: null,
        text: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!processing) return;
        const timer = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(timer);
    }, [processing]);

    const handleFile = (file: File) => {
        setData('image', file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const resetImage = () => {
        setData('image', null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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

    const handleClose = () => {
        reset();
        resetImage();
        onClose();
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => {
                reset();
                resetImage();
                onClose();
            },
            onError: () => {
                router.visit(window.location.href, {
                    reset: ['posts'],
                    preserveState: true,
                    preserveScroll: true,
                });
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose} className="max-w-xl">
            <div className="relative p-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                >
                    ✕
                </button>
                <div className="w-full max-w-md mx-auto flex flex-col gap-y-4">
                    <h2 className="text-sm text-center">
                        パーカーおじさんの画像を追加
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-y-4"
                    >
                        {/* 画像アップロード */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm">Image</label>
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={resetImage}
                                        className="absolute top-1 right-3 text-white hover:text-gray-300 text-3xl font-bold cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={`flex flex-col items-center justify-center w-full h-64 border border-dashed rounded-md cursor-pointer transition-colors ${
                                        isDragging
                                            ? 'bg-blue-50 border-blue-400'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex flex-col items-center text-gray-600 px-2">
                                        <svg
                                            className="w-8 h-8 mb-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm">
                                            <span className="font-semibold">
                                                Click to upload
                                            </span>{' '}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs">
                                            PNG, JPG, GIF, WebP (MIN. 400x400px)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            🤖 AIがパーカーおじさんか判定します
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0])
                                                handleFile(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            )}
                            {errors.image && (
                                <p className="text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="text" className="text-sm">
                                Text
                            </label>
                            <textarea
                                id="text"
                                rows={4}
                                className="block w-full border-gray-200 border focus:border-blue-500 focus:ring-blue-500 p-2 rounded-md"
                                value={data.text}
                                onChange={(e) =>
                                    setData('text', e.target.value)
                                }
                            />
                            {errors.text && (
                                <p className="text-sm text-red-500">
                                    {errors.text}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="my-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing ? (
                                <>
                                    解析中
                                    <span className="inline-block w-6 text-left">
                                        {dots}
                                    </span>
                                </>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
