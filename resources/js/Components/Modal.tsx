import { PropsWithChildren, useEffect } from "react";

export default function Modal({
    children,
    show = false,
    className = "max-w-2xl",
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    show: boolean;
    className?: string;
    closeable?: boolean;
    onClose: CallableFunction;
}>) {
    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-gray-500/75"
                onClick={() => closeable && onClose()}
            />
            <div className="flex min-h-full items-center justify-center px-4 py-6">
                <div className={`relative z-10 w-full ${className} rounded-lg bg-white shadow-xl`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
