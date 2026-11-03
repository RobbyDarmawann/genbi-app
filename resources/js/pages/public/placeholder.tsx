import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

type Props = { module: string; description?: string };

export default function PublicPlaceholder({ module, description }: Props) {
    return (
        <>
            <Head title={module} />
            <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col justify-center gap-4 px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-sm font-medium text-primary">
                    GenBI Gorontalo
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {module}
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                    {description ??
                        `Halaman ${module.toLowerCase()} untuk pengunjung publik GenBI Gorontalo.`}
                </p>
                <div className="mt-4 rounded-lg border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                    Modul {module} akan tersedia pada fase implementasi
                    berikutnya.
                </div>
            </section>
        </>
    );
}

PublicPlaceholder.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);
