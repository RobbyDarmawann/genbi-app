<?php

use App\Actions\Kegiatan\ReviewAttendanceAction;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\PoinTransaksi;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
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

    $this->mahasiswaUser = User::factory()->create([
        'username' => 'mhs_andi',
        'name' => 'Andi Pratama',
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

    $this->otherUser = User::factory()->create([
        'username' => 'mhs_budi',
        'name' => 'Budi Santoso',
        'is_active' => true,
    ]);
    $this->otherUser->assignRole('mahasiswa');
    $this->otherMahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->otherUser->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531424002',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $today = now(config('app.timezone'))->toDateString();
    $this->kegiatan = Kegiatan::factory()->create([
        'judul' => 'Seminar Kebanksentralan',
        'status' => StatusKegiatan::Terbit,
        'tanggal' => $today,
        'jam_mulai' => '08:00:00',
        'jam_selesai' => '12:00:00',
        'absensi_buka_at' => $today.' 07:30:00',
        'absensi_tutup_at' => $today.' 12:30:00',
        'dibuat_oleh' => $this->internal->id,
    ]);
    $this->kegiatan->divisiTarget()->attach($this->divisiUng->id);

    KegiatanBobot::factory()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Peserta,
        'poin' => 15,
    ]);
    KegiatanBobot::factory()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Panitia,
        'poin' => 25,
    ]);

    $this->pendaftaran = Pendaftaran::factory()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'mahasiswa_id' => $this->mahasiswa->id,
        'peran' => PeranKegiatan::Peserta,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
});

describe('Layanan Poin & Ledger Scope', function () {
    test('total poin dihitung dari SUM ledger poin_transaksi tanpa kolom saldo manual', function () {
        expect($this->mahasiswa->totalPoin())->toBe(0);

        PoinTransaksi::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'kegiatan_id' => $this->kegiatan->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 15,
            'keterangan' => 'Kehadiran valid',
        ]);
        PoinTransaksi::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'kegiatan_id' => null,
            'tipe' => TipePoin::Koreksi,
            'jumlah' => 5,
            'keterangan' => 'Koreksi poin panitia',
        ]);

        expect($this->mahasiswa->totalPoin())->toBe(20);

        $withScope = Mahasiswa::query()
            ->withTotalPoin()
            ->findOrFail($this->mahasiswa->id);

        expect((int) $withScope->total_poin)->toBe(20);
    });

    test('mahasiswa hanya melihat riwayat transaksi dan kehadiran miliknya', function () {
        // Transaksi milik mahasiswa utama
        PoinTransaksi::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'kegiatan_id' => $this->kegiatan->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 15,
            'keterangan' => 'Poin milik Andi',
        ]);

        // Transaksi milik mahasiswa lain
        PoinTransaksi::factory()->create([
            'mahasiswa_id' => $this->otherMahasiswa->id,
            'kegiatan_id' => $this->kegiatan->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 25,
            'keterangan' => 'Poin rahasia Budi',
        ]);

        // Kehadiran milik mahasiswa utama
        Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::Valid,
            'jarak_m' => 12.5,
        ]);

        // Kehadiran milik mahasiswa lain
        $pendaftaranBudi = Pendaftaran::factory()->create([
            'kegiatan_id' => $this->kegiatan->id,
            'mahasiswa_id' => $this->otherMahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);
        Kehadiran::factory()->create([
            'pendaftaran_id' => $pendaftaranBudi->id,
            'status' => StatusKehadiran::Valid,
            'jarak_m' => 45.0,
        ]);

        // Andi login
        $this->actingAs($this->mahasiswaUser);

        // Akses riwayat poin
        $responsePoin = $this->get(route('mahasiswa.poin.riwayat'));
        $responsePoin->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/poin/riwayat')
                ->where('total_poin', 15)
                ->has('transaksi.data', 1)
                ->where('transaksi.data.0.keterangan', 'Poin milik Andi')
            );

        // Akses riwayat kehadiran
        $responseKehadiran = $this->get(route('mahasiswa.kehadiran.index'));
        $responseKehadiran->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/kehadiran/index')
                ->has('kehadiran.data', 1)
                ->where('kehadiran.data.0.kehadiran.jarak_m', '12.50')
            );

        // Dashboard mahasiswa menampilkan peringkat dan KPI
        $responseDashboard = $this->get(route('mahasiswa.dashboard'));
        $responseDashboard->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/dashboard')
                ->where('ringkasan.total_poin', 15)
                ->has('leaderboard')
            );
    });
});

