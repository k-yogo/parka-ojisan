import CreatePostModal from '@/Components/CreatePostModal';
import PostList from '@/Components/PostList';
import Layout from '@/Layouts/Layout';
import { PaginatedData, Post } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Index = ({ posts }: { posts: PaginatedData<Post> }) => {
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <PostList posts={posts} />

            <button
                onClick={() => {
                    if (auth.user) {
                        setShowModal(true);
                    } else {
                        router.visit('/login');
                    }
                }}
                className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 w-14 h-14 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-3xl shadow-lg cursor-pointer transition-colors flex items-center justify-center"
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
