import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    ClipboardCheck,
    ClipboardList,
    FileText,
    FolderTree,
    LayoutGrid,
    Settings2,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import mahasiswa from '@/routes/mahasiswa';
import type { NavItem } from '@/types';

const internalNavigation: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Kegiatan', href: admin.kegiatan.index(), icon: CalendarDays },
    { title: 'Anggota', href: admin.mahasiswa.index(), icon: Users },
    { title: 'Master Data', href: admin.komsat.index(), icon: FolderTree },
    { title: 'Kehadiran', href: admin.kehadiran.index(), icon: ClipboardCheck },
    { title: 'Koreksi', href: admin.koreksi.index(), icon: ShieldCheck },
    { title: 'Laporan', href: admin.rekap.index(), icon: BarChart3 },
    {
        title: 'Kepengurusan',
        href: admin.kepengurusan.index(),
        icon: Settings2,
    },
];

const mahasiswaNavigation: NavItem[] = [
    { title: 'Dashboard', href: mahasiswa.dashboard(), icon: LayoutGrid },
    {
        title: 'Kegiatan Saya',
        href: mahasiswa.kegiatan.index(),
        icon: CalendarDays,
    },
    {
        title: 'Riwayat Kehadiran',
        href: mahasiswa.kehadiran.index(),
        icon: ClipboardCheck,
    },
    { title: 'Poin Saya', href: mahasiswa.poin.riwayat(), icon: BarChart3 },
    { title: 'Koreksi', href: mahasiswa.koreksi.index(), icon: ClipboardList },
    {
        title: 'Kepengurusan',
        href: mahasiswa.kepengurusan.index(),
        icon: FileText,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const items = auth.user?.roles.includes('internal_manajemen')
        ? internalNavigation
        : mahasiswaNavigation;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
