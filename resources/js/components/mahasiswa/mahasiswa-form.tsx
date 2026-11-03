import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import MahasiswaController from '@/actions/App/Http/Controllers/Admin/MahasiswaController';
import InputError from '@/components/input-error';
import type {
    DivisiOption,
    KomsatOption,
    MahasiswaRow,
    StatusPenerimaOption,
} from '@/components/mahasiswa/types';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import admin from '@/routes/admin';

type Props = {
    record?: MahasiswaRow;
    komsatOptions: KomsatOption[];
    divisiOptions: DivisiOption[];
    statusPenerimaOptions: StatusPenerimaOption[];
    cancelHref?: string;
};

export function MahasiswaForm({
    record,
    komsatOptions,
    divisiOptions,
    statusPenerimaOptions,
    cancelHref,
}: Props) {
    const isEdit = Boolean(record);
    const [komsatId, setKomsatId] = useState<string>(
        record ? String(record.komsat_id) : '',
    );
    const [divisiId, setDivisiId] = useState<string>(
        record ? String(record.divisi_id) : '',
    );
    const [statusPenerima, setStatusPenerima] = useState<string>(
        record?.status_penerima ?? 'penerima',
    );
    const [aktif, setAktif] = useState<string>(
        record ? (record.aktif ? '1' : '0') : '1',
    );

    const availableDivisi = divisiOptions.filter(
        (d) =>
            String(d.komsat_id) === komsatId &&
            (d.aktif || (record !== undefined && d.id === record.divisi_id)),
    );

    const handleKomsatChange = (nextKomsatId: string) => {
        setKomsatId(nextKomsatId);

        const stillValid = divisiOptions.some(
            (d) =>
                String(d.id) === divisiId &&
                String(d.komsat_id) === nextKomsatId &&
                (d.aktif ||
                    (record !== undefined && d.id === record.divisi_id)),
        );

        if (!stillValid) {
            setDivisiId('');
        }
    };

    const endpoint = record
        ? MahasiswaController.update.form(record.id)
        : MahasiswaController.store.form();

    return (
        <Form
            {...endpoint}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                autoComplete="off"
                                defaultValue={record?.name ?? ''}
                                placeholder="Contoh: Siti Rahmawati"
                                className="h-11 md:h-9"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username login</Label>
                            <Input
                                id="username"
                                name="username"
                                required
                                autoComplete="off"
                                defaultValue={record?.username ?? ''}
                                placeholder="Contoh: siti_ung24"
                                className="h-11 md:h-9"
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nim">NIM</Label>
                            <Input
                                id="nim"
                                name="nim"
                                required
                                inputMode="numeric"
                                autoComplete="off"
                                defaultValue={record?.nim ?? ''}
                                placeholder="Nomor Induk Mahasiswa"
                                className="h-11 md:h-9"
                            />
                            <InputError message={errors.nim} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="angkatan">Tahun angkatan</Label>
                            <Input
                                id="angkatan"
                                name="angkatan"
                                required
                                maxLength={4}
                                inputMode="numeric"
                                autoComplete="off"
                                defaultValue={
                                    record?.angkatan ??
                                    String(new Date().getFullYear())
                                }
                                placeholder="Contoh: 2024"
                                className="h-11 md:h-9"
                            />
                            <InputError message={errors.angkatan} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="komsat_id">Komisariat</Label>
                            <input
                                type="hidden"
                                name="komsat_id"
                                value={komsatId}
                            />
                            <Select
                                value={komsatId || undefined}
                                onValueChange={handleKomsatChange}
                            >
                                <SelectTrigger
                                    id="komsat_id"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Pilih komisariat" />
                                </SelectTrigger>
                                <SelectContent>
                                    {komsatOptions.map((option) => (
                                        <SelectItem
                                            key={option.id}
                                            value={String(option.id)}
                                        >
                                            {option.kode} — {option.nama}
                                            {!option.aktif ? ' (Nonaktif)' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.komsat_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="divisi_id">Divisi</Label>
                            <input
                                type="hidden"
                                name="divisi_id"
                                value={divisiId}
                            />
                            <Select
                                value={divisiId || undefined}
                                onValueChange={setDivisiId}
                                disabled={!komsatId}
                            >
                                <SelectTrigger
                                    id="divisi_id"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue
                                        placeholder={
                                            komsatId
                                                ? availableDivisi.length > 0
                                                    ? 'Pilih divisi aktif'
                                                    : 'Belum ada divisi aktif'
                                                : 'Pilih komisariat terlebih dahulu'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDivisi.map((option) => (
                                        <SelectItem
                                            key={option.id}
                                            value={String(option.id)}
                                        >
                                            {option.nama}
                                            {!option.aktif ? ' (Nonaktif)' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.divisi_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status_penerima">
                                Status penerima beasiswa
                            </Label>
                            <input
                                type="hidden"
                                name="status_penerima"
                                value={statusPenerima}
                            />
                            <Select
                                value={statusPenerima}
                                onValueChange={setStatusPenerima}
                            >
                                <SelectTrigger
                                    id="status_penerima"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Pilih status penerima" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusPenerimaOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status_penerima} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="aktif">Status akun</Label>
                            <input type="hidden" name="aktif" value={aktif} />
                            <Select value={aktif} onValueChange={setAktif}>
                                <SelectTrigger
                                    id="aktif"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Aktif (dapat login & absensi)
                                    </SelectItem>
                                    <SelectItem value="0">
                                        Nonaktif (akses login ditutup)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.aktif} />
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password awal</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    className="h-11 md:h-9"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi password awal
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Ulangi password awal"
                                    className="h-11 md:h-9"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="h-11 md:h-9"
                        >
                            <Link
                                href={cancelHref ?? admin.mahasiswa.index().url}
                            >
                                Batal
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 md:h-9"
                        >
                            {processing && <Spinner />}
                            <span>
                                {isEdit
                                    ? 'Simpan Perubahan'
                                    : 'Buat Akun Anggota'}
                            </span>
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
