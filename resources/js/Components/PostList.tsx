import PostCard from '@/Components/PostCard';
import { Post } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function PostList({ userId, onDelete }: { userId?: number; onDelete?: () => void }) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['posts', userId],
            queryFn: ({ pageParam = 1 }) => {
                const url = userId
                    ? `/api/posts?page=${pageParam}&user_id=${userId}`
                    : `/api/posts?page=${pageParam}`;
                return new Promise<any>((resolve) =>
                    setTimeout(
                        () =>
                            fetch(url)
                                .then((res) => res.json())
                                .then(resolve),
                        0,
                    ),
                );
            },

            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                if (lastPage.links.next) {
                    return lastPage.meta.current_page + 1;
                }
                return undefined;
            },
        });

    const posts = data?.pages.flatMap((page) => page.data) ?? [];

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    return (
        <ul className="flex flex-col gap-y-4">
            {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} onDelete={onDelete} />
            ))}
            {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                    <div className="w-7 h-7 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
            )}
            <div ref={bottomRef} />
        </ul>
    );
}
