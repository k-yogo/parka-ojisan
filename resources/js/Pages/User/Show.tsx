import Layout from '@/Layouts/Layout';
import PostList from '@/Components/PostList';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const Show = ({ user }: { user: User }) => {
    const [postsCount, setPostsCount] = useState(user.posts_count ?? 0);

    const handleBack = () => {
        const referrer = document.referrer;
        const isFromSameOrigin = referrer && new URL(referrer).origin === window.location.origin;

        if (window.history.length > 1 && isFromSameOrigin) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return (
        <>
            <Head title={`${user.name}（@${user.user_id}）さん`} />

            <div className="flex items-center gap-x-4 px-4 py-3 sm:px-3">
                <button onClick={handleBack} className="cursor-pointer text-gray-900 transition-colors hover:text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <span className="">{user.name}</span>
                    <span className="text-xs text-gray-500">{postsCount.toLocaleString()} 件の投稿</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-y-3 py-8">
                {user.icon_path ? (
                    <img src={`/storage/${user.icon_path}`} alt="" className="h-24 w-24 rounded-full object-cover" />
                ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200" />
                )}
                <div className="flex items-center gap-x-2">
                    <p className="text-lg font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.user_id}</p>
                </div>
            </div>

            <PostList userId={user.id} onDelete={() => setPostsCount((c) => c - 1)} />
        </>
    );
};

Show.layout = Layout;

export default Show;
