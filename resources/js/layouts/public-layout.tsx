import { Link, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Facebook,
    Instagram,
    LayoutDashboard,
    LogIn,
    Music2,
    Youtube,
} from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useHeaderVisibility } from '@/hooks/use-header-visibility';
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

const instagramLinks = [
    {
        name: 'GenBI Gorontalo',
        handle: '@genbi_gto',
        href: 'https://www.instagram.com/genbi_gto',
    },
    {
        name: 'GenBI UNG',
        handle: '@genbi.ung',
        href: 'https://www.instagram.com/genbi.ung',
    },
    {
        name: 'GenBI Komsat IAIN',
        handle: '@genbi_komsat_iainsag',
        href: 'https://www.instagram.com/genbi_komsat_iainsag',
    },
    {
        name: 'GenBI UG',
        handle: '@genbi.ug',
        href: 'https://www.instagram.com/genbi.ug',
    },
];

const otherSocialLinks = [
    {
        platform: 'YouTube',
        label: 'GenBI Gorontalo',
        href: 'https://www.youtube.com/channel/UCmbg73Fa670EzYn3amz2UBw',
        icon: Youtube,
    },
    {
        platform: 'Facebook',
        label: 'GenBI Gorontalo',
        href: 'https://www.facebook.com/genbi.gorontalo.1',
        icon: Facebook,
    },
    {
        platform: 'TikTok',
        label: '@genbi_gorontalo',
        href: 'https://www.tiktok.com/@genbi_gorontalo',
        icon: Music2,
    },
];

type PublicLayoutProps = {
    children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage().props;
    const [logoError, setLogoError] = useState(false);
    const currentYear = new Date().getFullYear();
    const headerRef = useRef<HTMLElement>(null);
    const { isVisible } = useHeaderVisibility({ headerRef });

    const dashboardHref = auth.user?.roles.includes('internal_manajemen')
        ? admin.dashboard()
        : auth.user?.roles.includes('mahasiswa')
          ? mahasiswa.dashboard()
          : dashboard();

    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <header
                ref={headerRef}
                className={`sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-transform duration-300 supports-[backdrop-filter]:bg-background/80 motion-reduce:transition-none ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={home()}
                        className="flex min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        aria-label="GenBI Gorontalo - Beranda"
                    >
                        {!logoError ? (
                            <img
                                src="/logo-genbi.svg"
                                alt="Logo GenBI Gorontalo"
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
                                className={`rounded-md px-3.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isCurrentUrl(item.href) ? 'bg-primary/10 font-semibold text-primary' : 'font-medium text-muted-foreground'}`}
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
                            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 md:h-9"
                        >
                            <LayoutDashboard className="size-4" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 md:h-9"
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
                            className={`inline-flex h-11 shrink-0 items-center rounded-md px-3.5 text-sm transition-colors ${isCurrentUrl(item.href) ? 'bg-primary/10 font-semibold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}
                            aria-current={
                                isCurrentUrl(item.href) ? 'page' : undefined
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t-4 border-destructive bg-[oklch(0.24_0.11_262)] text-white">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-4">
                            <h2 className="sr-only">Tentang</h2>
                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 shadow-xs">
                                    <img
                                        src="/logo-genbi.svg"
                                        alt="Logo GenBI Gorontalo"
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold tracking-tight text-white">
                                        GenBI Gorontalo
                                    </p>
                                    <p className="text-xs text-white/75">
                                        Energi Untuk Negeri
                                    </p>
                                </div>
                            </div>
                            <p className="max-w-md text-sm leading-relaxed text-white/85">
                                Generasi Baru Indonesia (GenBI) merupakan
                                komunitas yang terdiri dari mahasiswa/i penerima
                                beasiswa Bank Indonesia yang berada di bawah
                                naungan Bank Indonesia, yang tersebar di seluruh
                                wilayah Indonesia. GenBI Gorontalo adalah salah
                                satu struktur kepengurusan GenBI di tingkat
                                wilayah.
                            </p>
                        </div>

                        <div className="space-y-3 lg:col-span-2">
                            <h2 className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                Jelajahi
                            </h2>
                            <ul className="space-y-2 text-sm">
                                {navigation.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="inline-flex items-center text-white/85 transition-colors hover:text-white hover:underline"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center text-white/85 transition-colors hover:text-white hover:underline"
                                    >
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3 lg:col-span-3">
                            <h2 className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                Instagram
                            </h2>
                            <ul className="space-y-2.5 text-sm">
                                {instagramLinks.map((acc) => (
                                    <li key={acc.handle}>
                                        <a
                                            href={acc.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white hover:underline"
                                        >
                                            <Instagram className="size-4 shrink-0 text-white/70" />
                                            <span>
                                                <span className="font-medium text-white">
                                                    {acc.name}
                                                </span>{' '}
                                                <span className="text-white/80">
                                                    {acc.handle}
                                                </span>
                                            </span>
                                            <ExternalLink
                                                className="size-3 shrink-0 text-white/50"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3 lg:col-span-3">
                            <h2 className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                Media Sosial Lainnya
                            </h2>
                            <ul className="space-y-2.5 text-sm">
                                {otherSocialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <li key={social.platform}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2.5 text-white/85 transition-colors hover:text-white hover:underline"
                                            >
                                                <Icon className="size-4 shrink-0 text-white/70" />
                                                <span>
                                                    <span className="font-medium text-white">
                                                        {social.platform}:
                                                    </span>{' '}
                                                    {social.label}
                                                </span>
                                                <ExternalLink
                                                    className="size-3 shrink-0 text-white/50"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
                        <p>© {currentYear} GenBI Gorontalo</p>
                        <p>
                            Scoring System — Sistem penilaian penerima Beasiswa
                            Bank Indonesia
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
