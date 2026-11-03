<?php

use App\Enums\StatusPenerima;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

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
        'nama' => 'Kewirausahaan',
        'aktif' => true,
    ]);

    $this->mahasiswaUser = User::factory()->create(['username' => 'mhs_biasa']);
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
});

describe('Authorization', function () {
    test('guest is redirected to login on all student management routes', function () {
        $this->get(route('admin.mahasiswa.index'))->assertRedirect(route('login'));
        $this->get(route('admin.mahasiswa.create'))->assertRedirect(route('login'));
        $this->post(route('admin.mahasiswa.store'), [])->assertRedirect(route('login'));
        $this->get(route('admin.mahasiswa.show', $this->mahasiswa))->assertRedirect(route('login'));
        $this->get(route('admin.mahasiswa.edit', $this->mahasiswa))->assertRedirect(route('login'));
        $this->put(route('admin.mahasiswa.update', $this->mahasiswa), [])->assertRedirect(route('login'));
        $this->post(route('admin.mahasiswa.reset-password', $this->mahasiswa), [])->assertRedirect(route('login'));
        $this->patch(route('admin.mahasiswa.toggle-aktif', $this->mahasiswa), [])->assertRedirect(route('login'));
        $this->delete(route('admin.mahasiswa.destroy', $this->mahasiswa))->assertRedirect(route('login'));
    });

    test('mahasiswa receives 403 forbidden on all student management routes', function () {
        $this->actingAs($this->mahasiswaUser)->get(route('admin.mahasiswa.index'))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.mahasiswa.create'))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->post(route('admin.mahasiswa.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.mahasiswa.show', $this->mahasiswa))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.mahasiswa.edit', $this->mahasiswa))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->put(route('admin.mahasiswa.update', $this->mahasiswa), [])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->post(route('admin.mahasiswa.reset-password', $this->mahasiswa), [])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->patch(route('admin.mahasiswa.toggle-aktif', $this->mahasiswa), ['aktif' => false])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->delete(route('admin.mahasiswa.destroy', $this->mahasiswa))->assertForbidden();
    });
});

describe('Create and Validation', function () {
    test('internal manajemen creates user and mahasiswa atomically with mahasiswa role and nullable email', function () {
        $plainPassword = 'PasswordAwal123!';

        $response = $this->actingAs($this->internal)->post(route('admin.mahasiswa.store'), [
            'name' => 'Rahmat Hidayat',
            'username' => 'rahmat_ung25',
            'password' => $plainPassword,
            'password_confirmation' => $plainPassword,
            'nim' => '531425010',
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiUng->id,
            'angkatan' => '2025',
            'status_penerima' => StatusPenerima::Penerima->value,
            'aktif' => true,
        ]);

        $response->assertRedirect(route('admin.mahasiswa.index'));

        $createdUser = User::query()->where('username', 'rahmat_ung25')->firstOrFail();
        expect($createdUser->email)->toBeNull()
            ->and($createdUser->is_active)->toBeTrue()
            ->and($createdUser->hasRole('mahasiswa'))->toBeTrue()
            ->and($createdUser->password)->not->toBe($plainPassword)
            ->and(Hash::check($plainPassword, $createdUser->password))->toBeTrue();

        $createdMahasiswa = Mahasiswa::query()->where('user_id', $createdUser->id)->firstOrFail();
        expect($createdMahasiswa->nim)->toBe('531425010')
            ->and($createdMahasiswa->komsat_id)->toBe($this->ung->id)
            ->and($createdMahasiswa->divisi_id)->toBe($this->divisiUng->id)
            ->and($createdMahasiswa->angkatan)->toBe('2025')
            ->and($createdMahasiswa->status_penerima)->toBe(StatusPenerima::Penerima)
            ->and($createdMahasiswa->aktif)->toBeTrue();

        $audit = AuditLog::query()
            ->where('aksi', 'mahasiswa.created')
            ->where('subject_id', $createdMahasiswa->id)
            ->firstOrFail();

        expect(json_encode($audit->metadata))->not->toContain($plainPassword);
    });

    test('rejects duplicate username and duplicate nim', function () {
        $this->actingAs($this->internal)->post(route('admin.mahasiswa.store'), [
            'name' => 'Duplikat Akun',
            'username' => 'mhs_biasa',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'nim' => '531424001',
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiUng->id,
            'angkatan' => '2024',
            'status_penerima' => 'penerima',
        ])->assertSessionHasErrors(['username', 'nim']);
    });

    test('rejects divisi belonging to another komsat or inactive divisi', function () {
        $inactiveDivisi = Divisi::factory()->create([
            'komsat_id' => $this->ung->id,
            'nama' => 'Divisi Lama',
            'aktif' => false,
        ]);

        // Divisi milik IAIN dipasangkan ke Komsat UNG -> ditolak
        $this->actingAs($this->internal)->post(route('admin.mahasiswa.store'), [
            'name' => 'Salah Divisi',
            'username' => 'salah_divisi',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'nim' => '531425099',
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiIain->id,
            'angkatan' => '2025',
            'status_penerima' => 'penerima',
        ])->assertSessionHasErrors(['divisi_id']);

        // Divisi nonaktif pada Komsat yang sama -> ditolak saat pembuatan
        $this->actingAs($this->internal)->post(route('admin.mahasiswa.store'), [
            'name' => 'Divisi Nonaktif',
            'username' => 'divisi_nonaktif',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'nim' => '531425098',
            'komsat_id' => $this->ung->id,
            'divisi_id' => $inactiveDivisi->id,
            'angkatan' => '2025',
            'status_penerima' => 'penerima',
        ])->assertSessionHasErrors(['divisi_id']);

        expect(User::query()->whereIn('username', ['salah_divisi', 'divisi_nonaktif'])->exists())->toBeFalse();
    });
});

