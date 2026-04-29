import CommentSection from '@/Components/CommentSection';
import PostCard from '@/Components/PostCard';
import Layout from '@/Layouts/Layout';
import { Post } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const Show = ({ post }: { post: Post }) => {
    const { auth } = usePage().props;
    const [focusComment, setFocusComment] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments_count);

    return (
        <>
            <Head title={`${post.user.name}さん:「${post.text}」`} />
            <ul>
                <PostCard
                    post={post}
                    onDelete={() => router.visit('/')}
                    onCommentClick={() => setFocusComment(true)}
                    commentsCountOverride={commentsCount}
                    showFullDate
                />
            </ul>
            <CommentSection
                postId={post.id}
                auth={auth.user}
                focusComment={focusComment}
                onFocused={() => setFocusComment(false)}
                onCommentAdded={() => setCommentsCount((c) => c + 1)}
                onCommentDeleted={() => setCommentsCount((c) => c - 1)}
            />
        </>
    );
};

Show.layout = Layout;

export default Show;
