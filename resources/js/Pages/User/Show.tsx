import Layout from '@/Layouts/Layout';
import PostList from '@/Components/PostList';
import { User } from '@/types';
import { Head } from '@inertiajs/react';

const Show = ({ user }: { user: User }) => {
    return (
        <>
            <Head title={`${user.name}（@${user.user_id}）さん`} />

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

            <PostList userId={user.id} />
        </>
    );
};

Show.layout = Layout;

export default Show;
