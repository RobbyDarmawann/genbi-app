<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa?->load(['komsat:id,kode,nama', 'divisi:id,nama']);

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'mahasiswa' => $mahasiswa ? [
                'username' => $request->user()->username,
                'nim' => $mahasiswa->nim,
                'email' => $request->user()->email,
                'komsat' => $mahasiswa->komsat?->nama,
                'divisi' => $mahasiswa->divisi?->nama,
                'angkatan' => $mahasiswa->angkatan,
                'status_penerima' => $mahasiswa->status_penerima->label(),
                'jenis_kelamin' => $mahasiswa->jenis_kelamin,
                'agama' => $mahasiswa->agama,
                'golongan_darah' => $mahasiswa->golongan_darah,
                'tanggal_lahir' => $mahasiswa->tanggal_lahir,
                'domisili' => $mahasiswa->domisili,
                'no_hp' => $mahasiswa->no_hp,
                'foto_url' => $mahasiswa->foto_path ? asset('storage/'.$mahasiswa->foto_path) : null,
            ] : null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil berhasil diperbarui.']);

        return to_route('profile.edit');
    }
}
