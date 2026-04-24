import PostCard from '@/Components/PostCard';
import Layout from '@/Layouts/Layout';
import { Post } from '@/types';
import { Head } from '@inertiajs/react';

const Show = ({ post }: { post: Post }) => {
    return (
        <>
            <Head title={`${post.user.name}さんの投稿`} />

            <ul>
                <PostCard post={post} />
            </ul>
        </>
    );
};

Show.layout = Layout;

export default Show;
