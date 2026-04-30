import Layout from '@/Layouts/Layout';
import PostList from '@/Components/PostList';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const Show = ({ user }: { user: User }) => {
    const [postsCount, setPostsCount] = useState(user.posts_count ?? 0);

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return (
        <>
            <Head title={`${user.name}（@${user.user_id}）さん`} />

            <div className="flex items-center gap-x-4 px-4 sm:px-3 py-3">
                <button
                    onClick={handleBack}
                    className="text-gray-900 hover:text-gray-600 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <span className="">{user.name}</span>
                    <span className="text-xs text-gray-500">{postsCount.toLocaleString()} 件の投稿</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-y-3 py-8">
                {user.icon_path ? (
                    <img
                        src={`/storage/${user.icon_path}`}
                        alt=""
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200" />
                )}
                <div className="flex items-center gap-x-2">
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-gray-500 text-sm">@{user.user_id}</p>
                </div>
            </div>

            <PostList userId={user.id} onDelete={() => setPostsCount((c) => c - 1)} />
        </>
    );
};

Show.layout = Layout;

export default Show;
