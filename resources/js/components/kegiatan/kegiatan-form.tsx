import { Form, Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import LeafletPicker from '@/components/kegiatan/leaflet-picker';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import InputError from '@/components/input-error';
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

type Option = { id: number; kode: string; nama: string };
type DivisiGroup = Option & { divisi: { id: number; nama: string }[] };
type Activity = {
    id: number;
    judul: string;
    deskripsi: string | null;
    komsat_id: number | null;
    lokasi_nama: string;
    latitude: string;
    longitude: string;
    radius_m: number;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    absensi_buka_at: string;
    absensi_tutup_at: string;
    pendaftaran_dibuka_at: string | null;
    batas_daftar_at: string | null;
    kuota: number | null;
    status: string;
    divisi_ids: number[];
    bobot: Record<string, number>;
};
type Props = {
    record?: Activity;
    komsatOptions: Option[];
    divisiGroups: DivisiGroup[];
    statusOptions: { value: string; label: string }[];
    peringatanKehadiran?: boolean;
    cancelHref: string;
};

export function KegiatanForm({
    record,
    komsatOptions,
    divisiGroups,
    statusOptions,
    peringatanKehadiran,
    cancelHref,
}: Props) {
    const [selectedDivisi, setSelectedDivisi] = useState<number[]>(
        record?.divisi_ids ?? [],
    );
    const [latitude, setLatitude] = useState<number>(
        record?.latitude ? parseFloat(String(record.latitude)) : 0.5435442,
    );
    const [longitude, setLongitude] = useState<number>(
        record?.longitude ? parseFloat(String(record.longitude)) : 123.0567972,
    );
    const [radius, setRadius] = useState<number>(record?.radius_m ?? 100);
    const locationLocked = Boolean(record && peringatanKehadiran);
    const endpoint = record
        ? AdminKegiatanController.update.form(record.id)
        : AdminKegiatanController.store.form();
    return (
        <Form
            {...endpoint}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ errors, processing }) => (
                <>
                    {peringatanKehadiran && (
                        <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                            <AlertTriangle
                                className="mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            />
                            <p>
                                Kegiatan telah memiliki kehadiran valid. Titik
                                lokasi, radius, dan bobot poin tidak dapat
                                diubah.
                            </p>
                        </div>
                    )}
                    <section className="grid gap-4 rounded-lg border p-4 sm:p-6">
                        <h2 className="text-lg font-semibold">
                            Informasi kegiatan
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field
                                label="Judul kegiatan"
                                name="judul"
                                error={errors.judul}
                                defaultValue={record?.judul}
                                required
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="komsat_id">
                                    Penyelenggara (opsional)
                                </Label>
                                <Select
                                    name="komsat_id"
                                    defaultValue={
                                        record?.komsat_id
                                            ? String(record.komsat_id)
                                            : 'wilayah'
                                    }
                                >
                                    <SelectTrigger
                                        id="komsat_id"
                                        className="h-11 md:h-9"
                                    >
                                        <SelectValue placeholder="Pilih penyelenggara" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wilayah">
                                            Wilayah GenBI Gorontalo
                                        </SelectItem>
                                        {komsatOptions.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.kode} — {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.komsat_id} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    defaultValue={record?.deskripsi ?? ''}
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                            <Field
                                label="Nama lokasi"
                                name="lokasi_nama"
                                error={errors.lokasi_nama}
                                defaultValue={record?.lokasi_nama}
                                required
                            />
                            <Field
                                label="Tanggal"
                                name="tanggal"
                                type="date"
                                error={errors.tanggal}
                                defaultValue={record?.tanggal}
                                required
                            />
                            <Field
                                label="Jam mulai"
                                name="jam_mulai"
                                type="time"
                                error={errors.jam_mulai}
                                defaultValue={record?.jam_mulai?.slice(0, 5)}
                                required
                            />
                            <Field
                                label="Jam selesai"
                                name="jam_selesai"
                                type="time"
                                error={errors.jam_selesai}
                                defaultValue={record?.jam_selesai?.slice(0, 5)}
                                required
                            />
                        </div>
                    </section>
                    <section className="grid gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Lokasi dan absensi
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Klik pada peta untuk memilih titik pusat
                                geofence.
                            </p>
                        </div>
                        <LeafletPicker
                            latitude={latitude}
                            longitude={longitude}
                            radius={radius}
                            readOnly={locationLocked}
                            onLocationChange={
                                locationLocked
                                    ? undefined
                                    : (lat, lng) => {
                                          setLatitude(lat);
                                          setLongitude(lng);
                                      }
                            }
                        />
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field
                                label="Latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                error={errors.latitude}
                                value={latitude}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setLatitude(
                                                  parseFloat(e.target.value) ||
                                                      0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                error={errors.longitude}
                                value={longitude}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setLongitude(
                                                  parseFloat(e.target.value) ||
                                                      0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Radius (meter)"
                                name="radius_m"
                                type="number"
                                error={errors.radius_m}
                                value={radius}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setRadius(
                                                  parseInt(e.target.value) || 0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Absensi dibuka"
                                name="absensi_buka_at"
                                type="datetime-local"
                                error={errors.absensi_buka_at}
                                defaultValue={record?.absensi_buka_at}
                                required
                            />
                            <Field
                                label="Absensi ditutup"
                                name="absensi_tutup_at"
                                type="datetime-local"
                                error={errors.absensi_tutup_at}
                                defaultValue={record?.absensi_tutup_at}
                                required
                            />
                            <Field
                                label="Kuota (opsional)"
                                name="kuota"
                                type="number"
                                error={errors.kuota}
                                defaultValue={record?.kuota}
                            />
                            <Field
                                label="Pendaftaran dibuka"
                                name="pendaftaran_dibuka_at"
                                type="datetime-local"
                                error={errors.pendaftaran_dibuka_at}
                                defaultValue={record?.pendaftaran_dibuka_at}
                            />
                            <Field
                                label="Batas daftar"
                                name="batas_daftar_at"
                                type="datetime-local"
                                error={errors.batas_daftar_at}
                                defaultValue={record?.batas_daftar_at}
                            />
                        </div>
                    </section>
                    <section className="grid gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Target divisi
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pilih divisi aktif yang menjadi sasaran
                                kegiatan.
                            </p>
                        </div>
                        {divisiGroups.map((group) => (
                            <fieldset key={group.id} className="grid gap-2">
                                <legend className="font-medium">
                                    {group.kode} — {group.nama}
                                </legend>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {group.divisi.map((divisi) => (
                                        <label
                                            key={divisi.id}
                                            className="flex min-h-11 items-center gap-3 rounded-md border px-3"
                                        >
                                            <input
                                                type="checkbox"
                                                name="divisi_ids[]"
                                                value={divisi.id}
                                                checked={selectedDivisi.includes(
                                                    divisi.id,
                                                )}
                                                onChange={(event) =>
                                                    setSelectedDivisi(
                                                        event.target.checked
                                                            ? [
                                                                  ...selectedDivisi,
                                                                  divisi.id,
                                                              ]
                                                            : selectedDivisi.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      divisi.id,
                                                              ),
                                                    )
                                                }
                                            />
                                            {divisi.nama}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        ))}
                        <InputError message={errors.divisi_ids} />
                    </section>
                    <section className="grid gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Bobot poin peran
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Bobot peserta wajib ditetapkan sebelum kegiatan
                                diterbitkan.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Field
                                label="Peserta"
                                name="bobot[peserta]"
                                type="number"
                                min="0"
                                error={errors['bobot.peserta']}
                                defaultValue={record?.bobot.peserta ?? ''}
                            />
                            <Field
                                label="Panitia"
                                name="bobot[panitia]"
                                type="number"
                                min="0"
                                error={errors['bobot.panitia']}
                                defaultValue={record?.bobot.panitia ?? ''}
                            />
                            <Field
                                label="Pemateri"
                                name="bobot[pemateri]"
                                type="number"
                                min="0"
                                error={errors['bobot.pemateri']}
                                defaultValue={record?.bobot.pemateri ?? ''}
                            />
                        </div>
                        <div className="grid gap-2 md:max-w-sm">
                            <Label htmlFor="status">Status kegiatan</Label>
                            <Select
                                name="status"
                                defaultValue={record?.status ?? 'draft'}
                            >
                                <SelectTrigger
                                    id="status"
                                    className="h-11 md:h-9"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions
                                        .filter((option) =>
                                            record
                                                ? option.value !== 'terkunci' ||
                                                  record.status === 'selesai' ||
                                                  record.status === 'terkunci'
                                                : ['draft', 'terbit'].includes(
                                                      option.value,
                                                  ),
                                        )
                                        .map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </section>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="h-11 md:h-9"
                        >
                            <Link href={cancelHref}>Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 md:h-9"
                        >
                            {processing && <Spinner />}Simpan kegiatan
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

function Field({
    label,
    name,
    type = 'text',
    error,
    defaultValue,
    value,
    onChange,
    required = false,
    ...inputProps
}: {
    label: string;
    name: string;
    type?: string;
    error?: string;
    defaultValue?: string | number | null;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    required?: boolean;
    min?: string;
    step?: string;
}) {
    const controlledProps =
        value !== undefined
            ? { value, onChange }
            : { defaultValue: defaultValue ?? '' };
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                required={required}
                className="h-11 md:h-9"
                {...controlledProps}
                {...inputProps}
            />
            <InputError message={error} />
        </div>
    );
}
