<?php

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Periode;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->internal = User::factory()->create();
    $this->internal->assignRole('internal_manajemen');
    $this->mahasiswa = User::factory()->create();
    $this->mahasiswa->assignRole('mahasiswa');
});

describe('Authorization', function () {
    test('guest is redirected to login on all master data routes', function () {
        $periode = Periode::factory()->create();
        $komsat = Komsat::factory()->create();
        $divisi = Divisi::factory()->for($komsat)->create();

        $this->get(route('admin.periode.index'))->assertRedirect(route('login'));
        $this->post(route('admin.periode.store'), [])->assertRedirect(route('login'));
        $this->put(route('admin.periode.update', $periode), [])->assertRedirect(route('login'));
        $this->patch(route('admin.periode.toggle-aktif', $periode), [])->assertRedirect(route('login'));
        $this->delete(route('admin.periode.destroy', $periode))->assertRedirect(route('login'));

        $this->get(route('admin.komsat.index'))->assertRedirect(route('login'));
        $this->post(route('admin.komsat.store'), [])->assertRedirect(route('login'));

        $this->get(route('admin.divisi.index'))->assertRedirect(route('login'));
        $this->post(route('admin.divisi.store'), [])->assertRedirect(route('login'));
        $this->delete(route('admin.divisi.destroy', $divisi))->assertRedirect(route('login'));
    });

    test('mahasiswa receives 403 forbidden on all master data routes', function () {
        $periode = Periode::factory()->create();
        $komsat = Komsat::factory()->create();
        $divisi = Divisi::factory()->for($komsat)->create();

        $this->actingAs($this->mahasiswa)->get(route('admin.periode.index'))->assertForbidden();
        $this->actingAs($this->mahasiswa)->post(route('admin.periode.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->put(route('admin.periode.update', $periode), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->patch(route('admin.periode.toggle-aktif', $periode), ['aktif' => true])->assertForbidden();
        $this->actingAs($this->mahasiswa)->delete(route('admin.periode.destroy', $periode))->assertForbidden();

        $this->actingAs($this->mahasiswa)->get(route('admin.komsat.index'))->assertForbidden();
        $this->actingAs($this->mahasiswa)->post(route('admin.komsat.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->patch(route('admin.komsat.toggle-aktif', $komsat), ['aktif' => false])->assertForbidden();
        $this->actingAs($this->mahasiswa)->delete(route('admin.komsat.destroy', $komsat))->assertForbidden();

        $this->actingAs($this->mahasiswa)->get(route('admin.divisi.index'))->assertForbidden();
        $this->actingAs($this->mahasiswa)->post(route('admin.divisi.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->patch(route('admin.divisi.toggle-aktif', $divisi), ['aktif' => false])->assertForbidden();
        $this->actingAs($this->mahasiswa)->delete(route('admin.divisi.destroy', $divisi))->assertForbidden();
    });

    test('internal manajemen can view all master data pages', function () {
        $this->actingAs($this->internal)->get(route('admin.periode.index'))->assertOk();
        $this->actingAs($this->internal)->get(route('admin.komsat.index'))->assertOk();
        $this->actingAs($this->internal)->get(route('admin.divisi.index'))->assertOk();
    });
});

describe('Periode', function () {
    test('can create, search, and update periode with audit logs', function () {
        $this->actingAs($this->internal)->post(route('admin.periode.store'), [
            'nama' => 'Periode 2026/2027',
            'tanggal_mulai' => '2026-01-01',
            'tanggal_selesai' => '2026-12-31',
        ])->assertRedirect();

        $periode = Periode::query()->where('nama', 'Periode 2026/2027')->firstOrFail();

        expect(AuditLog::query()->where('aksi', 'periode.created')->where('subject_id', $periode->id)->exists())->toBeTrue();

        $this->actingAs($this->internal)->get(route('admin.periode.index', ['q' => '2026']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/periode/index')
                ->has('periode.data', 1)
                ->where('periode.data.0.nama', 'Periode 2026/2027')
            );

        $this->actingAs($this->internal)->put(route('admin.periode.update', $periode), [
            'nama' => 'Periode Diperbarui',
            'tanggal_mulai' => '2026-01-01',
            'tanggal_selesai' => '2027-01-01',
        ])->assertRedirect();

        expect($periode->fresh()->nama)->toBe('Periode Diperbarui');
        expect(AuditLog::query()->where('aksi', 'periode.updated')->where('subject_id', $periode->id)->exists())->toBeTrue();
    });

    test('rejects tanggal selesai earlier than tanggal mulai', function () {
        $response = $this->actingAs($this->internal)->post(route('admin.periode.store'), [
            'nama' => 'Periode Invalid',
            'tanggal_mulai' => '2026-12-31',
            'tanggal_selesai' => '2026-01-01',
        ]);

        $response->assertSessionHasErrors('tanggal_selesai');
        $this->assertDatabaseMissing('periode', ['nama' => 'Periode Invalid']);
    });

    test('allows only one active periode when toggling or creating active periode', function () {
        $first = Periode::factory()->create(['aktif' => true]);
        $second = Periode::factory()->create(['aktif' => false]);

        $this->actingAs($this->internal)
            ->patch(route('admin.periode.toggle-aktif', $second), ['aktif' => true])
            ->assertRedirect();

        expect($first->fresh()->aktif)->toBeFalse()
            ->and($second->fresh()->aktif)->toBeTrue()
            ->and(Periode::query()->where('aktif', true)->count())->toBe(1)
            ->and(AuditLog::query()->where('aksi', 'periode.activated')->where('subject_id', $second->id)->exists())->toBeTrue();

        $this->actingAs($this->internal)->post(route('admin.periode.store'), [
            'nama' => 'Periode Baru Aktif',
            'tanggal_mulai' => '2027-01-01',
            'tanggal_selesai' => '2027-12-31',
            'aktif' => true,
        ])->assertRedirect();

        expect($second->fresh()->aktif)->toBeFalse()
            ->and(Periode::query()->where('aktif', true)->count())->toBe(1);
    });

    test('rejects deleting periode used by kepengurusan', function () {
        $periode = Periode::factory()->create();
        Kepengurusan::factory()->for($periode)->create();

        $response = $this->actingAs($this->internal)->delete(route('admin.periode.destroy', $periode));
        $response->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('periode', ['id' => $periode->id]);
    });

    test('can delete unbound periode', function () {
        $periode = Periode::factory()->create();

        $this->actingAs($this->internal)->delete(route('admin.periode.destroy', $periode))->assertRedirect();
        $this->assertDatabaseMissing('periode', ['id' => $periode->id]);
    });
});

describe('Komsat', function () {
    test('seeder populates exact 5 official komsat codes', function () {
        $this->seed(KomsatSeeder::class);

        $codes = Komsat::query()->orderBy('id')->pluck('kode')->all();
        expect($codes)->toBe(['UNG', 'IAIN', 'UG', 'UMGO', 'UBM']);
    });

    test('can create, update, and toggle komsat with uppercase unique code and audit logs', function () {
        $this->actingAs($this->internal)->post(route('admin.komsat.store'), [
            'kode' => 'ung',
            'nama' => 'Universitas Negeri Gorontalo',
        ])->assertRedirect();

        $komsat = Komsat::query()->where('kode', 'UNG')->firstOrFail();
        expect($komsat->aktif)->toBeTrue();
        expect(AuditLog::query()->where('aksi', 'komsat.created')->where('subject_id', $komsat->id)->exists())->toBeTrue();

        $duplicate = $this->actingAs($this->internal)->post(route('admin.komsat.store'), [
            'kode' => 'ung',
            'nama' => 'Duplikat UNG',
        ]);
        $duplicate->assertSessionHasErrors('kode');

        $this->actingAs($this->internal)->put(route('admin.komsat.update', $komsat), [
            'kode' => 'ung',
            'nama' => 'UNG Gorontalo',
        ])->assertRedirect();
        expect($komsat->fresh()->nama)->toBe('UNG Gorontalo');

        $this->actingAs($this->internal)->patch(route('admin.komsat.toggle-aktif', $komsat), ['aktif' => false])->assertRedirect();
        expect($komsat->fresh()->aktif)->toBeFalse();
        expect(AuditLog::query()->where('aksi', 'komsat.deactivated')->where('subject_id', $komsat->id)->exists())->toBeTrue();
    });

    test('rejects deleting komsat bound to divisi or mahasiswa', function () {
        $komsatWithDivisi = Komsat::factory()->create();
        Divisi::factory()->for($komsatWithDivisi)->create();

        $this->actingAs($this->internal)->delete(route('admin.komsat.destroy', $komsatWithDivisi))
            ->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('komsat', ['id' => $komsatWithDivisi->id]);

        $komsatWithMahasiswa = Komsat::factory()->create();
        $divisi = Divisi::factory()->for($komsatWithMahasiswa)->create();
        Mahasiswa::factory()->for($komsatWithMahasiswa)->for($divisi)->create();

        $this->actingAs($this->internal)->delete(route('admin.komsat.destroy', $komsatWithMahasiswa))
            ->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('komsat', ['id' => $komsatWithMahasiswa->id]);
    });

    test('can delete unbound komsat', function () {
        $komsat = Komsat::factory()->create();
        $this->actingAs($this->internal)->delete(route('admin.komsat.destroy', $komsat))->assertRedirect();
        $this->assertDatabaseMissing('komsat', ['id' => $komsat->id]);
    });
});

describe('Divisi', function () {
    test('requires unique name per komsat, allows same name across komsat, and supports komsat filter', function () {
        $first = Komsat::factory()->create(['kode' => 'UNG']);
        $second = Komsat::factory()->create(['kode' => 'IAIN']);
        Divisi::factory()->for($first)->create(['nama' => 'Pendidikan']);

        $duplicate = $this->actingAs($this->internal)->post(route('admin.divisi.store'), [
            'komsat_id' => $first->id,
            'nama' => 'Pendidikan',
        ]);
        $duplicate->assertSessionHasErrors('nama');

        $allowed = $this->actingAs($this->internal)->post(route('admin.divisi.store'), [
            'komsat_id' => $second->id,
            'nama' => 'Pendidikan',
        ]);
        $allowed->assertRedirect();

        $divisi = Divisi::query()->where('komsat_id', $second->id)->firstOrFail();

        $this->actingAs($this->internal)->put(route('admin.divisi.update', $divisi), [
            'komsat_id' => $second->id,
            'nama' => 'Pendidikan dan Kebudayaan',
        ])->assertRedirect();
        expect($divisi->fresh()->nama)->toBe('Pendidikan dan Kebudayaan');

        $this->actingAs($this->internal)->patch(route('admin.divisi.toggle-aktif', $divisi), ['aktif' => false])->assertRedirect();
        expect($divisi->fresh()->aktif)->toBeFalse();

        $this->actingAs($this->internal)->get(route('admin.divisi.index', ['komsat_id' => $second->id]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/divisi/index')
                ->has('divisi.data', 1)
                ->where('divisi.data.0.nama', 'Pendidikan dan Kebudayaan')
            );
    });

    test('rejects deleting divisi bound to mahasiswa', function () {
        $komsat = Komsat::factory()->create();
        $divisi = Divisi::factory()->for($komsat)->create();
        Mahasiswa::factory()->for($komsat)->for($divisi)->create();

        $response = $this->actingAs($this->internal)->delete(route('admin.divisi.destroy', $divisi));
        $response->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('divisi', ['id' => $divisi->id]);
    });

    test('can delete unbound divisi', function () {
        $divisi = Divisi::factory()->create();
        $this->actingAs($this->internal)->delete(route('admin.divisi.destroy', $divisi))->assertRedirect();
        $this->assertDatabaseMissing('divisi', ['id' => $divisi->id]);
    });
});
