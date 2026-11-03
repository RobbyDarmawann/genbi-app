import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            toast?: {
                type: 'success' | 'info' | 'warning' | 'error';
                message: string;
            }[];
            [key: string]: unknown;
        };
    }
}
