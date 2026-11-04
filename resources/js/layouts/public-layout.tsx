import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard, home, login } from '@/routes';
import admin from '@/routes/admin';
import mahasiswa from '@/routes/mahasiswa';
import { jadwal, kepengurusan, statistik } from '@/routes/public';

const navigation = [
    { label: 'Beranda', href: home() },
    { label: 'Aktivitas', href: jadwal() },
    { label: 'Statistik', href: statistik() },
    { label: 'Kepengurusan', href: kepengurusan() },
];

type PublicLayoutProps = {
    children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage().props;
    const [logoError, setLogoError] = useState(false);

    const dashboardHref = auth.user?.roles.includes('internal_manajemen')
        ? admin.dashboard()
        : auth.user?.roles.includes('mahasiswa')
          ? mahasiswa.dashboard()
          : dashboard();

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={home()}
                        className="flex min-w-0 items-center gap-3"
                        aria-label="GenBI Gorontalo - Beranda"
                    >
                        {!logoError ? (
                            <img
                                src="/logo-genbi.svg"
                                alt="GenBI Gorontalo"
                                className="h-10 w-auto shrink-0"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <span className="text-base font-semibold tracking-tight text-foreground">
                                GenBI Gorontalo
                            </span>
                        )}
                        <span className="hidden border-l pl-3 text-sm leading-tight font-semibold sm:block">
                            Sistem Informasi
                            <br />
                            GenBI Gorontalo
                        </span>
                    </Link>
                    <nav
                        className="hidden items-center gap-1 md:flex"
                        aria-label="Navigasi utama"
                    >
                        {navigation.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isCurrentUrl(item.href) ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'}`}
                                aria-current={
                                    isCurrentUrl(item.href) ? 'page' : undefined
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    {auth.user ? (
                        <Link
                            href={dashboardHref}
                            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:h-9"
                        >
                            <LayoutDashboard className="size-4" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:h-9"
                        >
                            <LogIn className="size-4" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
                <nav
                    className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden"
                    aria-label="Navigasi mobile"
                >
                    {navigation.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm ${isCurrentUrl(item.href) ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>
            <main>{children}</main>
            <footer className="border-t bg-muted/30">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p className="font-medium text-foreground">
                        Sistem Informasi GenBI Gorontalo
                    </p>
                    <p>
                        Informasi kegiatan, statistik, dan kepengurusan GenBI
                        Gorontalo.
                    </p>
                </div>
            </footer>
        </div>
    );
}
