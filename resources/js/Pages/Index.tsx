import Layout from "@/Layouts/Layout";
import { PageProps, PaginatedData, Post } from "@/types";
import { InfiniteScroll, usePage } from "@inertiajs/react";

const Index = ({ posts }: { posts: PaginatedData<Post> }) => {
    const { flash } = usePage<PageProps>().props;

    return (
        <>
            {flash.success && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    ✅ {flash.success}
                </div>
            )}
            <InfiniteScroll data="posts" as="ul" className="flex flex-col gap-y-4" preserveUrl>
                {posts.data.map((post) => (
                    <li key={post.id}>
                        <img
                            src={`/storage/${post.image}`}
                            alt=""
                            className="w-full"
                            width={post.width}
                            height={post.height}
                        />
                        <div className="p-4 sm:py-4 sm:px-2 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                {post.email ? (
                                    <a
                                        href={`mailto:${post.email}`}
                                        className="text-blue-500 underline hover:no-underline"
                                    >
                                        {post.name ?? "no name"}
                                    </a>
                                ) : (
                                    <span>{post.name ?? "no name"}</span>
                                )}
                                <span className="text-sm text-gray-500">
                                    {new Date(
                                        post.created_at,
                                    ).toLocaleDateString("ja-JP")}
                                </span>
                            </div>
                            <p>{post.text}</p>
                        </div>
                    </li>
                ))}
            </InfiniteScroll>
        </>
    );
}

Index.layout = Layout

export default Index
