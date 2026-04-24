import PostCard from '@/Components/PostCard';
import Layout from '@/Layouts/Layout';
import { Post } from '@/types';

const Show = ({ post }: { post: Post }) => {
    return (
        <ul>
            <PostCard post={post} />
        </ul>
    );
};

Show.layout = Layout;

export default Show;
