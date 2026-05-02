import { Post } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Ellipsis, Link2, Trash2, Heart, Share, MessageCircle, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

export default function PostCard({
    post,
    onDelete,
    onCommentClick,
    commentsCountOverride,
    showFullDate,
    disableLink,
}: {
    post: Post;
    onDelete?: () => void;
    onCommentClick?: () => void;
    commentsCountOverride?: number;
    showFullDate?: boolean;
    disableLink?: boolean;
}) {
    const { auth } = usePage().props;
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    useEffect(() => {
        if (!imageModalOpen) return;
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setImageModalOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [imageModalOpen]);

    const handleLike = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        setIsLiked(!isLiked);
        const newCount = isLiked ? likesCount - 1 : likesCount + 1;
        setLikesCount(newCount);

        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );

        if (isLiked) {
            fetch(`/api/posts/${post.id}/like`, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': xsrfToken },
            });
        } else {
            fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': xsrfToken },
            });
        }
    };

    useEffect(() => {
        setIsLiked(post.is_liked);
        setLikesCount(post.likes_count);
    }, [post.is_liked, post.likes_count]);

    useEffect(() => {
        if (!auth.user) {
            setIsLiked(false);
        }
    }, [auth.user]);

    return (
        <li
            onClick={disableLink ? undefined : () => router.visit(`/${post.user.user_id}/status/${post.public_id}`)}
            className={`flex flex-col gap-y-0 transition-colors ${disableLink ? '' : 'cursor-pointer'}`}
        >
            <img
                src={`/storage/${post.image}`}
                alt=""
                className="w-full sm:cursor-pointer"
                width={post.width}
                height={post.height}
                onClick={(e) => {
                    if (window.innerWidth >= 640) {
                        e.stopPropagation();
                        setImageModalOpen(true);
                    }
                }}
            />

            <div className="flex items-start gap-x-3 p-4 sm:px-3 sm:py-4 hover:bg-gray-50 transition-colors">
                <Link href={`/${post.user.user_id}`} onClick={(e) => e.stopPropagation()} className="group relative">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full duration-200 group-hover:bg-[rgba(26,26,26,0.15)]"></div>
                    {post.user.icon_path ? (
                        <img src={`/storage/${post.user.icon_path}`} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                    )}
                </Link>

                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Link href={`/${post.user.user_id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-1">
                            <span className="text-[15px] font-semibold hover:underline">{post.user.name}</span>
                            <span className="text-sm text-gray-500">@{post.user.user_id}</span>
                        </Link>
                        <span className="px-1 text-sm text-gray-500">·</span>
                        <Link
                            href={`/${post.user.user_id}/status/${post.public_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-sm text-gray-500 hover:underline`}
                        >
                            {showFullDate
                                ? new Date(post.created_at).toLocaleString('ja-JP', {
                                      year: 'numeric',
                                      month: 'numeric',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : new Date(post.created_at).toLocaleDateString('ja-JP')}
                        </Link>

                        <div className="ml-auto">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(!menuOpen);
                                    }}
                                    className="cursor-pointer text-xl text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    <Ellipsis size={18} />
                                </button>
                                {menuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen(false);
                                            }}
                                        />
                                        <div className="absolute top-0 -right-1 z-20 overflow-hidden rounded-lg bg-white shadow-md">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(`${window.location.origin}/${post.user.user_id}/status/${post.public_id}`);
                                                    router.flash(() => ({
                                                        success: 'リンクをコピーしました',
                                                    }));
                                                    setMenuOpen(false);
                                                }}
                                                className="flex w-full cursor-pointer items-center gap-x-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
                                            >
                                                <Link2 size={16} />
                                                <span className="whitespace-nowrap">リンクをコピー</span>
                                            </button>
                                            {auth.user?.id === post.user_id && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('この投稿を削除しますか？')) {
                                                            fetch(`/api/posts/${post.id}`, {
                                                                method: 'DELETE',
                                                                headers: {
                                                                    'X-XSRF-TOKEN': decodeURIComponent(
                                                                        document.cookie
                                                                            .split('; ')
                                                                            .find((row) => row.startsWith('XSRF-TOKEN='))
                                                                            ?.split('=')[1] ?? '',
                                                                    ),
                                                                },
                                                            }).then((res) => {
                                                                if (res.ok) {
                                                                    router.flash(() => ({
                                                                        success: '削除しました',
                                                                    }));
                                                                    queryClient.setQueriesData(
                                                                        {
                                                                            queryKey: ['posts'],
                                                                        },
                                                                        (old: any) => {
                                                                            if (!old) return old;
                                                                            return {
                                                                                ...old,
                                                                                pages: old.pages.map((page: any) => ({
                                                                                    ...page,
                                                                                    data: page.data.filter((p: any) => p.id !== post.id),
                                                                                })),
                                                                            };
                                                                        },
                                                                    );
                                                                    onDelete?.();
                                                                }
                                                            });
                                                        }
                                                        setMenuOpen(false);
                                                    }}
                                                    className="flex w-full cursor-pointer items-center gap-x-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="whitespace-nowrap">削除</span>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="whitespace-pre-wrap">{post.text}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onCommentClick) {
                                    onCommentClick();
                                } else {
                                    sessionStorage.setItem('focusComment', '1');
                                    router.visit(`/${post.user.user_id}/status/${post.public_id}`);
                                }
                            }}
                            className="flex cursor-pointer items-center gap-x-1 text-gray-400 transition-colors hover:text-gray-600"
                        >
                            <MessageCircle size={20} strokeWidth={1} />
                            <span className="text-xs">{commentsCountOverride ?? post.comments_count}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                            className={`flex cursor-pointer items-center gap-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <Heart size={22} fill={isLiked ? 'red' : 'none'} color="currentColor" strokeWidth={1} />
                            <span className="text-xs">{likesCount}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                    navigator.share({
                                        url: `${window.location.origin}/${post.user.user_id}/status/${post.public_id}`,
                                    });
                                } else {
                                    navigator.clipboard.writeText(`${window.location.origin}/${post.user.user_id}/status/${post.public_id}`);
                                }
                            }}
                            className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                        >
                            <Share size={18} />
                        </button>
                    </div>
                </div>
            </div>
            {imageModalOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                        onClick={(e) => {
                            e.stopPropagation();
                            setImageModalOpen(false);
                        }}
                    >
                        <button className="absolute top-4 left-4 z-10 cursor-pointer text-white" onClick={() => setImageModalOpen(false)}>
                            <X size={28} />
                        </button>
                        <img src={`/storage/${post.image}`} alt="" onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full" />
                    </div>,
                    document.body,
                )}
        </li>
    );
}
