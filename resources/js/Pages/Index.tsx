import CreatePostModal from '@/Components/CreatePostModal';
import Layout from '@/Layouts/Layout';
import { PaginatedData, Post } from '@/types';
import { InfiniteScroll, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Ellipsis } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = ({ posts }: { posts: PaginatedData<Post> }) => {
    const { flash } = usePage();
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        if (flash.success) {
            const timer = setTimeout(() => router.flash(() => ({})), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuId]);

    return (
        <>
            {flash.success && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    ✅ {flash.success}
                </div>
            )}
            <InfiniteScroll
                data="posts"
                as="ul"
                className="flex flex-col gap-y-4"
                preserveUrl
                loading={
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    </div>
                }
            >
                {posts.data.map((post) => (
                    <li key={post.id} className="flex flex-col gap-y-0">
                        <img
                            src={`/storage/${post.image}`}
                            alt=""
                            className="w-full"
                            width={post.width}
                            height={post.height}
                        />
                        <div className="p-4 sm:py-4 sm:px-2 flex gap-x-3 items-start">
                            <div>
                                {post.user.icon_path ? (
                                    <img
                                        src={`/storage/${post.user.icon_path}`}
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-x-1">
                                        <span className="font-semibold text-[15px]">
                                            {post.user.name}
                                        </span>
                                        <span>
                                            <span className="text-sm text-gray-500">
                                                @{post.user.user_id}
                                            </span>
                                            <span className="text-sm text-gray-500 px-1">
                                                ·
                                            </span>
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            post.created_at,
                                        ).toLocaleDateString('ja-JP')}
                                    </span>
                                    <div className="ml-auto">
                                        {auth.user.id === post.user_id && (
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(
                                                            openMenuId ===
                                                                post.id
                                                                ? null
                                                                : post.id,
                                                        );
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                                                >
                                                    <Ellipsis size={18} />
                                                </button>
                                                {openMenuId === post.id && (
                                                    <div className="absolute right-0 bg-white shadow-md rounded-lg top-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Are you sure you want to delete this post?',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route(
                                                                            'posts.destroy',
                                                                            post.id,
                                                                        ),
                                                                    );
                                                                }
                                                                setOpenMenuId(
                                                                    null,
                                                                );
                                                            }}
                                                            className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left cursor-pointer flex items-center gap-x-2"
                                                        >
                                                            <Trash2 size={16} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p>{post.text}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </InfiniteScroll>

            {/* フローティング投稿ボタン */}
            <button
                onClick={() => {
                    if (auth.user) {
                        setShowModal(true);
                    } else {
                        router.visit('/login');
                    }
                }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-3xl shadow-lg cursor-pointer transition-colors flex items-center justify-center"
                aria-label="New Post"
            >
                <Plus size={24} />
            </button>

            <CreatePostModal
                show={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

Index.layout = Layout;

export default Index;
