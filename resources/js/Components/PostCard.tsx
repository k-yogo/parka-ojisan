import { Post } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Ellipsis, Link2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PostCard({ post }: { post: Post }) {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(false);
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuOpen]);

    return (
        <li className="flex flex-col gap-y-0">
            <img
                src={`/storage/${post.image}`}
                alt=""
                className="w-full"
                width={post.width}
                height={post.height}
            />
            <div className="p-4 sm:py-4 sm:px-2 flex gap-x-3 items-start">
                <Link href={`/${post.user.user_id}`}>
                    {post.user.icon_path ? (
                        <img
                            src={`/storage/${post.user.icon_path}`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                </Link>

                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-center">
                        <Link
                            href={`/${post.user.user_id}`}
                            className="flex items-center gap-x-1"
                        >
                            <span className="font-semibold text-[15px]">
                                {post.user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                @{post.user.user_id}
                            </span>
                        </Link>
                        <span className="text-sm text-gray-500 px-1">·</span>
                        <Link
                            href={`/${post.user.user_id}/status/${post.id}`}
                            className={`text-sm text-gray-500`}
                        >
                            {new Date(post.created_at).toLocaleDateString(
                                'ja-JP',
                            )}
                        </Link>

                        <div className="ml-auto">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(!menuOpen);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                                >
                                    <Ellipsis size={18} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute -right-1 bg-white shadow-md rounded-lg top-0 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${window.location.origin}/${post.user.user_id}/status/${post.id}`,
                                                );
                                                setMenuOpen(false);
                                            }}
                                            className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer flex items-center gap-x-2"
                                        >
                                            <Link2 size={16} />
                                            <span className="whitespace-nowrap">
                                                リンクをコピー
                                            </span>
                                        </button>
                                        {auth.user?.id === post.user_id && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'この投稿を削除しますか？',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            route(
                                                                'posts.destroy',
                                                                post.id,
                                                            ),
                                                        );
                                                    }
                                                    setMenuOpen(false);
                                                }}
                                                className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left cursor-pointer flex items-center gap-x-2"
                                            >
                                                <Trash2 size={16} />
                                                <span className="whitespace-nowrap">
                                                    削除
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="whitespace-pre-wrap">{post.text}</p>
                </div>
            </div>
        </li>
    );
}
