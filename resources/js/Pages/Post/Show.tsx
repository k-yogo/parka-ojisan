import CommentSection from '@/Components/CommentSection';
import PostCard from '@/Components/PostCard';
import Layout from '@/Layouts/Layout';
import { Post, Comment, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Show = ({
    post,
    initialComments,
}: {
    post: Post;
    initialComments: PaginatedData<Comment>;
}) => {
    const { auth } = usePage().props;
    const [focusComment, setFocusComment] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments_count);

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return (
        <>
            <Head title={`${post.user.name}さん:「${post.text}」`} />
            <div className="flex items-center gap-x-4 px-4 sm:px-3 py-3">
                <button
                    onClick={handleBack}
                    className="text-gray-950 hover:text-gray-600 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <span>投稿</span>
            </div>
            <ul>
                <PostCard
                    post={post}
                    onDelete={() => router.visit('/')}
                    onCommentClick={() => setFocusComment(true)}
                    commentsCountOverride={commentsCount}
                    showFullDate
                    disableLink
                />
            </ul>
            <CommentSection
                postId={post.id}
                initialComments={initialComments}
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
