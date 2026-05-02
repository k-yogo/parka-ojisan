import { router } from '@inertiajs/react';

export const useHandleBack = () => {
    const handleBack = () => {
        const stack = JSON.parse(sessionStorage.getItem('inAppNavStack') || '[]');

        if (stack.length > 0) {
            stack.pop();
            sessionStorage.setItem('inAppNavStack', JSON.stringify(stack));
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return handleBack;
};
