<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Actions\Mahasiswa\UpdateBiodataAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\UpdateBiodataRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BiodataController extends Controller
{
    public function edit(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;
        abort_if($mahasiswa === null, 403);

        $mahasiswa->load(['user:id,name,username,email', 'komsat:id,kode,nama', 'divisi:id,nama']);

        return Inertia::render('mahasiswa/biodata/edit', [
            'mahasiswa' => [
                'id' => $mahasiswa->id,
                'name' => $mahasiswa->user->name,
                'username' => $mahasiswa->user->username,
                'email' => $mahasiswa->user->email,
                'nim' => $mahasiswa->nim,
                'angkatan' => $mahasiswa->angkatan,
                'komsat' => $mahasiswa->komsat ? [
                    'id' => $mahasiswa->komsat->id,
                    'kode' => $mahasiswa->komsat->kode,
                    'nama' => $mahasiswa->komsat->nama,
                ] : null,
                'divisi' => $mahasiswa->divisi ? [
                    'id' => $mahasiswa->divisi->id,
                    'nama' => $mahasiswa->divisi->nama,
                ] : null,
                'status_penerima_label' => $mahasiswa->status_penerima->label(),
                'jenis_kelamin' => $mahasiswa->jenis_kelamin,
                'agama' => $mahasiswa->agama,
                'golongan_darah' => $mahasiswa->golongan_darah,
                'tanggal_lahir' => $mahasiswa->tanggal_lahir,
                'domisili' => $mahasiswa->domisili,
                'no_hp' => $mahasiswa->no_hp,
                'foto_url' => $mahasiswa->foto_path ? asset('storage/'.$mahasiswa->foto_path) : null,
            ],
        ]);
    }

    public function update(UpdateBiodataRequest $request, UpdateBiodataAction $action): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        abort_if($mahasiswa === null, 403);

        $validated = $request->validated();
        $validated['foto'] = $request->file('foto');
        $validated['hapus_foto'] = $request->boolean('hapus_foto');

        $action->handle($mahasiswa, $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data diri berhasil diperbarui.']);

        return back();
    }
}
