<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMahasiswaAktif
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if (! $request->user()->hasRole('mahasiswa')) {
            abort(403, 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        $mahasiswa = $request->user()->mahasiswa;

        if (! $mahasiswa || ! $mahasiswa->aktif) {
            abort(403, 'Akses ditolak. Anda tidak memiliki profil mahasiswa aktif.');
        }

        return $next($request);
    }
}
