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
}

declare module '@inertiajs/core' {
    interface SharedPageProps {
        auth: {
            user: User;
        };
        flash: {
            success: string | null;
        };
    }
}