describe('Peninjauan Kehadiran Menunggu Tinjau (IM)', function () {
    test('mahasiswa tidak dapat mengakses rute monitoring atau peninjauan kehadiran', function () {
        $this->actingAs($this->mahasiswaUser);

        $this->get(route('admin.kehadiran.index'))->assertForbidden();
        $this->get(route('admin.kegiatan.monitoring', $this->kegiatan))->assertForbidden();

        $kehadiran = Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::MenungguTinjau,
        ]);

        $this->post(route('admin.kegiatan.kehadiran.review', [$this->kegiatan, $kehadiran]), [
            'status' => 'valid',
        ])->assertForbidden();
    });

    test('approve menunggu_tinjau memberi kredit poin tepat satu kali dan mencatat audit log', function () {
        $kehadiran = Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::MenungguTinjau,
            'jarak_m' => 45.5,
            'akurasi_m' => 120.0,
        ]);

        $this->actingAs($this->internal);

        $response = $this->post(route('admin.kegiatan.kehadiran.review', [$this->kegiatan, $kehadiran]), [
            'status' => 'valid',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $kehadiran->refresh();
        expect($kehadiran->status)->toBe(StatusKehadiran::Valid);

        // Poin transaksi terbentuk sesuai bobot peserta (15 poin)
        $poin = PoinTransaksi::query()->where('kehadiran_id', $kehadiran->id)->first();
        expect($poin)->not->toBeNull()
            ->and($poin->jumlah)->toBe(15)
            ->and($poin->mahasiswa_id)->toBe($this->mahasiswa->id)
            ->and($poin->tipe)->toBe(TipePoin::Kredit);

        // Percobaan persetujuan kedua harus ditolak (idempoten / cegah poin ganda)
        $action = app(ReviewAttendanceAction::class);
        expect(fn () => $action->approve($kehadiran, $this->internal))
            ->toThrow(ValidationException::class);

        expect(PoinTransaksi::query()->where('kehadiran_id', $kehadiran->id)->count())->toBe(1);

        // Audit log tercatat
        expect(AuditLog::query()->where('aksi', 'kehadiran.approved')->where('subject_id', $kehadiran->id)->exists())->toBeTrue();
    });

    test('reject menunggu_tinjau mengubah status menjadi ditolak dengan alasan dan tidak memberi poin', function () {
        $kehadiran = Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::MenungguTinjau,
            'jarak_m' => 45.5,
            'akurasi_m' => 120.0,
        ]);

        $this->actingAs($this->internal);

        // Validasi: alasan wajib bila ditolak
        $this->post(route('admin.kegiatan.kehadiran.review', [$this->kegiatan, $kehadiran]), [
            'status' => 'ditolak',
            'alasan' => '',
        ])->assertSessionHasErrors('alasan');

        $response = $this->post(route('admin.kegiatan.kehadiran.review', [$this->kegiatan, $kehadiran]), [
            'status' => 'ditolak',
            'alasan' => 'Wajah tidak terlihat jelas pada foto bukti.',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $kehadiran->refresh();
        expect($kehadiran->status)->toBe(StatusKehadiran::Ditolak)
            ->and($kehadiran->alasan_penolakan)->toBe('Wajah tidak terlihat jelas pada foto bukti.');

        // Tidak ada poin yang terbentuk
        expect(PoinTransaksi::query()->where('kehadiran_id', $kehadiran->id)->exists())->toBeFalse();

        // Audit log tercatat
        expect(AuditLog::query()->where('aksi', 'kehadiran.rejected')->where('subject_id', $kehadiran->id)->exists())->toBeTrue();
    });
});

