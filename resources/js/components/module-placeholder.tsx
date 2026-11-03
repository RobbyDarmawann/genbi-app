import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

type Props = {
    module: string;
    audience: string;
};

export default function ModulePlaceholder({ module, audience }: Props) {
    return (
        <>
            <Head title={module} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header>
                    <p className="text-sm font-medium text-primary">
                        {audience}
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {module}
                    </h1>
                </header>
                <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center md:p-12">
                    <Construction
                        className="mb-3 size-8 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <h2 className="font-medium">Modul {module}</h2>
                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Modul ini belum tersedia dan akan dibangun pada fase
                        implementasi berikutnya.
                    </p>
                </div>
            </div>
        </>
    );
}
