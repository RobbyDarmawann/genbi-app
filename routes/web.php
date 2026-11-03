<?php

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

    // Dashboard Internal Manajemen
    Route::middleware(['role:internal_manajemen'])->group(function () {
        Route::inertia('admin/dashboard', 'admin/dashboard')->name('admin.dashboard');
        Route::inertia('admin/kegiatan', 'admin/placeholder', ['module' => 'Kegiatan'])->name('admin.kegiatan.index');
        Route::inertia('admin/mahasiswa', 'admin/placeholder', ['module' => 'Anggota'])->name('admin.mahasiswa.index');
        Route::inertia('admin/komsat', 'admin/placeholder', ['module' => 'Master Data'])->name('admin.komsat.index');
        Route::inertia('admin/kehadiran', 'admin/placeholder', ['module' => 'Kehadiran'])->name('admin.kehadiran.index');
        Route::inertia('admin/koreksi', 'admin/placeholder', ['module' => 'Koreksi'])->name('admin.koreksi.index');
        Route::inertia('admin/rekap', 'admin/placeholder', ['module' => 'Laporan'])->name('admin.rekap.index');
        Route::inertia('admin/kepengurusan', 'admin/placeholder', ['module' => 'Kepengurusan'])->name('admin.kepengurusan.index');
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
