<?php

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $this->internal = User::factory()->create(['username' => 'admin_im']);
    $this->internal->assignRole('internal_manajemen');

    $this->ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $this->iain = Komsat::query()->where('kode', 'IAIN')->firstOrFail();

    $this->divisiUng = Divisi::factory()->create([
        'komsat_id' => $this->ung->id,
        'nama' => 'Pendidikan',
        'aktif' => true,
    ]);
    $this->divisiIain = Divisi::factory()->create([
        'komsat_id' => $this->iain->id,
        'nama' => 'Lingkungan Hidup',
        'aktif' => true,
    ]);

    $this->mahasiswaUser = User::factory()->create([
        'username' => 'mhs_target',
        'is_active' => true,
    ]);
    $this->mahasiswaUser->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->mahasiswaUser->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531424001',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $this->nonTargetUser = User::factory()->create([
        'username' => 'mhs_nontarget',
        'is_active' => true,
    ]);
    $this->nonTargetUser->assignRole('mahasiswa');
    $this->nonTargetMahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->nonTargetUser->id,
        'komsat_id' => $this->iain->id,
        'divisi_id' => $this->divisiIain->id,
        'nim' => '531424002',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $this->kegiatan = Kegiatan::factory()->create([
        'judul' => 'Sosialisasi QRIS GenBI',
        'status' => StatusKegiatan::Terbit,
        'kuota' => 10,
        'pendaftaran_dibuka_at' => now()->subDay(),
        'batas_daftar_at' => now()->addDay(),
        'absensi_buka_at' => now()->addHours(2),
        'absensi_tutup_at' => now()->addHours(5),
        'dibuat_oleh' => $this->internal->id,
    ]);
    $this->kegiatan->divisiTarget()->sync([$this->divisiUng->id]);

    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Peserta,
        'poin' => 10,
    ]);
    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Panitia,
        'poin' => 15,
    ]);
    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Pemateri,
        'poin' => 25,
    ]);
});

