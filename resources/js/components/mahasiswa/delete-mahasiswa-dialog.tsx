import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import MahasiswaController from '@/actions/App/Http/Controllers/Admin/MahasiswaController';
import InputError from '@/components/input-error';
import type { MahasiswaRow } from '@/components/mahasiswa/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const DELETE_BLOCKED_REASON =
    'Tidak dapat dihapus karena memiliki riwayat kegiatan';

export function DeleteMahasiswaDialog({ row }: { row: MahasiswaRow }) {
    const [open, setOpen] = useState(false);

    if (row.terikat) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        tabIndex={0}
                        title={DELETE_BLOCKED_REASON}
                        aria-label={`Hapus (${DELETE_BLOCKED_REASON})`}
                        className="inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled
                            className="pointer-events-none h-11 md:h-8"
                        >
                            <Trash2 className="size-3.5" />
                            <span>Hapus</span>
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>{DELETE_BLOCKED_REASON}</TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-11 md:h-8">
                    <Trash2 className="size-3.5" />
                    <span>Hapus</span>
                </Button>
            </DialogTrigger>
            <DialogContent role="alertdialog">
                <DialogHeader>
                    <DialogTitle>Hapus akun anggota?</DialogTitle>
                    <DialogDescription>
                        Akun login <strong>@{row.username}</strong> dan data
                        anggota <strong>{row.name}</strong> ({row.nim}) akan
                        dihapus permanen karena belum memiliki riwayat kegiatan
                        maupun poin.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...MahasiswaController.destroy.form(row.id)}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <InputError
                                message={
                                    (errors as Record<string, string>).delete
                                }
                            />
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-11 md:h-9"
                                    >
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 md:h-9"
                                >
                                    {processing && <Spinner />}
                                    <span>Hapus Anggota</span>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
