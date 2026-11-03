# Rencana Develop — GenBI Gorontalo Terintegrasi (genbigto-app)

Mulai tahap develop: 3 Nov 2026. Stack: Laravel + Inertia + React + Tailwind,
MySQL (Laragon), spatie/laravel-permission, maatwebsite/excel, leaflet,
recharts. Aktor: Guest (publik), Mahasiswa, Internal Manajemen.
Acuan desain: Analisis-Sistem-GenBI-Gorontalo.md (Bagian 5, 6, 11).

## Prasyarat (harus hijau sebelum Fase 1)

1. Ekstensi PHP **zip aktif** di Laragon (PHP → Extensions → zip),
   Laragon Stop → Start All, terminal baru.
2. Verifikasi: `php -m | findstr zip` → muncul `zip`.
3. `composer require spatie/laravel-permission maatwebsite/excel` sukses.
4. `npm install leaflet react-leaflet recharts` sukses.
   (face-api.js TIDAK diinstall — face matching fase 2, di luar MVP A-04.)

## Skema database (urutan migration)

| #   | Tabel                  | Kolom inti                                                                                                                                                                                                                        | Catatan                                                                                                                                       |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | users (modifikasi)     | + username (unik), name, password                                                                                                                                                                                                 | Login pakai **username** (meniru aslinya); role via spatie: `internal_manajemen`, `mahasiswa`. Registrasi publik DIMATIKAN; akun dibuatkan IM |
| 2   | komsat                 | id, kode (UNG/IAIN/UG/UMGO/UBM), nama, aktif                                                                                                                                                                                      | Seed 5 baris — daftar SAH (dokumen 11.2)                                                                                                      |
| 3   | divisi                 | id, komsat_id (FK), nama, aktif                                                                                                                                                                                                   | Mis. divisi-divisi UNG: Pendidikan, KWU, PTD, KMS, LKH, Kominfo                                                                               |
| 4   | mahasiswa              | id, user_id (FK), komsat_id, divisi_id, nim, nama, angkatan, status_penerima (penerima/non/alumni), aktif                                                                                                                         | Satu user mahasiswa = satu baris mahasiswa                                                                                                    |
| 5   | periode                | id, nama (cth 2025–2026), mulai, selesai, aktif                                                                                                                                                                                   | Satu periode aktif                                                                                                                            |
| 6   | kepengurusan           | id, periode_id, komsat_id (nullable=wilayah), mahasiswa_id (nullable), nama_tampil, jabatan, urutan, kontak                                                                                                                       | Mendukung direktori publik + nama non-anggota bila perlu (nama_tampil)                                                                        |
| 7   | kegiatan               | id, judul, deskripsi, komsat_id (penyelenggara), tanggal, jam_mulai, jam_selesai, lokasi_nama, lat, lng, radius_m, absensi_buka, absensi_tutup, kuota (nullable), status (draft/terbit/berlangsung/selesai/terkunci), dibuat_oleh | Window absensi menempel di kegiatan (tanpa tabel sesi terpisah untuk MVP)                                                                     |
| 8   | kegiatan_divisi_target | kegiatan_id, divisi_id                                                                                                                                                                                                            | Pivot: divisi yang boleh ikut (pengganti pilihan bidang di WA)                                                                                |
| 9   | kegiatan_bobot         | kegiatan_id, peran (peserta/panitia/pemateri), poin                                                                                                                                                                               | Bobot per peran di-set IM saat kegiatan dibuat                                                                                                |
| 10  | pendaftaran            | id, kegiatan_id, mahasiswa_id, peran, status (terdaftar/batal), created_at                                                                                                                                                        | UNIQUE(kegiatan_id, mahasiswa_id) — satu peran per kegiatan (A-06)                                                                            |
| 11  | kehadiran              | id, pendaftaran_id (UNIQUE — kunci idempotensi), waktu (server), lat, lng, akurasi_m, jarak_m, foto_path, status (valid/ditolak/menunggu_tinjau), alasan                                                                          | Satu pendaftaran = maks. satu kehadiran                                                                                                       |
| 12  | poin_transaksi         | id, mahasiswa_id, kegiatan_id (nullable), kehadiran_id (nullable), tipe (kredit/koreksi), jumlah (+/−), keterangan, dibuat_oleh, created_at                                                                                       | Poin TIDAK PERNAH di-update diam-diam; total = SUM(jumlah). Penalti tidak dibangun (di luar scope)                                            |
| 13  | koreksi                | id, mahasiswa_id, kegiatan_id, jenis (belum_absen/poin_belum_masuk/lainnya), alasan, bukti_path (nullable), status (menunggu/disertujui/ditolak), diproses_oleh, catatan_proses                                                   | Jalur resmi pengganti "hubungi sekretaris"                                                                                                    |

Relasi kunci: kehadiran valid + transaksi kredit ditulis dalam SATU
transaksi DB (atomik). Kredit poin hanya dari kehadiran ber-status valid
atau koreksi yang disetujui.

## Fase coding (satu jalur, berurutan)

- **Fase 0 — Fondasi:** prasyarat di atas hijau; `.env` Asia/Makassar;
  matikan route register bawaan starter kit; publish spatie permission.
- **Fase 1 — Auth & master data:** login username; 2 role spatie; CRUD
  komsat/divisi (IM); CRUD anggota + buat akun mahasiswa (IM); seeder:
  5 komsat, role, 1 akun IM, beberapa mahasiswa contoh.
- **Fase 2 — Kegiatan & pendaftaran:** CRUD kegiatan (peta leaflet untuk
  titik + radius), pilih divisi target, bobot per peran; halaman mahasiswa:
  kegiatan untuk divisinya → tombol Ikut (list dalam sistem); halaman
  Guest: jadwal publik.
- **Fase 3 — Absensi & poin:** halaman absensi mahasiswa (kamera/getUserMedia
    - geolocation), validasi server (Haversine, jendela waktu, status
      pendaftaran, duplikasi), transaksi atomik kehadiran→poin; dashboard
      mahasiswa (poin, riwayat, leaderboard); pantauan real-time IM;
      tutup & kunci kegiatan.
- **Fase 4 — Fitur Instrumen IPPL:** rekap & tren per Komsat (recharts,
  filter kampus) + ekspor Excel; direktori kepengurusan per periode
  (kelola IM, tampil publik); pengajuan & validasi koreksi.
- **Fase 5 — Uji:** black-box per KF (sesuai mata kuliah IPPL: pengujian),
  seed data demo, rapikan untuk presentasi UAS.

## Yang TIDAK dibangun (di luar scope, keputusan tercatat)

- Face matching & liveness otomatis (fase 2 — A-04).
- Penalti/aturan poin negatif (keputusan user 3 Nov 2026).
- Check-out (MVP check-in saja — A-05).
- Migrasi data dari sistem lama (prototipe berdiri sendiri — A-01).
- Role Sekretaris Wilayah/Komsat & aktor KPw BI (model 3 aktor).