describe('Pendaftaran Mahasiswa', function () {
    test('mahasiswa target dapat mendaftar dengan peran default peserta dan tercatat di audit log', function () {
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect();

        $pendaftaran = Pendaftaran::query()
            ->where('kegiatan_id', $this->kegiatan->id)
            ->where('mahasiswa_id', $this->mahasiswa->id)
            ->first();

        expect($pendaftaran)->not->toBeNull()
            ->and($pendaftaran->peran)->toBe(PeranKegiatan::Peserta)
            ->and($pendaftaran->status)->toBe(StatusPendaftaran::Terdaftar);

        expect(AuditLog::query()->where('aksi', 'pendaftaran.created')->where('subject_id', $pendaftaran->id)->exists())
            ->toBeTrue();
    });

    test('mahasiswa non-target ditolak di backend dan melihat alasan sopan pada detail kegiatan', function () {
        $this->actingAs($this->nonTargetUser)
            ->get(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/kegiatan/show')
                ->where('ditargetkan_untuk_saya', false)
                ->where('dapat_mendaftar', false)
                ->where('alasan_tidak_dapat_mendaftar', 'Kegiatan ini ditujukan untuk divisi terpilih.')
                ->where('status_pendaftaran_label', 'Belum Terdaftar')
            );

        $this->actingAs($this->nonTargetUser)
            ->from(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertSessionHasErrors([
                'pendaftaran' => 'Kegiatan ini ditujukan untuk divisi terpilih.',
            ]);

        expect(Pendaftaran::query()->where('mahasiswa_id', $this->nonTargetMahasiswa->id)->exists())
            ->toBeFalse();
    });

    test('mahasiswa nonaktif ditolak saat mencoba mendaftar', function () {
        $this->mahasiswa->update(['aktif' => false]);

        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertForbidden();

        expect(Pendaftaran::query()->where('mahasiswa_id', $this->mahasiswa->id)->exists())
            ->toBeFalse();
    });

    test('pendaftaran ganda tidak menghasilkan dua baris atau dua peran', function () {
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect();

        $this->actingAs($this->mahasiswaUser)
            ->from(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertSessionHasErrors('pendaftaran');

        expect(
            Pendaftaran::query()
                ->where('kegiatan_id', $this->kegiatan->id)
                ->where('mahasiswa_id', $this->mahasiswa->id)
                ->count()
        )->toBe(1);
    });

    test('kuota penuh ditolak termasuk skenario kursi terakhir', function () {
        $this->kegiatan->update(['kuota' => 2]);

        $mhsKeduaUser = User::factory()->create(['username' => 'mhs_kedua', 'is_active' => true]);
        $mhsKeduaUser->assignRole('mahasiswa');
        $mhsKedua = Mahasiswa::factory()->create([
            'user_id' => $mhsKeduaUser->id,
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiUng->id,
            'nim' => '531424010',
            'aktif' => true,
        ]);

        $mhsKetigaUser = User::factory()->create(['username' => 'mhs_ketiga', 'is_active' => true]);
        $mhsKetigaUser->assignRole('mahasiswa');
        $mhsKetiga = Mahasiswa::factory()->create([
            'user_id' => $mhsKetigaUser->id,
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiUng->id,
            'nim' => '531424011',
            'aktif' => true,
        ]);

        // Kursi 1 berhasil
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertSessionHasNoErrors();

        // Kursi terakhir (ke-2) berhasil
        $this->actingAs($mhsKeduaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertSessionHasNoErrors();

        // Pendaftar ke-3 ditolak karena kuota penuh
        $this->actingAs($mhsKetigaUser)
            ->from(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertSessionHasErrors('pendaftaran');

        expect(
            Pendaftaran::query()
                ->where('kegiatan_id', $this->kegiatan->id)
                ->where('status', StatusPendaftaran::Terdaftar)
                ->count()
        )->toBe(2)
            ->and(Pendaftaran::query()->where('mahasiswa_id', $mhsKetiga->id)->exists())->toBeFalse()
            ->and(Pendaftaran::query()->where('mahasiswa_id', $mhsKedua->id)->exists())->toBeTrue();
    });

    test('pembatalan lalu daftar ulang memakai kembali baris yang sama tanpa membuat duplikat', function () {
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertSessionHasNoErrors();

        $pendaftaranAwal = Pendaftaran::query()
            ->where('kegiatan_id', $this->kegiatan->id)
            ->where('mahasiswa_id', $this->mahasiswa->id)
            ->firstOrFail();

        $this->actingAs($this->mahasiswaUser)
            ->delete(route('mahasiswa.kegiatan.batal', $this->kegiatan))
            ->assertSessionHasNoErrors();

        expect($pendaftaranAwal->fresh()->status)->toBe(StatusPendaftaran::Batal);

        // Daftar ulang
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertSessionHasNoErrors();

        $semuaBaris = Pendaftaran::query()
            ->where('kegiatan_id', $this->kegiatan->id)
            ->where('mahasiswa_id', $this->mahasiswa->id)
            ->get();

        expect($semuaBaris)->toHaveCount(1)
            ->and($semuaBaris->first()->id)->toBe($pendaftaranAwal->id)
            ->and($semuaBaris->first()->status)->toBe(StatusPendaftaran::Terdaftar);

        expect(AuditLog::query()->where('aksi', 'pendaftaran.re_registered')->where('subject_id', $pendaftaranAwal->id)->exists())
            ->toBeTrue();
    });

    test('pendaftaran setelah batas daftar ditolak', function () {
        $this->kegiatan->update([
            'batas_daftar_at' => now()->subMinute(),
        ]);

        $this->actingAs($this->mahasiswaUser)
            ->from(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertRedirect(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertSessionHasErrors('pendaftaran');

        expect(Pendaftaran::query()->where('mahasiswa_id', $this->mahasiswa->id)->exists())
            ->toBeFalse();
    });

    test('mahasiswa dengan kehadiran tidak dapat membatalkan pendaftaran', function () {
        $pendaftaran = Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        Kehadiran::factory()->create([
            'pendaftaran_id' => $pendaftaran->id,
            'status' => StatusKehadiran::Valid,
        ]);

        $this->actingAs($this->mahasiswaUser)
            ->from(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->delete(route('mahasiswa.kegiatan.batal', $this->kegiatan))
            ->assertRedirect(route('mahasiswa.kegiatan.show', $this->kegiatan))
            ->assertSessionHasErrors('pendaftaran');

        expect($pendaftaran->fresh()->status)->toBe(StatusPendaftaran::Terdaftar);
    });

    test('mahasiswa tidak dapat mengubah perannya sendiri baik saat mendaftar maupun lewat endpoint admin', function () {
        // Mencoba menyisipkan peran panitia saat daftar mandiri -> ditolak oleh FormRequest (prohibited)
        $this->actingAs($this->mahasiswaUser)
            ->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan), [
                'peran' => PeranKegiatan::Panitia->value,
            ])
            ->assertSessionHasErrors('peran');

        $pendaftaran = Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        // Mencoba memanggil endpoint admin ubah peran -> 403 Forbidden
        $this->actingAs($this->mahasiswaUser)
            ->patch(route('admin.kegiatan.peserta.ubah-peran', [$this->kegiatan, $pendaftaran]), [
                'peran' => PeranKegiatan::Panitia->value,
            ])
            ->assertForbidden();

        expect($pendaftaran->fresh()->peran)->toBe(PeranKegiatan::Peserta);
    });
});

describe('Pengelolaan Peserta oleh Internal Manajemen', function () {
    test('IM dapat melihat halaman peserta beserta kapasitas kuota dan sisa kursi', function () {
        Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        $this->actingAs($this->internal)
            ->get(route('admin.kegiatan.peserta.index', $this->kegiatan))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/kegiatan/peserta')
                ->where('kegiatan.kuota', 10)
                ->where('kegiatan.jumlah_terdaftar', 1)
                ->where('kegiatan.sisa_kuota', 9)
                ->has('peserta.data', 1)
            );
    });

    test('IM dapat mengubah peran sebelum ada kehadiran dan penolakan terjadi setelah kehadiran valid atau kegiatan terkunci', function () {
        $pendaftaran = Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        // Berhasil ubah peran sebelum ada kehadiran
        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.peserta.ubah-peran', [$this->kegiatan, $pendaftaran]), [
                'peran' => PeranKegiatan::Panitia->value,
            ])
            ->assertSessionHasNoErrors();

        expect($pendaftaran->fresh()->peran)->toBe(PeranKegiatan::Panitia);
        expect(AuditLog::query()->where('aksi', 'pendaftaran.role_changed')->where('subject_id', $pendaftaran->id)->exists())
            ->toBeTrue();

        // Buat kehadiran valid -> perubahan peran harus ditolak dan mengarahkan ke koreksi/audit
        Kehadiran::factory()->create([
            'pendaftaran_id' => $pendaftaran->id,
            'status' => StatusKehadiran::Valid,
        ]);

        $this->actingAs($this->internal)
            ->from(route('admin.kegiatan.peserta.index', $this->kegiatan))
            ->patch(route('admin.kegiatan.peserta.ubah-peran', [$this->kegiatan, $pendaftaran]), [
                'peran' => PeranKegiatan::Pemateri->value,
            ])
            ->assertRedirect(route('admin.kegiatan.peserta.index', $this->kegiatan))
            ->assertSessionHasErrors('peran');

        expect($pendaftaran->fresh()->peran)->toBe(PeranKegiatan::Panitia);
    });

    test('IM dapat membatalkan pendaftaran yang belum memiliki kehadiran dengan alasan yang dicatat audit log', function () {
        $pendaftaran = Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        $this->actingAs($this->internal)
            ->delete(route('admin.kegiatan.peserta.batal', [$this->kegiatan, $pendaftaran]), [
                'alasan' => 'Konfirmasi berhalangan hadir karena ujian kampus',
            ])
            ->assertSessionHasNoErrors();

        expect($pendaftaran->fresh()->status)->toBe(StatusPendaftaran::Batal);

        $log = AuditLog::query()
            ->where('aksi', 'pendaftaran.cancelled_by_admin')
            ->where('subject_id', $pendaftaran->id)
            ->first();

        expect($log)->not->toBeNull()
            ->and($log->metadata['alasan'] ?? null)->toBe('Konfirmasi berhalangan hadir karena ujian kampus');
    });
});
