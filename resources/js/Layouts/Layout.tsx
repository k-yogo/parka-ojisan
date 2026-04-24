import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(false);
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuOpen]);

    const { flash } = usePage();

    useEffect(() => {
        if (flash.success) {
            const timer = setTimeout(() => router.flash(() => ({})), 3550);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    return (
        <>
            <div className="flex flex-col min-h-dvh text-gray-950 bg-white">
                {flash.success && (
                    <div
                        className="fixed top-2 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                        style={{
                            animation:
                                'flash-notification 3.5s ease-in-out 0.05s both',
                        }}
                    >
                        {flash.success}
                    </div>
                )}
                <header className="px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10 border-b border-gray-200">
                    <h1>
                        <Link
                            href={route('posts.index')}
                            className="hover:opacity-70 transition-opacity"
                            aria-label="Home"
                        >
                            パーカーおじさん
                        </Link>
                    </h1>
                    <div className="relative leading-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            {auth.user?.icon_path ? (
                                <img
                                    src={`/storage/${auth.user.icon_path}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
                            )}
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-3 text-sm hover:bg-gray-50"
                                        >
                                            会員情報
                                        </Link>
                                        <Link
                                            href={`/${auth.user.user_id}`}
                                            className="block px-4 py-3 text-sm hover:bg-gray-50"
                                        >
                                            プロフィール
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(route('logout'))
                                            }
                                            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
                                        >
                                            ログアウト
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="block px-4 py-3 text-sm hover:bg-gray-50"
                                        >
                                            ログイン
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="block px-4 py-3 text-sm hover:bg-gray-50"
                                        >
                                            登録
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </header>
                <main className="w-full max-w-md mx-auto flex-1 flex flex-col pb-8">
                    {children}
                </main>
                <footer className="p-4 text-center text-sm text-gray-600 border-t border-gray-200 bg-white">
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="https://github.com/k-yogo/parka-ojisan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            aria-label="GitHub Repository"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <p>
                            &copy; {new Date().getFullYear()} パーカーおじさん
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
