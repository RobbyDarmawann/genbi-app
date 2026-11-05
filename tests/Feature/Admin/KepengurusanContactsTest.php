<?php

use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Periode;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('internal_manajemen');
});

test('normalized instagram handles are saved without @ prefix or URL', function () {
    $periode = Periode::factory()->create(['aktif' => true]);

    $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User',
        'jabatan' => 'Ketua',
        'urutan' => 1,
        'instagram' => '@genbigorontalo',
    ])->assertRedirect();

    $kepengurusan = Kepengurusan::first();
    expect($kepengurusan->instagram)->toBe('genbigorontalo');

    $this->actingAs($this->admin)->put(route('admin.kepengurusan.update', $kepengurusan), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User',
        'jabatan' => 'Ketua',
        'urutan' => 1,
        'instagram' => 'https://instagram.com/genbigtofficial',
    ])->assertRedirect();

    expect($kepengurusan->fresh()->instagram)->toBe('genbigtofficial');
});

test('phone number validation accepts indonesian formats and rejects invalid patterns', function () {
    $periode = Periode::factory()->create(['aktif' => true]);

    // Valid formats
    $validNumbers = ['081234567890', '08123456789', '+6281234567890', '6281234567890'];
    foreach ($validNumbers as $idx => $number) {
        $response = $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
            'periode_id' => $periode->id,
            'komsat_id' => null,
            'nama_tampil' => "Test User {$idx}",
            'jabatan' => "Anggota {$idx}",
            'urutan' => $idx + 1,
            'no_hp' => $number,
        ]);
        $response->assertSessionHasNoErrors();
    }

    // Too short
    $response = $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User2',
        'jabatan' => 'Sekretaris',
        'urutan' => 2,
        'no_hp' => '08123',
    ]);
    $response->assertSessionHasErrors('no_hp');

    // Invalid prefix
    $response = $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User3',
        'jabatan' => 'Bendahara',
        'urutan' => 3,
        'no_hp' => '091234567890',
    ]);
    $response->assertSessionHasErrors('no_hp');
});

test('email validation rejects malformed addresses', function () {
    $periode = Periode::factory()->create(['aktif' => true]);

    $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User',
        'jabatan' => 'Ketua',
        'urutan' => 1,
        'email' => 'validaddress@genbi.id',
    ])->assertSessionHasNoErrors();

    $response = $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Test User 2',
        'jabatan' => 'Sekretaris',
        'urutan' => 2,
        'email' => 'not-an-email',
    ]);
    $response->assertSessionHasErrors('email');
});

