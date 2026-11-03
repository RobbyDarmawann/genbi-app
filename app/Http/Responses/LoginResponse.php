<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasRole('internal_manajemen')) {
            return redirect()->intended(route('admin.dashboard'));
        }

        if ($user->hasRole('mahasiswa')) {
            return redirect()->intended(route('mahasiswa.dashboard'));
        }

        // Fallback: user tanpa role yang jelas, logout paksa
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->withErrors([
            'username' => 'Akun Anda tidak memiliki role yang valid. Silakan hubungi administrator.',
        ]);
    }
}