describe('Penutupan dan Penguncian Kegiatan', function () {
    test('status kegiatan berubah efektif mengikuti waktu tanpa aksi manual', function () {
        Carbon::setTestNow(Carbon::parse($this->kegiatan->tanggal->toDateString().' 10:00:00', config('app.timezone')));
        expect($this->kegiatan->statusEfektif())->toBe(StatusKegiatan::Berlangsung);

        Carbon::setTestNow(Carbon::parse($this->kegiatan->tanggal->toDateString().' 12:05:00', config('app.timezone')));
        expect($this->kegiatan->statusEfektif())->toBe(StatusKegiatan::Selesai);

        Carbon::setTestNow();
    });

    test('kegiatan tidak dapat dikunci bila masih ada kehadiran menunggu tinjau atau koreksi menunggu', function () {
        // Travel ke waktu setelah kegiatan selesai agar status efektif = Selesai
        $this->travelTo($this->kegiatan->tanggal->toDateString().' 13:00:00');
        expect($this->kegiatan->statusEfektif())->toBe(StatusKegiatan::Selesai);

        $kehadiran = Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::MenungguTinjau,
        ]);

        $this->actingAs($this->internal);

        // Coba kunci saat masih ada kehadiran menunggu_tinjau
        $this->post(route('admin.kegiatan.lock', $this->kegiatan))
            ->assertSessionHasErrors('status');

        $this->kegiatan->refresh();
        expect($this->kegiatan->status)->toBe(StatusKegiatan::Terbit);

        // Selesaikan kehadiran menunggu_tinjau
        $kehadiran->update(['status' => StatusKehadiran::Valid]);

        // Tambah koreksi menunggu
        $koreksi = Koreksi::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'kegiatan_id' => $this->kegiatan->id,
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKoreksi::Menunggu,
        ]);

        // Coba kunci saat masih ada koreksi menunggu
        $this->post(route('admin.kegiatan.lock', $this->kegiatan))
            ->assertSessionHasErrors('status');

        // Selesaikan koreksi
        $koreksi->update(['status' => StatusKoreksi::Disetujui]);

        // Sekarang kegiatan dapat dikunci
        $this->post(route('admin.kegiatan.lock', $this->kegiatan))
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->kegiatan->refresh();
        expect($this->kegiatan->status)->toBe(StatusKegiatan::Terkunci);
        expect(AuditLog::query()->where('aksi', 'kegiatan.locked')->where('subject_id', $this->kegiatan->id)->exists())->toBeTrue();
    });

    test('setelah terkunci endpoint perubahan pendaftaran, peran, dan absensi ditolak di backend', function () {
        $this->kegiatan->update(['status' => StatusKegiatan::Terkunci]);

        // 1. Pendaftaran baru ditolak
        $this->actingAs($this->otherUser);
        $this->post(route('mahasiswa.kegiatan.daftar', $this->kegiatan))
            ->assertSessionHasErrors();

        // 2. Perubahan peran oleh IM ditolak
        $this->actingAs($this->internal);
        $this->patch(route('admin.kegiatan.peserta.ubah-peran', [$this->kegiatan, $this->pendaftaran]), [
            'peran' => PeranKegiatan::Panitia->value,
        ])->assertSessionHasErrors();

        // 3. Review kehadiran pada kegiatan terkunci ditolak
        $kehadiran = Kehadiran::factory()->create([
            'pendaftaran_id' => $this->pendaftaran->id,
            'status' => StatusKehadiran::MenungguTinjau,
        ]);
        $action = app(ReviewAttendanceAction::class);
        expect(fn () => $action->approve($kehadiran, $this->internal))
            ->toThrow(ValidationException::class);
    });
});
