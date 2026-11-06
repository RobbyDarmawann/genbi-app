MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# SESI 3 (TERAKHIR): Menyelesaikan kegiatan multi-hari + sesi absensi per hari (Bagian A–I)

Ini sesi penyelesaian dari tugas besar yang dikerjakan dua sesi sebelumnya. Worktree berisi perubahan BELUM di-commit dari kedua sesi itu.

ATURAN MUTLAK:

- JANGAN `git reset`, `git stash`, `git checkout`, atau membuang perubahan yang ada — itu fondasi yang kamu teruskan.
- JANGAN commit apa pun. Commit dilakukan pemilik proyek sesudah laporan akhirmu dinilai.
- Di luar scope, jangan sentuh: alur pendaftaran (`RegisterForActivityAction` dan teman-temannya), aturan bobot poin, Haversine/radius/ambang akurasi, skema tabel yang sudah dibuat, kolom `absensi_buka_at`/`absensi_tutup_at` (tidak boleh dihapus — itu kolom turunan).
- Semua SQL mentah wajib portabel di MySQL, PostgreSQL, dan SQLite.
- Baseline sebelum fitur: 236 passed, 7 skipped, 0 failed (243 test terdaftar).

## Yang SUDAH selesai dan terverifikasi oleh dua sesi sebelumnya (JANGAN dikerjakan ulang)

- Bagian F: select di `mahasiswa/koreksi/index.tsx` + `settings/profile.tsx` sudah `w-full min-w-0` (gerbang frontend hijau saat itu). Pengukuran overflow Playwright tidak pernah dijalankan (tool tidak tersedia) — cukup catat di laporan, jangan pura-pura mengukur.
- Bagian H: `leaflet-picker.tsx` sudah punya LayersControl "Jalan" (OSM) + "Satelit" (Esri World Imagery + overlay label CARTO).
- Migrasi: `2026_11_06_183506_add_tanggal_selesai_to_kegiatan_table`, `2026_11_06_183507_create_sesi_absensi_table` (dengan backfill), `2026_11_06_183508_add_tanggal_to_kehadiran_table` (backfill + unique komposit (pendaftaran_id, tanggal)).
- `app/Models/SesiAbsensi.php` lengkap. `app/Models/Kegiatan.php`: fillable/cast `tanggal_selesai`, relasi `sesiAbsensi()`, `tanggalSelesaiEfektif()` (SUDAH diperbaiki: cast `date` mengembalikan CarbonImmutable — jangan kembalikan ke type Carbon yang salah), `scopeUrutJadwal()` + `scopeStatusEfektif()` memakai COALESCE, `statusEfektif()`.
- `app/Models/Kehadiran.php`: `tanggal` di Fillable + cast `date`. `app/Models/Pendaftaran.php`: `kehadiran()` sudah HasMany terurut tanggal (PERUBAHAN MENYEBAR: semua kode yang membaca `->kehadiran` sebagai objek tunggal WAJIB disesuaikan).
- `StoreKegiatanRequest` tuntas: validasi `tanggal_selesai` + `sesi_absensi`, `after()` (himpunan tanggal sesi persis rentang; aturan jam `after` hanya untuk satu hari), dan `prepareForValidation()` menghitung kolom turunan `absensi_buka_at`/`absensi_tutup_at` dari sesi — kolom turunan dihitung di SATU tempat ini; Action tinggal menyimpan nilai validated + menulis baris sesinya.
- `SubmitAttendanceAction` sudah per-hari: gerbang sesi HARI INI (`whereDate('tanggal', ...)` — wajib pola ini, `where` biasa gagal melawan cast date), idempotent per (pendaftaran, tanggal hari ini), baris baru mengisi `tanggal`, pesan-pesan Bahasa Indonesia, logika poin/Haversine/akurasi TIDAK berubah.
- `KegiatanFactory` punya callback `afterCreating` yang membuat baris sesi setara jendela factory; `KehadiranFactory` mengisi `tanggal`.
- `Mahasiswa/AbsensiController::create` sudah mengirim prop sesi hari ini + kehadiran hari ini.
- Test terverifikasi hijau di akhir sesi 2: `AbsensiCheckinTest` 10/10, `JadwalOrderingPaginationTest` 3/3.

PERINGATAN AKUNTANSI: dua laporan terakhir sama-sama tidak klop jumlahnya (yang terdaftar 243, yang terhitung selesai selalu kurang) karena run suite-nya terputus di tengah (exit code 2). Angka suite penuh yang bisa dipercaya BELUM PERNAH ada sejak fitur ini mulai. Itu tugas pertamamu.

