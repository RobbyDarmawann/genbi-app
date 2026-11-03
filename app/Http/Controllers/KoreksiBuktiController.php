<?php

namespace App\Http\Controllers;

use App\Models\Koreksi;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KoreksiBuktiController extends Controller
{
    public function __invoke(Koreksi $koreksi): StreamedResponse
    {
        Gate::authorize('viewBukti', $koreksi);

        abort_if($koreksi->bukti_path === null, 404);
        $disk = Storage::disk('absensi');
        abort_unless($disk->exists($koreksi->bukti_path), 404);

        return $disk->response($koreksi->bukti_path, headers: [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