describe('Update, Password Reset, and Account Status', function () {
    test('updating student profile does not change password even if password field is sent', function () {
        $originalHash = $this->mahasiswaUser->password;

        $this->actingAs($this->internal)->put(route('admin.mahasiswa.update', $this->mahasiswa), [
            'name' => 'Nama Diperbarui',
            'username' => 'mhs_diperbarui',
            'password' => 'PasswordMenyusup999!',
            'nim' => '531424001',
            'komsat_id' => $this->iain->id,
            'divisi_id' => $this->divisiIain->id,
            'angkatan' => '2023',
            'status_penerima' => StatusPenerima::Alumni->value,
            'aktif' => true,
        ])->assertSessionHasNoErrors()->assertRedirect();

        $this->mahasiswa->refresh();
        $this->mahasiswaUser->refresh();

        expect($this->mahasiswaUser->name)->toBe('Nama Diperbarui')
            ->and($this->mahasiswaUser->username)->toBe('mhs_diperbarui')
            ->and($this->mahasiswaUser->password)->toBe($originalHash)
            ->and($this->mahasiswa->komsat_id)->toBe($this->iain->id)
            ->and($this->mahasiswa->divisi_id)->toBe($this->divisiIain->id)
            ->and($this->mahasiswa->status_penerima)->toBe(StatusPenerima::Alumni)
            ->and(AuditLog::query()->where('aksi', 'mahasiswa.updated')->where('subject_id', $this->mahasiswa->id)->exists())->toBeTrue();
    });

    test('deactivating student blocks login and student area without deleting point history', function () {
        PoinTransaksi::query()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 25,
            'keterangan' => 'Kehadiran kegiatan perdana',
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->internal)
            ->patch(route('admin.mahasiswa.toggle-aktif', $this->mahasiswa), ['aktif' => false])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->mahasiswa->refresh();
        $this->mahasiswaUser->refresh();

        expect($this->mahasiswa->aktif)->toBeFalse()
            ->and($this->mahasiswaUser->is_active)->toBeFalse()
            ->and($this->mahasiswa->totalPoin())->toBe(25)
            ->and(AuditLog::query()->where('aksi', 'mahasiswa.deactivated')->where('subject_id', $this->mahasiswa->id)->exists())->toBeTrue();

        // Mahasiswa yang sedang login juga diblokir dari area mahasiswa aktif
        $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.dashboard'))
            ->assertForbidden();

        // Logout lalu coba login sebagai mahasiswa nonaktif -> ditolak
        auth()->logout();

        $this->post(route('login.store'), [
            'username' => $this->mahasiswaUser->username,
            'password' => 'password',
        ])->assertSessionHasErrors(['username']);

        $this->assertGuest();
    });

    test('reset password invalidates old password, allows new password, and logs without leaking secret', function () {
        $newPassword = 'PasswordBaruAman2026!';

        $this->actingAs($this->internal)
            ->post(route('admin.mahasiswa.reset-password', $this->mahasiswa), [
                'password' => $newPassword,
                'password_confirmation' => $newPassword,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $audit = AuditLog::query()
            ->where('aksi', 'mahasiswa.password_reset')
            ->where('subject_id', $this->mahasiswa->id)
            ->firstOrFail();

        expect(json_encode($audit->metadata))->not->toContain($newPassword);

        auth()->logout();

        // Password lama ditolak
        $this->post(route('login.store'), [
            'username' => 'mhs_biasa',
            'password' => 'password',
        ]);
        $this->assertGuest();

        // Password baru diterima
        $this->post(route('login.store'), [
            'username' => 'mhs_biasa',
            'password' => $newPassword,
        ])->assertSessionHasNoErrors();
        $this->assertAuthenticatedAs($this->mahasiswaUser->fresh());
    });
});

describe('Ledger Points, Filtering, and History Protection', function () {
    test('calculates total points from poin_transaksi ledger on index and show pages', function () {
        PoinTransaksi::query()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 20,
            'keterangan' => 'Kegiatan Bakti Sosial',
            'dibuat_oleh' => $this->internal->id,
        ]);
        PoinTransaksi::query()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'tipe' => TipePoin::Koreksi,
            'jumlah' => 15,
            'keterangan' => 'Koreksi panitia disetujui',
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->internal)
            ->get(route('admin.mahasiswa.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/mahasiswa/index')
                ->where('mahasiswa.data.0.id', $this->mahasiswa->id)
                ->where('mahasiswa.data.0.total_poin', 35)
                ->where('mahasiswa.data.0.terikat', true)
                ->missing('mahasiswa.data.0.password')
            );

        $this->actingAs($this->internal)
            ->get(route('admin.mahasiswa.show', $this->mahasiswa))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/mahasiswa/show')
                ->where('mahasiswa.total_poin', 35)
                ->has('riwayatPoin', 2)
            );
    });

    test('filters students by komsat, divisi, status penerima, active state, and search keyword', function () {
        $otherUser = User::factory()->create([
            'name' => 'Nadia Putri',
            'username' => 'nadia_iain',
            'is_active' => false,
        ]);
        $otherUser->assignRole('mahasiswa');
        $otherMahasiswa = Mahasiswa::factory()->create([
            'user_id' => $otherUser->id,
            'komsat_id' => $this->iain->id,
            'divisi_id' => $this->divisiIain->id,
            'nim' => '998877665',
            'angkatan' => '2023',
            'status_penerima' => StatusPenerima::Alumni,
            'aktif' => false,
        ]);

        $this->actingAs($this->internal)
            ->get(route('admin.mahasiswa.index', [
                'komsat_id' => $this->iain->id,
                'divisi_id' => $this->divisiIain->id,
                'status_penerima' => StatusPenerima::Alumni->value,
                'aktif' => '0',
                'q' => '998877',
            ]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('mahasiswa.data', 1)
                ->where('mahasiswa.data.0.id', $otherMahasiswa->id)
            );
    });

    test('prevents deleting student with point or activity history while allowing deletion of clean unlinked record', function () {
        PoinTransaksi::query()->create([
            'mahasiswa_id' => $this->mahasiswa->id,
            'tipe' => TipePoin::Kredit,
            'jumlah' => 10,
            'keterangan' => 'Riwayat awal',
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->internal)
            ->delete(route('admin.mahasiswa.destroy', $this->mahasiswa))
            ->assertSessionHasErrors(['delete']);

        expect(Mahasiswa::query()->whereKey($this->mahasiswa->id)->exists())->toBeTrue();

        // Anggota baru tanpa riwayat dapat dihapus bersih bersama akun user-nya
        $cleanUser = User::factory()->create(['username' => 'akun_salah_input']);
        $cleanUser->assignRole('mahasiswa');
        $cleanMahasiswa = Mahasiswa::factory()->create([
            'user_id' => $cleanUser->id,
            'komsat_id' => $this->ung->id,
            'divisi_id' => $this->divisiUng->id,
        ]);

        $this->actingAs($this->internal)
            ->delete(route('admin.mahasiswa.destroy', $cleanMahasiswa))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.mahasiswa.index'));

        expect(Mahasiswa::query()->whereKey($cleanMahasiswa->id)->exists())->toBeFalse()
            ->and(User::query()->whereKey($cleanUser->id)->exists())->toBeFalse();
    });
});