test('migration splits legacy kontak into structured fields correctly', function () {
    $periode = Periode::factory()->create();

    $migration = require base_path('database/migrations/2026_11_05_004203_add_structured_contacts_to_kepengurusan_table.php');
    $migration->down();

    $pengurusPhoneId = DB::table('kepengurusan')->insertGetId([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus HP',
        'jabatan' => 'Ketua',
        'urutan' => 1,
        'kontak' => '0812-3456-7890',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $pengurusEmailId = DB::table('kepengurusan')->insertGetId([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus Email',
        'jabatan' => 'Sekretaris',
        'urutan' => 2,
        'kontak' => 'pengurus@genbi.id',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $pengurusIgId = DB::table('kepengurusan')->insertGetId([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus IG',
        'jabatan' => 'Bendahara',
        'urutan' => 3,
        'kontak' => '@genbigorontalo',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $migration->up();

    $pengurus1 = Kepengurusan::findOrFail($pengurusPhoneId);
    $pengurus2 = Kepengurusan::findOrFail($pengurusEmailId);
    $pengurus3 = Kepengurusan::findOrFail($pengurusIgId);

    expect($pengurus1->no_hp)->toBe('081234567890')
        ->and($pengurus1->instagram)->toBeNull()
        ->and($pengurus1->email)->toBeNull();

    expect($pengurus2->no_hp)->toBeNull()
        ->and($pengurus2->instagram)->toBeNull()
        ->and($pengurus2->email)->toBe('pengurus@genbi.id');

    expect($pengurus3->no_hp)->toBeNull()
        ->and($pengurus3->instagram)->toBe('genbigorontalo')
        ->and($pengurus3->email)->toBeNull();
});

test('public direktori generates correct whatsapp, instagram, and mailto links', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsat = Komsat::factory()->create(['kode' => 'UNG', 'aktif' => true]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsat->id,
        'nama_tampil' => 'Ahmad Fauzan',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
        'no_hp' => '081234567890',
        'instagram' => 'ahmdfauzan',
        'email' => 'ahmad@genbi.id',
        'kontak' => null,
    ]);

    $response = $this->get(route('public.kepengurusan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('public/kepengurusan')
        ->has('direktori.komsat.UNG', 1)
        ->where('direktori.komsat.UNG.0.no_hp', '081234567890')
        ->where('direktori.komsat.UNG.0.instagram', 'ahmdfauzan')
        ->where('direktori.komsat.UNG.0.email', 'ahmad@genbi.id')
    );
});

test('admin grouped view separates wilayah and komsat sections', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsat = Komsat::factory()->create([
        'kode' => 'UNG',
        'nama' => 'Universitas Negeri Gorontalo',
        'aktif' => true,
    ]);
    $komsatLain = Komsat::factory()->create([
        'kode' => 'IAIN',
        'nama' => 'IAIN Sultan Amai Gorontalo',
        'aktif' => true,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Ketua Wilayah',
        'jabatan' => 'Ketua Umum',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsat->id,
        'nama_tampil' => 'Ketua Komsat UNG',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatLain->id,
        'nama_tampil' => 'Ketua Komsat IAIN',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    DB::enableQueryLog();
    $response = $this->actingAs($this->admin)->get(route('admin.kepengurusan.index'));
    $queries = collect(DB::getQueryLog())->pluck('query');
    DB::disableQueryLog();

    $komsatColumns = Schema::getColumnListing('komsat');
    $komsatSelectQueries = $queries->filter(fn (string $sql): bool => str_contains($sql, 'from "komsat"') || str_contains($sql, 'from `komsat`'));

    foreach ($komsatSelectQueries as $sql) {
        if (preg_match('/^select\s+(.+?)\s+from\s+["`]komsat["`]/i', $sql, $matches) && trim($matches[1]) !== '*') {
            preg_match_all('/["`]([^"`]+)["`]/', $matches[1], $colMatches);
            foreach ($colMatches[1] as $col) {
                expect($komsatColumns)->toContain($col);
            }
        }
    }

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/kepengurusan/index')
        ->has('kepengurusan_grouped.wilayah', 1)
        ->where('kepengurusan_grouped.wilayah.0.nama_tampil', 'Ketua Wilayah')
        ->has('kepengurusan_grouped.komsat_'.$komsat->id.'.items', 1)
        ->where('kepengurusan_grouped.komsat_'.$komsat->id.'.komsat_kode', 'UNG')
        ->where('kepengurusan_grouped.komsat_'.$komsat->id.'.komsat_nama', 'Universitas Negeri Gorontalo')
        ->missing('kepengurusan_grouped.komsat_'.$komsat->id.'.komsat_nama_pt')
        ->where('kepengurusan_grouped.komsat_'.$komsat->id.'.items.0.nama_tampil', 'Ketua Komsat UNG')
        ->has('kepengurusan_grouped.komsat_'.$komsatLain->id.'.items', 1)
        ->where('kepengurusan_grouped.komsat_'.$komsatLain->id.'.komsat_kode', 'IAIN')
        ->where('kepengurusan_grouped.komsat_'.$komsatLain->id.'.komsat_nama', 'IAIN Sultan Amai Gorontalo')
        ->missing('kepengurusan_grouped.komsat_'.$komsatLain->id.'.komsat_nama_pt')
        ->where('kepengurusan_grouped.komsat_'.$komsatLain->id.'.items.0.nama_tampil', 'Ketua Komsat IAIN')
    );
});

test('reorder swaps urutan within the same group only', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsat = Komsat::factory()->create(['kode' => 'UNG', 'aktif' => true]);

    $wilayah1 = Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Wilayah 1',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    $wilayah2 = Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Wilayah 2',
        'jabatan' => 'Sekretaris',
        'urutan' => 2,
    ]);

    $komsat1 = Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsat->id,
        'nama_tampil' => 'Komsat 1',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    // Reorder wilayah2 up
    $this->actingAs($this->admin)
        ->patch(route('admin.kepengurusan.reorder', $wilayah2), ['direction' => 'up'])
        ->assertRedirect();

    expect($wilayah1->fresh()->urutan)->toBe(2)
        ->and($wilayah2->fresh()->urutan)->toBe(1)
        ->and($komsat1->fresh()->urutan)->toBe(1); // Unchanged

    // Try to reorder beyond bounds
    $response = $this->actingAs($this->admin)
        ->patch(route('admin.kepengurusan.reorder', $wilayah2), ['direction' => 'up']);
    $response->assertSessionHasErrors('direction');
});

test('guest and mahasiswa cannot reorder kepengurusan', function () {
    $periode = Periode::factory()->create();
    $item = Kepengurusan::factory()->create(['periode_id' => $periode->id]);

    $this->patch(route('admin.kepengurusan.reorder', $item), ['direction' => 'up'])
        ->assertRedirect(route('login'));

    $mahasiswa = User::factory()->create();
    $mahasiswa->assignRole('mahasiswa');

    $this->actingAs($mahasiswa)
        ->patch(route('admin.kepengurusan.reorder', $item), ['direction' => 'up'])
        ->assertForbidden();
});

test('admin kepengurusan options include student phone and email for prefill', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsat = Komsat::factory()->create(['kode' => 'UNG', 'aktif' => true]);
    $user = User::factory()->create(['email' => 'mhs.demo@genbi.id']);
    $user->assignRole('mahasiswa');

    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $user->id,
        'komsat_id' => $komsat->id,
        'no_hp' => '081234567899',
        'aktif' => true,
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.kepengurusan.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/kepengurusan/index')
        ->where('options.mahasiswa', function ($items) use ($mahasiswa) {
            return collect($items)->contains(fn ($item) => $item['id'] === $mahasiswa->id &&
                $item['no_hp'] === '081234567899' &&
                $item['email'] === 'mhs.demo@genbi.id'
            );
        })
    );
});

test('saving board member with manually modified contact values persists the manual input without altering student biodata', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $user = User::factory()->create(['email' => 'asli@genbi.id']);
    $user->assignRole('mahasiswa');
    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $user->id,
        'no_hp' => '081111111111',
        'aktif' => true,
    ]);

    $this->actingAs($this->admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'mahasiswa_id' => $mahasiswa->id,
        'nama_tampil' => 'Nama Khusus Pengurus',
        'jabatan' => 'Koordinator Divisi',
        'urutan' => 1,
        'no_hp' => '082222222222',
        'email' => 'pengurus.resmi@genbi.id',
    ])->assertRedirect();

    $saved = Kepengurusan::query()->where('mahasiswa_id', $mahasiswa->id)->firstOrFail();
    expect($saved->no_hp)->toBe('082222222222')
        ->and($saved->email)->toBe('pengurus.resmi@genbi.id');

    expect($mahasiswa->fresh()->no_hp)->toBe('081111111111')
        ->and($user->fresh()->email)->toBe('asli@genbi.id');
});
