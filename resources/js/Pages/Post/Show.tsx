import PostCard from '@/Components/PostCard';
import Layout from '@/Layouts/Layout';
import { Post } from '@/types';
import { Head, router } from '@inertiajs/react';

const Show = ({ post }: { post: Post }) => {
    return (
        <>
            <Head title={`${post.user.name}さん:「${post.text}」`} />

            <ul>
                <PostCard post={post} onDelete={() => router.visit('/')} />
            </ul>
        </>
    );
};

Show.layout = Layout;

export default Show;
