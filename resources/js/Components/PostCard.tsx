import { Post } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    Link2,
    Trash2,
    Heart,
    Share,
    MessageCircle,
    X,
} from 'lucide-react';
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
            onClick={
                disableLink
                    ? undefined
                    : () =>
                          router.visit(
                              `/${post.user.user_id}/status/${post.id}`,
                          )
            }
            className={`flex flex-col gap-y-0 transition-colors ${disableLink ? '' : 'hover:bg-gray-50 cursor-pointer'}`}
        >
            <img
                src={`/storage/${post.image}`}
                alt=""
                className="w-full"
                width={post.width}
                height={post.height}
                onClick={(e) => {
                    if (window.innerWidth >= 640) {
                        e.stopPropagation();
                        setImageModalOpen(true);
                    }
                }}
            />

            <div className="p-4 sm:py-4 sm:px-3 flex gap-x-3 items-start">
                <Link
                    href={`/${post.user.user_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="relative group"
                >
                    <div className="absolute w-full h-full top-0 left-0 group-hover:bg-[rgba(26,26,26,0.15)] rounded-full duration-200"></div>
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
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-x-1"
                        >
                            <span className="font-semibold text-[15px] hover:underline">
                                {post.user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                @{post.user.user_id}
                            </span>
                        </Link>
                        <span className="text-sm text-gray-500 px-1">·</span>
                        <Link
                            href={`/${post.user.user_id}/status/${post.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-sm text-gray-500 hover:underline`}
                        >
                            {showFullDate
                                ? new Date(post.created_at).toLocaleString(
                                      'ja-JP',
                                      {
                                          year: 'numeric',
                                          month: 'numeric',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      },
                                  )
                                : new Date(post.created_at).toLocaleDateString(
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
                                    className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer transition-colors"
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
                                        <div className="absolute -right-1 bg-white shadow-md rounded-lg top-0 overflow-hidden z-20">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(
                                                        `${window.location.origin}/${post.user.user_id}/status/${post.id}`,
                                                    );
                                                    router.flash(() => ({
                                                        success:
                                                            'リンクをコピーしました',
                                                    }));
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                            confirm(
                                                                'この投稿を削除しますか？',
                                                            )
                                                        ) {
                                                            fetch(
                                                                `/api/posts/${post.id}`,
                                                                {
                                                                    method: 'DELETE',
                                                                    headers: {
                                                                        'X-XSRF-TOKEN':
                                                                            decodeURIComponent(
                                                                                document.cookie
                                                                                    .split(
                                                                                        '; ',
                                                                                    )
                                                                                    .find(
                                                                                        (
                                                                                            row,
                                                                                        ) =>
                                                                                            row.startsWith(
                                                                                                'XSRF-TOKEN=',
                                                                                            ),
                                                                                    )
                                                                                    ?.split(
                                                                                        '=',
                                                                                    )[1] ??
                                                                                    '',
                                                                            ),
                                                                    },
                                                                },
                                                            ).then((res) => {
                                                                if (res.ok) {
                                                                    router.flash(
                                                                        () => ({
                                                                            success:
                                                                                '削除しました',
                                                                        }),
                                                                    );
                                                                    queryClient.setQueriesData(
                                                                        {
                                                                            queryKey:
                                                                                [
                                                                                    'posts',
                                                                                ],
                                                                        },
                                                                        (
                                                                            old: any,
                                                                        ) => {
                                                                            if (
                                                                                !old
                                                                            )
                                                                                return old;
                                                                            return {
                                                                                ...old,
                                                                                pages: old.pages.map(
                                                                                    (
                                                                                        page: any,
                                                                                    ) => ({
                                                                                        ...page,
                                                                                        data: page.data.filter(
                                                                                            (
                                                                                                p: any,
                                                                                            ) =>
                                                                                                p.id !==
                                                                                                post.id,
                                                                                        ),
                                                                                    }),
                                                                                ),
                                                                            };
                                                                        },
                                                                    );
                                                                    onDelete?.();
                                                                }
                                                            });
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
                                    router.visit(
                                        `/${post.user.user_id}/status/${post.id}`,
                                    );
                                }
                            }}
                            className="flex items-center gap-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        >
                            <MessageCircle size={20} strokeWidth={1} />
                            <span className="text-xs">
                                {commentsCountOverride ?? post.comments_count}
                            </span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                            className={`flex items-center gap-x-1 cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                        >
                            <Heart
                                size={22}
                                fill={isLiked ? 'red' : 'none'}
                                color="currentColor"
                                strokeWidth={1}
                            />
                            <span className="text-xs">{likesCount}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                    navigator.share({
                                        url: `${window.location.origin}/${post.user.user_id}/status/${post.id}`,
                                    });
                                } else {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/${post.user.user_id}/status/${post.id}`,
                                    );
                                }
                            }}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
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
                        <button
                            className="absolute top-4 left-4 z-10 text-white cursor-pointer"
                            onClick={() => setImageModalOpen(false)}
                        >
                            <X size={28} />
                        </button>
                        <img
                            src={`/storage/${post.image}`}
                            alt=""
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-full max-h-full"
                        />
                    </div>,
                    document.body,
                )}
        </li>
    );
}
