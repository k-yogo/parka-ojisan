import CreatePostModal from "@/Components/CreatePostModal";
import Layout from "@/Layouts/Layout";
import { PaginatedData, Post } from "@/types";
import { InfiniteScroll, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";

const Index = ({ posts }: { posts: PaginatedData<Post> }) => {
    const { flash } = usePage();
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {flash.success && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    ✅ {flash.success}
                </div>
            )}
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

            {/* フローティング投稿ボタン */}
            <button
                onClick={() => {
                    if (auth.user) {
                        setShowModal(true);
                    } else {
                        router.visit("/login");
                    }
                }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-3xl shadow-lg cursor-pointer transition-colors flex items-center justify-center"
                aria-label="New Post"
            >
                <Plus size={24} />
            </button>

            <CreatePostModal
                show={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

Index.layout = Layout;

export default Index;
