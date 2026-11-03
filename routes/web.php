<?php

use App\Http\Controllers\Admin\DivisiController;
use App\Http\Controllers\Admin\KomsatController;
use App\Http\Controllers\Admin\PeriodeController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('jadwal', 'public/placeholder', ['module' => 'Aktivitas'])->name('public.jadwal');
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
        Route::inertia('kegiatan', 'admin/placeholder', ['module' => 'Kegiatan'])->name('kegiatan.index');
        Route::inertia('mahasiswa', 'admin/placeholder', ['module' => 'Anggota'])->name('mahasiswa.index');

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

        Route::inertia('kehadiran', 'admin/placeholder', ['module' => 'Kehadiran'])->name('kehadiran.index');
        Route::inertia('koreksi', 'admin/placeholder', ['module' => 'Koreksi'])->name('koreksi.index');
        Route::inertia('rekap', 'admin/placeholder', ['module' => 'Laporan'])->name('rekap.index');
        Route::inertia('kepengurusan', 'admin/placeholder', ['module' => 'Kepengurusan'])->name('kepengurusan.index');
    });

    // Dashboard Mahasiswa
    Route::middleware(['mahasiswa.active'])->group(function () {
        Route::inertia('mahasiswa/dashboard', 'mahasiswa/dashboard')->name('mahasiswa.dashboard');
        Route::inertia('kegiatan', 'mahasiswa/placeholder', ['module' => 'Kegiatan Saya'])->name('mahasiswa.kegiatan.index');
        Route::inertia('kehadiran', 'mahasiswa/placeholder', ['module' => 'Riwayat Kehadiran'])->name('mahasiswa.kehadiran.index');
        Route::inertia('poin/riwayat', 'mahasiswa/placeholder', ['module' => 'Poin Saya'])->name('mahasiswa.poin.riwayat');
        Route::inertia('koreksi', 'mahasiswa/placeholder', ['module' => 'Koreksi'])->name('mahasiswa.koreksi.index');
        Route::inertia('mahasiswa/kepengurusan', 'mahasiswa/placeholder', ['module' => 'Kepengurusan'])->name('mahasiswa.kepengurusan.index');
    });
});

require __DIR__.'/settings.php';
