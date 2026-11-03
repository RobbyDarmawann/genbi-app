import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <img
                src="/logo-genbi.svg"
                alt="Logo GenBI Gorontalo"
                className="h-9 w-auto shrink-0"
            />
            <div className="ml-1 grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
            </div>
        </>
    );
}
