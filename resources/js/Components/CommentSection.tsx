import { useState, useEffect, useRef } from 'react';
import { Comment, PaginatedData, User } from '@/types';
import { Ellipsis, Trash2 } from 'lucide-react';

type Props = {
    postId: number;
    auth: User | null;
    focusComment?: boolean;
    onFocused?: () => void;
    onCommentAdded?: () => void;
    onCommentDeleted?: () => void;
};

const CommentSection = ({
    postId,
    auth,
    focusComment,
    onFocused,
    onCommentAdded,
    onCommentDeleted,
}: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        `/api/posts/${postId}/comments`,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuId]);

    const loadMore = () => {
        if (!nextPageUrl || isLoading) return;
        setIsLoading(true);
        fetch(nextPageUrl)
            .then((res) => res.json() as Promise<PaginatedData<Comment>>)
            .then((data) => {
                setComments((prev) => [...prev, ...data.data]);
                setNextPageUrl(data.next_page_url);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (sessionStorage.getItem('focusComment')) {
            sessionStorage.removeItem('focusComment');
            textareaRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        if (focusComment) {
            textareaRef.current?.focus();
            onFocused?.();
        }
    }, [focusComment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );

        fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrfToken,
            },
            body: JSON.stringify({ text }),
        })
            .then((res) => res.json() as Promise<Comment>)
            .then((newComment) => {
                setComments((prev) => [newComment, ...prev]);
                setText('');
                onCommentAdded?.();
            });
    };

    const handleDelete = (commentId: number) => {
        if (!confirm('このコメントを削除しますか？')) return;
        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );

        fetch(`/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'X-XSRF-TOKEN': xsrfToken },
        }).then((res) => {
            if (res.ok) {
                setComments((prev) => prev.filter((c) => c.id !== commentId));
                setOpenMenuId(null);
                onCommentDeleted?.();
            }
        });
    };

    useEffect(() => {
        loadMore();
    }, []);

    return (
        <div>
            <div className="my-2">
                <form
                    className="flex flex-col gap-y-2 items-end"
                    onSubmit={handleSubmit}
                >
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 border rounded-xl px-4 py-2 text-sm resize-none w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={
                            auth
                                ? 'コメントを入力...'
                                : 'ログインするとコメントできます'
                        }
                        rows={2}
                        disabled={!auth}
                    />
                    {auth && (
                        <button
                            type="submit"
                            className="text-sm text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                        >
                            送信
                        </button>
                    )}
                </form>
                {!auth && (
                    <div className="text-right mt-2">
                        <a
                            href="/login"
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            ログイン
                        </a>
                    </div>
                )}
            </div>

            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-x-3 py-2">
                    {comment.user.icon_path ? (
                        <img
                            src={`/storage/${comment.user.icon_path}`}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                    )}

                    <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-x-1">
                            <span className="font-semibold text-sm">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                @{comment.user.user_id}
                            </span>
                            <span className="text-xs text-gray-500">·</span>
                            <span className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleString(
                                    'ja-JP',
                                    {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                )}
                            </span>
                            {auth?.id === comment.user_id && (
                                <div className="relative ml-auto">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(
                                                openMenuId === comment.id
                                                    ? null
                                                    : comment.id,
                                            );
                                        }}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        <Ellipsis size={16} />
                                    </button>
                                    {openMenuId === comment.id && (
                                        <div className="absolute right-0 bg-white shadow-md rounded-lg overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(comment.id)
                                                }
                                                className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left cursor-pointer flex items-center gap-x-2"
                                            >
                                                <Trash2 size={14} />
                                                <span className="whitespace-nowrap">
                                                    削除
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-sm">{comment.text}</p>
                    </div>
                </div>
            ))}
            {nextPageUrl && (
                <div className="text-center mt-4">
                    <button
                        onClick={loadMore}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-color cursor-pointer"
                    >
                        {isLoading ? '読み込み中...' : 'もっと読み込む'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
