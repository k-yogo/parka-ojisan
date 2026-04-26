export interface Post {
    id: number;
    image: string;
    width: number;
    height: number;
    file_size: number;
    name: string | null;
    email: string | null;
    text: string;
    created_at: string;
    updated_at: string;
    user_id: number | null;
    user: User;
    likes_count: number;
    is_liked: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    user_id: string;
    icon_path: string | null;
}

declare module '@inertiajs/core' {
    interface InertiaConfig {
        flashDataType: {
            success?: string | null;
        };
    }
    interface SharedPageProps {
        auth: {
            user: User;
        };
    }
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: { user: User };
};
