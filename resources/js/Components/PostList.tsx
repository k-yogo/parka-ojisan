import PostCard from '@/Components/PostCard';
import { PaginatedData, Post } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';

export default function PostList({ posts }: { posts: PaginatedData<Post> }) {
    return (
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
                <PostCard key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
}
