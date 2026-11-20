import { router } from '@inertiajs/react';
import { Calendar, CheckCircle2, ShieldAlert, Tag, Users } from 'lucide-react';
import { useState } from 'react';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatAngka, formatRentangTanggalWita } from '@/lib/format';

export type KegiatanTerbitkanSummary = {
    id: number;
    judul: string;
    tanggal: string;
    tanggal_selesai?: string | null;
    sesi_count?: number;
    divisi_target_count: number;
    kuota: number | null;
    bobot_peserta: number | null;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kegiatan: KegiatanTerbitkanSummary | null;
};

export function DialogTerbitkanKegiatan({
    open,
    onOpenChange,
    kegiatan,
}: Props) {
    const [submitting, setSubmitting] = useState(false);

    if (!kegiatan) {
        return null;
    }

    const tanggalSelesai = kegiatan.tanggal_selesai || kegiatan.tanggal;
    const rentangTanggal = formatRentangTanggalWita(
        kegiatan.tanggal,
        tanggalSelesai,
    );
    const sesiText =
        kegiatan.sesi_count && kegiatan.sesi_count > 0
            ? `${kegiatan.sesi_count} sesi absensi`
            : null;

    const hasDivisiTarget = kegiatan.divisi_target_count > 0;
    const hasBobotPeserta =
        kegiatan.bobot_peserta !== null && kegiatan.bobot_peserta !== undefined;
    const isSiapTerbit = hasDivisiTarget && hasBobotPeserta;

    const handleTerbitkan = () => {
        if (!isSiapTerbit || submitting) {
            return;
        }

        setSubmitting(true);
        router.patch(
            AdminKegiatanController.updateStatus(kegiatan.id).url,
            { status: 'terbit' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Penerbitan Kegiatan</DialogTitle>
                    <DialogDescription>
                        Periksa kembali ringkasan parameter kegiatan sebelum
                        diterbitkan ke mahasiswa.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 text-sm">
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                        <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            Judul Kegiatan
                        </div>
                        <div className="text-base leading-snug font-semibold text-foreground">
                            {kegiatan.judul}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                                <div className="text-xs text-muted-foreground">
                                    Waktu Pelaksanaan
                                </div>
                                <div className="text-xs font-medium text-foreground sm:text-sm">
                                    {rentangTanggal}
                                </div>
                                {sesiText && (
                                    <div className="text-xs text-muted-foreground">
                                        {sesiText}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Users className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                                <div className="text-xs text-muted-foreground">
                                    Batas Kuota
                                </div>
                                <div className="text-xs font-medium text-foreground sm:text-sm">
                                    {kegiatan.kuota !== null &&
                                    kegiatan.kuota > 0
                                        ? `${formatAngka(kegiatan.kuota)} peserta`
                                        : 'Tanpa batasan kuota'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Tag className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                                <div className="text-xs text-muted-foreground">
                                    Divisi Target
                                </div>
                                <div
                                    className={`text-xs font-medium sm:text-sm ${
                                        hasDivisiTarget
                                            ? 'text-foreground'
                                            : 'font-semibold text-destructive'
                                    }`}
                                >
                                    {hasDivisiTarget
                                        ? `${kegiatan.divisi_target_count} divisi dipilih`
                                        : 'Belum ada divisi target'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                                <div className="text-xs text-muted-foreground">
                                    Bobot Poin Peserta
                                </div>
                                <div
                                    className={`text-xs font-medium sm:text-sm ${
                                        hasBobotPeserta
                                            ? 'text-foreground'
                                            : 'font-semibold text-destructive'
                                    }`}
                                >
                                    {hasBobotPeserta
                                        ? `${kegiatan.bobot_peserta} poin`
                                        : 'Belum diatur'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isSiapTerbit && (
                        <Alert variant="destructive">
                            <ShieldAlert className="size-4" />
                            <AlertTitle>
                                Syarat Terbit Belum Terpenuhi
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                Kegiatan memerlukan minimal 1 divisi target dan
                                bobot poin untuk peran peserta sebelum dapat
                                diterbitkan. Silakan lengkapi melalui formulir
                                edit.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="h-11 md:h-9"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleTerbitkan}
                        disabled={!isSiapTerbit || submitting}
                        className="h-11 md:h-9"
                    >
                        {submitting
                            ? 'Menerbitkan...'
                            : 'Ya, Terbitkan Kegiatan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