## Keputusan desain terkunci (jangan didiskusikan ulang)

1. `tanggal` = tanggal mulai; `tanggal_selesai` nullable (null/sama = satu hari); ujung rentang selalu lewat `tanggalSelesaiEfektif()`.
2. `sesi_absensi`: satu baris per (kegiatan, tanggal) — `jam_buka` + `jam_tutup`; himpunan tanggal sesi WAJIB persis rentang kegiatan. Di formulir: baris otomatis dari rentang + isian "jam sama untuk semua hari" dengan tombol terapkan; tiap baris bisa diedit sendiri.
3. Poin: satu baris kredit `poin_transaksi` per kehadiran valid (pengikat `kehadiran_id`); hadir N hari = N kredit.
4. Makna turunan per hari: "Sudah Hadir" = ada kehadiran valid HARI INI; `dapatAbsen` = terdaftar aktif + belum ada kehadiran hari ini + sekarang di dalam sesi hari ini; `dapatMembatalkan` tetap mensyaratkan belum ada kehadiran sama sekali.
5. Tren/rekap per bulan tetap mengelompokkan kegiatan di bulan tanggal MULAI-nya.

## Urutan pekerjaanmu

0. BAGIAN I — Symlink storage Heroku (kecil, mandiri, kerjakan pertama): SUDAH TERKONFIRMASI dari Run console produksi bahwa `public/storage` TIDAK ADA ("No such file or directory") — akibatnya semua URL `/storage/*` 404 di produksi walau upload berhasil. Buat berkas `.profile.d/storage-link.sh` di akar repo berisi skrip bash yang menjalankan `php artisan storage:link` pada setiap dyno boot bila symlink belum ada (fallback `ln -snf ../storage/app/public public/storage`). JANGAN commit symlink itu sendiri. Jangan mengubah konfigurasi disk/filesystems. Laporkan isi berkas persis.
1. INVENTARIS JUJUR: `git --no-pager status -s`, lalu jalankan `php artisan test --compact` SAMPAI SELESAI PENUH. Laporkan di awal pekerjaanmu (dan ulangi di laporan akhir): total terdaftar, passed, failed, skipped — jumlah passed+failed+skipped HARUS sama dengan total terdaftar; bila run terputus, tulis bahwa run terputus + titik putusnya, jangan menyajikan angka parsial sebagai angka final. Catat semua nama test gagal persis.
2. `UpdateKegiatanRequest::after()`: samakan dengan Store (himpunan sesi persis rentang, aturan jam satu-hari). Perilaku pembekuan parameter sensitif yang sudah ada di file itu TIDAK berubah cakupannya.
3. Create/Update Action kegiatan: dalam satu transaksi — simpan kegiatan (`tanggal_selesai` + kolom turunan dari validated), tulis ulang baris sesi dari input (hapus lama, buat baru; pola sama seperti divisi target/bobot). Seeder yang membuat kegiatan lewat model langsung (DemoSeeder, TrenDemoSeeder, DatabaseSeeder bila relevan): tambahkan pembuatan sesi setara dari jendela absensinya; jangan mengubah data demo yang ada.
4. Controller + frontend yang membaca relasi/prop lama — sesuaikan ke semantik per hari (keputusan 4):
    - `Mahasiswa/KegiatanController`: prop `kehadiran` menjadi `daftar_kehadiran` (per hari: tanggal, status, status_label, alasan, poin_terkredit) + `kehadiran_hari_ini`; `dapat_absen` mengikuti sesi hari ini; kirim juga daftar sesi kegiatan (tanggal + jam buka–tutup).
    - `Mahasiswa/DashboardController`, `Admin/MonitoringKegiatanController` (termasuk syarat kunci kegiatan: kehadiran menunggu tetap dihitung dari semua baris), `Admin/PesertaKegiatanController` (jumlah hari hadir valid + ringkasan per hari), `Admin/KoreksiController`, `Admin/KegiatanController` seperlunya.
    - Semua .tsx yang membaca prop berubah bentuk disesuaikan sampai types:check hijau.
