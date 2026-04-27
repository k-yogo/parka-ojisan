import PostCard from '@/Components/PostCard';
import { Post } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function PostList({ userId }: { userId?: number }) {
    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['posts', userId],
        queryFn: ({ pageParam = 1 }) => {
            const url = userId
                ? `/api/posts?page=${pageParam}&user_id=${userId}`
                : `/api/posts?page=${pageParam}`;
            return fetch(url).then((res) => res.json());
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
                <PostCard key={post.id} post={post} />
            ))}
            <div ref={bottomRef} />
        </ul>
    );
}
