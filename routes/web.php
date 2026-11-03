<?php

use App\Http\Controllers\Admin\DivisiController;
use App\Http\Controllers\Admin\KegiatanController as AdminKegiatanController;
use App\Http\Controllers\Admin\KomsatController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\MonitoringKegiatanController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\PesertaKegiatanController;
use App\Http\Controllers\KehadiranFotoController;
use App\Http\Controllers\Mahasiswa\AbsensiController;
use App\Http\Controllers\Mahasiswa\DashboardController as MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\KegiatanController as MahasiswaKegiatanController;
use App\Http\Controllers\Mahasiswa\RiwayatController;
use App\Http\Controllers\Public\JadwalController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('jadwal', [JadwalController::class, 'index'])->name('public.jadwal');
Route::get('jadwal/{kegiatan}', [JadwalController::class, 'show'])->name('public.jadwal.show');
Route::inertia('statistik', 'public/placeholder', ['module' => 'Statistik'])->name('public.statistik');
Route::inertia('kepengurusan', 'public/placeholder', ['module' => 'Kepengurusan'])->name('public.kepengurusan');

Route::middleware(['auth'])->group(function () {
    // Generic dashboard redirector - delegates to role-specific dashboards
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('internal_manajemen')) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->hasRole('mahasiswa')) {
            return redirect()->route('mahasiswa.dashboard');
        }

        // Fallback: user without valid role
        abort(403, 'Anda tidak memiliki akses ke dashboard.');
    })->name('dashboard');

    // Dashboard & Modul Internal Manajemen
    Route::middleware(['role:internal_manajemen'])->prefix('admin')->name('admin.')->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
        Route::resource('kegiatan', AdminKegiatanController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update'])
            ->parameters(['kegiatan' => 'kegiatan']);
        Route::patch('kegiatan/{kegiatan}/status', [AdminKegiatanController::class, 'updateStatus'])->name('kegiatan.update-status');
        Route::get('kegiatan/{kegiatan}/peserta', [PesertaKegiatanController::class, 'index'])->name('kegiatan.peserta.index');
        Route::patch('kegiatan/{kegiatan}/peserta/{pendaftaran}/peran', [PesertaKegiatanController::class, 'changeRole'])
            ->name('kegiatan.peserta.ubah-peran');
        Route::delete('kegiatan/{kegiatan}/peserta/{pendaftaran}', [PesertaKegiatanController::class, 'cancel'])
            ->name('kegiatan.peserta.batal');

        // Monitoring kehadiran dan finalisasi kegiatan
        Route::get('kegiatan/{kegiatan}/monitoring', [MonitoringKegiatanController::class, 'show'])->name('kegiatan.monitoring');
        Route::post('kegiatan/{kegiatan}/kehadiran/{kehadiran}/review', [MonitoringKegiatanController::class, 'reviewAttendance'])
            ->name('kegiatan.kehadiran.review');
        Route::post('kegiatan/{kegiatan}/selesai', [MonitoringKegiatanController::class, 'complete'])->name('kegiatan.complete');
        Route::post('kegiatan/{kegiatan}/kunci', [MonitoringKegiatanController::class, 'lock'])->name('kegiatan.lock');

        // Anggota (Mahasiswa)
        Route::resource('mahasiswa', MahasiswaController::class)
            ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
            ->parameters(['mahasiswa' => 'mahasiswa']);
        Route::post('mahasiswa/{mahasiswa}/reset-password', [MahasiswaController::class, 'resetPassword'])->name('mahasiswa.reset-password');
        Route::patch('mahasiswa/{mahasiswa}/aktif', [MahasiswaController::class, 'toggleAktif'])->name('mahasiswa.toggle-aktif');

        // Master Data: Periode, Komsat, Divisi
        Route::resource('periode', PeriodeController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['periode' => 'periode']);
        Route::patch('periode/{periode}/aktif', [PeriodeController::class, 'toggleAktif'])->name('periode.toggle-aktif');

        Route::resource('komsat', KomsatController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['komsat' => 'komsat']);
        Route::patch('komsat/{komsat}/aktif', [KomsatController::class, 'toggleAktif'])->name('komsat.toggle-aktif');

        Route::resource('divisi', DivisiController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['divisi' => 'divisi']);
        Route::patch('divisi/{divisi}/aktif', [DivisiController::class, 'toggleAktif'])->name('divisi.toggle-aktif');

        Route::get('kehadiran', [MonitoringKegiatanController::class, 'index'])->name('kehadiran.index');
        Route::inertia('koreksi', 'admin/placeholder', ['module' => 'Koreksi'])->name('koreksi.index');
        Route::inertia('rekap', 'admin/placeholder', ['module' => 'Laporan'])->name('rekap.index');
        Route::inertia('kepengurusan', 'admin/placeholder', ['module' => 'Kepengurusan'])->name('kepengurusan.index');
    });

    // Dashboard Mahasiswa
    Route::middleware(['mahasiswa.active'])->group(function () {
        Route::get('mahasiswa/dashboard', [MahasiswaDashboardController::class, 'index'])->name('mahasiswa.dashboard');
        Route::get('kegiatan', [MahasiswaKegiatanController::class, 'index'])->name('mahasiswa.kegiatan.index');
        Route::get('kegiatan/{kegiatan}', [MahasiswaKegiatanController::class, 'show'])->name('mahasiswa.kegiatan.show');
        Route::post('kegiatan/{kegiatan}/daftar', [MahasiswaKegiatanController::class, 'daftar'])->name('mahasiswa.kegiatan.daftar');
        Route::delete('kegiatan/{kegiatan}/batal', [MahasiswaKegiatanController::class, 'batal'])->name('mahasiswa.kegiatan.batal');
        Route::get('kegiatan/{kegiatan}/absen', [AbsensiController::class, 'create'])->name('mahasiswa.absensi.form');
        Route::post('kegiatan/{kegiatan}/absen', [AbsensiController::class, 'store'])
            ->middleware('throttle:absensi-submit')
            ->name('mahasiswa.absensi.submit');
        Route::get('kehadiran', [RiwayatController::class, 'kehadiran'])->name('mahasiswa.kehadiran.index');
        Route::get('poin/riwayat', [RiwayatController::class, 'poin'])->name('mahasiswa.poin.riwayat');
        Route::inertia('koreksi', 'mahasiswa/placeholder', ['module' => 'Koreksi'])->name('mahasiswa.koreksi.index');
        Route::inertia('mahasiswa/kepengurusan', 'mahasiswa/placeholder', ['module' => 'Kepengurusan'])->name('mahasiswa.kepengurusan.index');
    });

    Route::get('kehadiran/{kehadiran}/foto', KehadiranFotoController::class)->name('kehadiran.foto');
});

require __DIR__.'/settings.php';