5. Formulir `resources/js/components/kegiatan/kegiatan-form.tsx`: input "Tanggal Selesai" (boleh kosong, petunjuk "Kosongkan bila kegiatan hanya satu hari"); bagian "Jadwal Absensi per Hari" menggantikan dua input datetime lama — baris otomatis per hari dalam rentang (label tanggal Bahasa Indonesia), tiap baris jam buka + jam tutup, isian "jam untuk semua hari" + tombol terapkan, nilai baris yang sudah diedit dipertahankan sejauh tanggalnya masih dalam rentang; mode edit mengisi dari sesi tersimpan; payload mengirim `tanggal_selesai` + `sesi_absensi`, TIDAK lagi mengirim `absensi_buka_at`/`absensi_tutup_at`. Helper format rentang tanggal (satu hari seperti sekarang; multi-hari "13–15 Nov 2026" satu bulan / "30 Nov – 2 Des 2026" beda bulan, selalu dengan jam harian) diterapkan di: jadwal publik (index + show), beranda publik, panel mahasiswa (index + show), panel admin kegiatan (index + show + monitoring), dashboard seperlunya. Detail mahasiswa menampilkan daftar sesi + daftar kehadiran per hari; halaman check-in menampilkan sesi hari ini.
6. Test: sesuaikan test lama yang payload/bentuknya berubah mengikuti desain baru TANPA menyusutkan cakupan (termasuk penyesuaian yang sudah dibuat sesi 2 di `AbsensiCheckinTest` — sebutkan di laporan). Test BARU wajib:
    - buat kegiatan multi-hari + sesi (jam sama semua hari) tersimpan benar + kolom turunan benar;
    - validasi: tanggal_selesai < tanggal ditolak; himpunan sesi kurang/lebih dari rentang ditolak; jam_tutup ≤ jam_buka ditolak; multi-hari dengan jam_selesai ≤ jam_mulai DITERIMA;
    - statusEfektif multi-hari: hari ke-2 = Berlangsung; sesudah ujung rentang = Selesai;
    - urutJadwal: multi-hari yang tanggal mulainya lewat tetapi selesainya belum tetap kelompok mendatang;
    - check-in hari ke-1 valid → 1 kredit; ulangi hari yang sama → idempotent (poin tidak dobel); hari ke-2 valid → kredit kedua; total = 2 × bobot;
    - check-in di luar sesi hari ini ditolak tanpa baris kehadiran;
    - kegiatan satu hari: perilaku lama utuh.
7. BAGIAN G — Tab "Bisa Didaftar": tab ketiga di `Mahasiswa/KegiatanController@index` (param `tab=bisa_daftar`, paginasi sendiri `halaman_bisa_daftar`, 9/halaman independen, `q` berlaku, dua tab lama tidak berubah perilakunya). Syarat tampil — SEMUANYA di level query, SQL portabel: terbit (scope `terbit()`) dan belum selesai efektif; divisi target mencakup divisi mahasiswa; belum ada pendaftaran berstatus terdaftar milik mahasiswa ini; belum ada kehadiran apa pun milik mahasiswa ini pada kegiatan itu (pendaftaran batal TANPA kehadiran boleh muncul lagi); jendela pendaftaran buka (`pendaftaran_dibuka_at` null/≤ sekarang DAN `batas_daftar_at` null/≥ sekarang); kuota belum penuh (`kuota` null ATAU subquery COUNT pendaftaran terdaftar < `kuota`). Penyimpangan disengaja: kegiatan selesai-efektif disembunyikan walau aksi daftar lama masih menerimanya bila `batas_daftar_at` kosong — catat di laporan, JANGAN ubah aturan aksi daftar. Frontend: tombol tab "Bisa Didaftar", status kosong "Tidak ada kegiatan yang bisa didaftar saat ini." Test baru: satu skenario lolos semua syarat; satu skenario gugur per syarat; batal-tanpa-kehadiran muncul lagi; multi-hari belum selesai tetap muncul; paginasi tab independen.

## Gerbang & laporan akhir wajib

Jalankan dan laporkan ANGKA PERSIS: `php artisan test --compact` (sampai selesai penuh, akuntansi klop), `vendor\bin\pint`, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Laporan akhir: keadaan suite dari inventaris langkah 1 vs akhir; ringkasan per bagian A–I; berkas diubah/dibuat; SEMUA test lama yang disesuaikan (termasuk warisan sesi 1–2) + alasannya; isi `.profile.d/storage-link.sh` persis; catatan Bagian F (pengukuran overflow tidak dijalankan bila tool tidak ada — nyatakan jujur); dan pesan commit yang disarankan: `fix: prevent horizontal overflow on mobile correction form` (F), `feat: add satellite base layer option to location picker` (H), `fix: create public storage symlink on Heroku boot` (I), `feat: add multi-day activities with per-day attendance sessions` (A–E + G). Bila tokenmu menipis sebelum selesai: berhenti di checkpoint yang hijau dan tulis STATUS SERAH TERIMA sepersis pendahulumu — jangan berhenti diam.
