<?php

namespace Tests\Feature\Jadwal;

use App\Enums\StatusKegiatan;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class JadwalOrderingPaginationTest extends TestCase
{
    use RefreshDatabase;

    private User $internal;

    private User $mahasiswaUser;

    private Mahasiswa $mahasiswa;

    private Divisi $divisiUng;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);

        $this->internal = User::factory()->create();
        $this->internal->assignRole('internal_manajemen');

        $komsatUng = Komsat::factory()->create(['kode' => 'UNG', 'nama' => 'Universitas Negeri Gorontalo']);
        $this->divisiUng = Divisi::factory()->create(['komsat_id' => $komsatUng->id, 'nama' => 'Pendidikan']);

        $this->mahasiswaUser = User::factory()->create();
        $this->mahasiswaUser->assignRole('mahasiswa');

        $this->mahasiswa = Mahasiswa::factory()->create([
            'user_id' => $this->mahasiswaUser->id,
            'komsat_id' => $komsatUng->id,
            'divisi_id' => $this->divisiUng->id,
            'aktif' => true,
        ]);
    }

    public function test_jadwal_urut_kronologis_mendatang_terlebih_dahulu_disusul_yang_sudah_lewat(): void
    {
        // Tetapkan waktu server acuan: 2026-11-05 10:00:00 WITA
        Carbon::setTestNow('2026-11-05 10:00:00');

        // 1. Sedang berlangsung hari ini (jam selesai 13:00 >= 10:00)
        $kegiatanHariIni = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Hari Ini Berlangsung',
            'status' => StatusKegiatan::Berlangsung,
            'tanggal' => '2026-11-05',
            'jam_mulai' => '09:00:00',
            'jam_selesai' => '13:00:00',
            'dibuat_oleh' => $this->internal->id,
        ]);

        // 2. Mendatang lusa
        $kegiatanLusa = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Mendatang Lusa',
            'status' => StatusKegiatan::Terbit,
            'tanggal' => '2026-11-08',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'dibuat_oleh' => $this->internal->id,
        ]);

        // 3. Mendatang minggu depan
        $kegiatanMingguDepan = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Mendatang Minggu Depan',
            'status' => StatusKegiatan::Terbit,
            'tanggal' => '2026-11-15',
            'jam_mulai' => '09:00:00',
            'jam_selesai' => '14:00:00',
            'dibuat_oleh' => $this->internal->id,
        ]);

        // 4. Baru selesai kemarin
        $kegiatanKemarin = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Kemarin Selesai',
            'status' => StatusKegiatan::Selesai,
            'tanggal' => '2026-11-04',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'dibuat_oleh' => $this->internal->id,
        ]);

        // 5. Sudah lama selesai (bulan lalu)
        $kegiatanLama = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Bulan Lalu Terkunci',
            'status' => StatusKegiatan::Terkunci,
            'tanggal' => '2026-10-15',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'dibuat_oleh' => $this->internal->id,
        ]);

        $response = $this->get(route('public.jadwal'));
        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('public/jadwal')
            ->has('kegiatan.data', 5)
            // Mendatang / berlangsung urut tanggal ASC
            ->where('kegiatan.data.0.judul', 'Kegiatan Hari Ini Berlangsung')
            ->where('kegiatan.data.1.judul', 'Kegiatan Mendatang Lusa')
            ->where('kegiatan.data.2.judul', 'Kegiatan Mendatang Minggu Depan')
            // Yang sudah lewat urut tanggal DESC
            ->where('kegiatan.data.3.judul', 'Kegiatan Kemarin Selesai')
            ->where('kegiatan.data.4.judul', 'Kegiatan Bulan Lalu Terkunci')
        );

        Carbon::setTestNow();
    }

    public function test_jadwal_publik_menerapkan_paginasi_9_item_per_halaman(): void
    {
        Carbon::setTestNow('2026-11-01 08:00:00');

        // Buat 12 kegiatan terbit
        for ($i = 1; $i <= 12; $i++) {
            $tanggal = sprintf('2026-11-%02d', $i + 1);
            Kegiatan::factory()->create([
                'judul' => "Kegiatan Batch #{$i}",
                'status' => StatusKegiatan::Terbit,
                'tanggal' => $tanggal,
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '12:00:00',
                'dibuat_oleh' => $this->internal->id,
            ]);
        }

        // Halaman 1
        $responsePage1 = $this->get(route('public.jadwal'));
        $responsePage1->assertOk();
        $responsePage1->assertInertia(fn (Assert $page) => $page
            ->component('public/jadwal')
            ->has('kegiatan.data', 9)
            ->where('kegiatan.current_page', 1)
            ->where('kegiatan.total', 12)
            ->where('kegiatan.per_page', 9)
            ->where('kegiatan.last_page', 2)
        );

        // Halaman 2
        $responsePage2 = $this->get(route('public.jadwal', ['page' => 2]));
        $responsePage2->assertOk();
        $responsePage2->assertInertia(fn (Assert $page) => $page
            ->component('public/jadwal')
            ->has('kegiatan.data', 3)
            ->where('kegiatan.current_page', 2)
            ->where('kegiatan.total', 12)
        );

        Carbon::setTestNow();
    }

    public function test_kegiatan_mahasiswa_menerapkan_paginasi_9_item_dan_parameter_halaman_terisolasi(): void
    {
        Carbon::setTestNow('2026-11-01 08:00:00');

        // Buat 11 kegiatan ditargetkan untuk divisi mahasiswa
        for ($i = 1; $i <= 11; $i++) {
            $kegiatan = Kegiatan::factory()->create([
                'judul' => "Kegiatan Divisi #{$i}",
                'status' => StatusKegiatan::Terbit,
                'tanggal' => sprintf('2026-11-%02d', $i + 1),
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '12:00:00',
                'dibuat_oleh' => $this->internal->id,
            ]);
            $kegiatan->divisiTarget()->sync([$this->divisiUng->id]);
        }

        // Tab "untuk_saya": halaman 1
        $responseUntukSayaPage1 = $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', ['tab' => 'untuk_saya']));
        $responseUntukSayaPage1->assertOk();
        $responseUntukSayaPage1->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/kegiatan/index')
            ->has('kegiatan.data', 9)
            ->where('kegiatan.current_page', 1)
            ->where('kegiatan.total', 11)
            ->where('kegiatan.last_page', 2)
        );

        // Tab "untuk_saya": halaman 2 dengan parameter halaman_untuk_saya
        $responseUntukSayaPage2 = $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', ['tab' => 'untuk_saya', 'halaman_untuk_saya' => 2]));
        $responseUntukSayaPage2->assertOk();
        $responseUntukSayaPage2->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/kegiatan/index')
            ->has('kegiatan.data', 2)
            ->where('kegiatan.current_page', 2)
            ->where('kegiatan.total', 11)
        );

        // Tab "semua": halaman 1 dengan parameter halaman_semua
        $responseSemua = $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', ['tab' => 'semua', 'untuk_saya' => 0]));
        $responseSemua->assertOk();
        $responseSemua->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/kegiatan/index')
            ->has('kegiatan.data', 9)
            ->where('kegiatan.current_page', 1)
            ->where('kegiatan.total', 11)
        );

        Carbon::setTestNow();
    }
}
