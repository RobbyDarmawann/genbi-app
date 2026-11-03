<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KehadiranFotoController extends Controller
{
    public function __invoke(Kehadiran $kehadiran): StreamedResponse
    {
        Gate::authorize('viewFoto', $kehadiran);

        abort_if($kehadiran->foto_path === null, 404);

        $disk = Storage::disk('absensi');
        abort_unless($disk->exists($kehadiran->foto_path), 404);

        return $disk->response($kehadiran->foto_path, headers: [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
