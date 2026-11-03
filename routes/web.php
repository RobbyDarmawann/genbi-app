<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
    });

    // Dashboard Mahasiswa
    Route::middleware(['mahasiswa.active'])->group(function () {
        Route::inertia('mahasiswa/dashboard', 'mahasiswa/dashboard')->name('mahasiswa.dashboard');
    });
});

require __DIR__.'/settings.php';
