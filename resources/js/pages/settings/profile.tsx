import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type Biodata = {
    username: string;
    nim: string;
    email: string;
    komsat: string | null;
    divisi: string | null;
    angkatan: string;
    status_penerima: string;
    jenis_kelamin: string | null;
    agama: string | null;
    golongan_darah: string | null;
    tanggal_lahir: string | null;
    domisili: string | null;
    no_hp: string | null;
    foto_url: string | null;
};

type PageProps = {
    auth: Auth;
    mahasiswa: Biodata | null;
};

export default function Profile() {
    const { auth, mahasiswa } = usePage<PageProps>().props;

    if (mahasiswa) {
        return (
            <>
                <Head title="Data diri" />
                <h1 className="sr-only">Data diri</h1>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Data diri"
                        description="Lengkapi dan perbarui biodata Anda"
                    />
                    <div className="grid gap-2 rounded-lg border p-4 text-sm sm:grid-cols-2">
                        <p>
                            <strong>Username:</strong> {mahasiswa.username}
                        </p>
                        <p>
                            <strong>NIM:</strong> {mahasiswa.nim}
                        </p>
                        <p>
                            <strong>Email:</strong> {mahasiswa.email}
                        </p>
                        <p>
                            <strong>Komsat:</strong> {mahasiswa.komsat ?? '—'}
                        </p>
                        <p>
                            <strong>Divisi:</strong> {mahasiswa.divisi ?? '—'}
                        </p>
                        <p>
                            <strong>Angkatan:</strong> {mahasiswa.angkatan}
                        </p>
                        <p>
                            <strong>Status penerima:</strong>{' '}
                            {mahasiswa.status_penerima}
                        </p>
                    </div>
                    <Form
                        action="/settings/biodata"
                        method="patch"
                        encType="multipart/form-data"
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="jenis_kelamin">
                                            Jenis kelamin
                                        </Label>
                                        <select
                                            id="jenis_kelamin"
                                            name="jenis_kelamin"
                                            defaultValue={
                                                mahasiswa.jenis_kelamin ?? ''
                                            }
                                            className="h-10 rounded-md border bg-background px-3 text-sm"
                                        >
                                            <option value="">Pilih</option>
                                            <option>Laki-laki</option>
                                            <option>Perempuan</option>
                                        </select>
                                        <InputError
                                            message={errors.jenis_kelamin}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="agama">Agama</Label>
                                        <Input
                                            id="agama"
                                            name="agama"
                                            defaultValue={mahasiswa.agama ?? ''}
                                        />
                                        <InputError message={errors.agama} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="golongan_darah">
                                            Golongan darah
                                        </Label>
                                        <Input
                                            id="golongan_darah"
                                            name="golongan_darah"
                                            defaultValue={
                                                mahasiswa.golongan_darah ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.golongan_darah}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tanggal_lahir">
                                            Tanggal lahir
                                        </Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            name="tanggal_lahir"
                                            defaultValue={
                                                mahasiswa.tanggal_lahir ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.tanggal_lahir}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="domisili">
                                            Domisili
                                        </Label>
                                        <Input
                                            id="domisili"
                                            name="domisili"
                                            defaultValue={
                                                mahasiswa.domisili ?? ''
                                            }
                                        />
                                        <InputError message={errors.domisili} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="no_hp">Nomor HP</Label>
                                        <Input
                                            id="no_hp"
                                            name="no_hp"
                                            defaultValue={mahasiswa.no_hp ?? ''}
                                            inputMode="numeric"
                                        />
                                        <InputError message={errors.no_hp} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="foto">Foto profil</Label>
                                    <Input
                                        id="foto"
                                        type="file"
                                        name="foto"
                                        accept=".jpg,.jpeg,.png"
                                    />
                                    <InputError message={errors.foto} />
                                    {mahasiswa.foto_url && (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name="hapus_foto"
                                                value="1"
                                            />{' '}
                                            Hapus foto saat disimpan
                                        </label>
                                    )}
                                </div>
                                <Button disabled={processing}>
                                    Simpan data diri
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Pengaturan profil" />

            <h1 className="sr-only">Pengaturan profil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil"
                    description="Perbarui nama dan alamat email"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama lengkap</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat email</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Alamat email"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Simpan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan profil',
            href: edit(),
        },
    ],
};
