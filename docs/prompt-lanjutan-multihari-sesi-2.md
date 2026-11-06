MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# SESI LANJUTAN: Kegiatan multi-hari + sesi absensi per hari (Bagian A–H)

Ini sesi LANJUTAN. Sesi sebelumnya mengerjakan sebagian tugas ini lalu berhenti (token habis) dan meninggalkan STATUS SERAH TERIMA. Worktree saat ini berisi perubahan yang BELUM di-commit.

ATURAN MUTLAK SESI INI:

- JANGAN `git reset`, `git stash`, `git checkout`, atau membuang perubahan yang ada di worktree — semua itu fondasi yang kamu teruskan.
- JANGAN commit apa pun. Commit dilakukan pemilik proyek sesudah laporan akhirmu dinilai.
- Jangan `git add -A` bila men-stage sesuatu untuk pemeriksaan; stage per berkas.
- Baseline sebelum fitur ini: 236 passed, 7 skipped, 0 failed (243 test). Target akhir: failed = 0 dan jumlah passed NAIK karena test baru.
- Semua SQL mentah wajib portabel di MySQL, PostgreSQL, dan SQLite (tanpa fungsi khas satu mesin).

## Keadaan worktree yang ditinggalkan sesi sebelumnya (anggap benar, verifikasi lewat membaca berkasnya)

SELESAI (jangan dikerjakan ulang, cukup verifikasi di gerbang akhir):

- Bagian F: `resources/js/pages/mahasiswa/koreksi/index.tsx` + `resources/js/pages/settings/profile.tsx` — select diberi `w-full min-w-0`. Pengukuran overflow Playwright TIDAK sempat dijalankan (tidak tersedia) — tidak perlu kamu jalankan kecuali tool-nya memang ada di sesimu; cukup catat di laporan.
- Bagian H: `resources/js/components/kegiatan/leaflet-picker.tsx` — LayersControl dua lapisan: "Jalan" (OSM, bawaan) + "Satelit" (Esri World Imagery + overlay label CARTO voyager_only_labels). types:check hijau sesudahnya; check & build akan kamu jalankan ulang di gerbang akhir.

SUDAH DIBUAT (baca dulu isinya persis sebelum mengubah apa pun):

- `database/migrations/2026_11_06_183506_add_tanggal_selesai_to_kegiatan_table.php`
- `database/migrations/2026_11_06_183507_create_sesi_absensi_table.php` (dengan backfill dari jendela lama)
- `database/migrations/2026_11_06_183508_add_tanggal_to_kehadiran_table.php` (backfill + unique komposit)
- `app/Models/SesiAbsensi.php` (model baru)
- `app/Models/Kegiatan.php` (fillable/cast `tanggal_selesai`, relasi `sesiAbsensi()`, `tanggalSelesaiEfektif()`, `scopeUrutJadwal()` + `scopeStatusEfektif()` memakai COALESCE, `statusEfektif()`)
- `app/Http/Requests/Admin/StoreKegiatanRequest.php` (validasi `tanggal_selesai` + `sesi_absensi`; validasi jendela lama dicabut; `after()` memvalidasi himpunan tanggal sesi terhadap rentang dan aturan jam satu-hari; `prepareForValidation()` menghitung `absensi_buka_at`/`absensi_tutup_at` turunan dari sesi)
- `app/Http/Requests/Admin/UpdateKegiatanRequest.php` (sebagian: validasi + prepareForValidation sama seperti Store; `after()`-nya BELUM dikerjakan)

KEADAAN TEST TERAKHIR: suite merah — laporan terakhir menyebut 183 passed / 8 failed dengan akuntansi yang tidak lengkap (243 − 183 − 8 − 7 skipped ≠ 0). Delapan kegagalan yang teridentifikasi semuanya di `AbsensiCheckinTest`: kolom `kehadiran.tanggal` sudah NOT NULL oleh migrasi, tetapi `SubmitAttendanceAction` belum mengisinya.

## Keputusan desain yang SUDAH TERKUNCI (jangan didiskusikan ulang, jangan menyimpang)

1. `kegiatan.tanggal` = tanggal mulai; `tanggal_selesai` nullable (null/sama = satu hari). Ujung rentang selalu lewat `tanggalSelesaiEfektif()`.
2. `sesi_absensi`: satu baris per (kegiatan, tanggal) berisi `jam_buka` + `jam_tutup`; himpunan tanggal sesi WAJIB persis sama dengan rentang tanggal kegiatan. Di formulir, baris dibuat otomatis dari rentang + ada isian "jam sama untuk semua hari" yang bisa diterapkan ke semua baris; tiap baris tetap bisa diedit sendiri.
3. Kolom `absensi_buka_at`/`absensi_tutup_at` DIPERTAHANKAN sebagai nilai turunan (sesi pertama → sesi terakhir) supaya semua pembaca lama tidak berubah perilaku. Sesi sebelumnya menghitungnya di `prepareForValidation()` FormRequest — terima pola itu, pastikan Create/Update Action menyimpan nilai turunannya secara konsisten dan TULIS baris sesinya; jangan menghitung di dua tempat yang bisa berbeda hasil.
4. Check-in per hari: gerbangnya sesi HARI INI (zona waktu aplikasi) — tidak ada sesi hari ini / sebelum jam buka / sesudah jam tutup → ValidationException dengan pesan Bahasa Indonesia yang sesuai. Idempotent per (pendaftaran, tanggal): kirim ulang di hari yang sama mengembalikan baris yang ada (audit `kehadiran.duplicate_attempt`); hari berbeda = baris baru.
5. `kehadiran.tanggal` = tanggal check-in; UNIQUE (pendaftaran_id, tanggal) menggantikan UNIQUE (pendaftaran_id).
6. Poin: satu baris kredit `poin_transaksi` per kehadiran valid (pengikat `kehadiran_id`), sebesar bobot peran pendaftaran — jadi hadir N hari = N baris kredit. Skema poin TIDAK diubah. Seluruh logika lain SubmitAttendanceAction (Haversine server, radius, akurasi ≤ 100 m untuk valid otomatis, menunggu_tinjau, ditolak tetap tersimpan + foto privat di disk `absensi`, audit) TIDAK berubah.
7. `Pendaftaran::kehadiran()` menjadi HasMany (nama relasi tetap `kehadiran`, terurut tanggal). Makna turunan: `memilikiKehadiran` = ada baris apa pun; status tampil "Sudah Hadir" bila ada kehadiran valid untuk HARI INI; `dapatMembatalkan` tetap mensyaratkan belum ada kehadiran sama sekali; `dapatAbsen` = terdaftar aktif + belum ada kehadiran hari ini + sekarang di dalam sesi hari ini.
8. Tren/rekap per bulan tetap mengelompokkan kegiatan di bulan tanggal MULAI-nya.

## Urutan pekerjaanmu

1. INVENTARIS DULU: `git --no-pager status -s`; baca ketiga migrasi, `SesiAbsensi`, `Kegiatan`, dan kedua FormRequest di atas; jalankan `php artisan test --compact` dan catat SEMUA kegagalan secara persis (nama test + pesan). Jangan mengubah kode apa pun sebelum inventaris ini selesai.
2. Model `Kehadiran`: `tanggal` masuk Fillable + cast `date`. Model `Pendaftaran`: relasi `kehadiran()` HasOne → HasMany.
3. `SubmitAttendanceAction`: terapkan keputusan 4–6 (sesi hari ini sebagai gerbang; pencarian kehadiran yang ada difilter pendaftaran + tanggal hari ini; baris baru mengisi `tanggal`).
4. `KegiatanFactory`: buat baris sesi yang cocok dengan `absensi_buka_at`/`absensi_tutup_at` factory (satu baris pada `tanggal`, jam diambil dari kedua kolom itu). Lalu jalankan lagi suite: delapan kegagalan AbsensiCheckinTest harus sembuh; catat kegagalan lain yang muncul (kemungkinan test lama yang mengirim payload formulir lama tanpa `sesi_absensi` — itu ditangani di langkah 8, bukan dengan melonggarkan validasi).
5. `UpdateKegiatanRequest::after()`: samakan dengan Store — himpunan tanggal sesi persis rentang, aturan jam satu-hari, dan perilaku pembekuan parameter sensitif yang sudah ada di file itu TIDAK berubah cakupannya.
6. Create/Update Action kegiatan: dalam satu transaksi — simpan kegiatan (termasuk `tanggal_selesai` + kolom turunan), tulis ulang baris sesi dari input (hapus lama, buat baru; pola sama seperti divisi target/bobot). Seeder yang membuat kegiatan lewat model langsung (DemoSeeder, TrenDemoSeeder, DatabaseSeeder bila relevan): tambahkan pembuatan sesi yang setara dari jendela absensinya; jangan mengubah data demo yang ada.
7. Controller yang membaca relasi/prop lama — sesuaikan ke semantik per hari (keputusan 7) tanpa mengubah makna bisnis lain:
    - `Mahasiswa/KegiatanController`: prop `kehadiran` menjadi `daftar_kehadiran` (array per hari: tanggal, status, status_label, alasan, poin_terkredit) + `kehadiran_hari_ini`; `dapat_absen` mengikuti sesi hari ini; tampilkan juga daftar sesi kegiatan (tanggal + jam buka–tutup) sebagai prop.
    - `Mahasiswa/AbsensiController`: halaman check-in memakai sesi hari ini + kehadiran hari ini; bila tidak ada sesi hari ini, halaman menyatakan absensi tidak dijadwalkan hari ini.
    - `Mahasiswa/DashboardController`, `Admin/MonitoringKegiatanController`, `Admin/PesertaKegiatanController` (daftar peserta: jumlah hari hadir valid + ringkasan per hari), `Admin/KoreksiController`, `Admin/KegiatanController` seperlunya.
    - Frontend (.tsx) yang membaca prop berubah bentuk WAJIB disesuaikan sampai types:check hijau.
8. Frontend formulir `resources/js/components/kegiatan/kegiatan-form.tsx`: input "Tanggal Selesai" (boleh kosong, petunjuk "Kosongkan bila kegiatan hanya satu hari"); bagian "Jadwal Absensi per Hari" menggantikan dua input datetime lama — baris otomatis per hari dalam rentang (label tanggal Bahasa Indonesia), tiap baris jam buka + jam tutup, dua isian "jam untuk semua hari" + tombol terapkan, nilai baris yang sudah diedit dipertahankan sejauh tanggalnya masih ada; mode edit mengisi dari sesi tersimpan; payload mengirim `tanggal_selesai` + `sesi_absensi` dan TIDAK lagi mengirim `absensi_buka_at`/`absensi_tutup_at`. Tampilan tanggal: helper format rentang (satu hari seperti sekarang; multi-hari "13–15 Nov 2026" satu bulan atau "30 Nov – 2 Des 2026" beda bulan, selalu dengan jam harian) diterapkan di jadwal publik (index + show), beranda publik, panel mahasiswa (index + show), panel admin kegiatan (index + show + monitoring), dashboard seperlunya. Detail mahasiswa menampilkan daftar sesi + daftar kehadiran per hari; halaman check-in menampilkan sesi hari ini.
9. Test: sesuaikan test lama yang payload/bentuknya berubah mengikuti desain baru TANPA menyusutkan cakupan perilaku (laporkan test mana + kenapa). Test BARU wajib:
    - buat kegiatan multi-hari + sesi (jam sama semua hari) tersimpan benar + kolom turunan benar;
    - validasi: tanggal_selesai < tanggal ditolak; himpunan sesi kurang/lebih dari rentang ditolak; jam_tutup ≤ jam_buka ditolak; multi-hari dengan jam_selesai ≤ jam_mulai DITERIMA;
    - statusEfektif multi-hari: hari ke-2 = Berlangsung; sesudah ujung rentang = Selesai;
    - urutJadwal: multi-hari yang tanggal mulainya lewat tetapi selesainya belum tetap kelompok mendatang;
    - check-in hari ke-1 valid → 1 baris kredit; ulangi hari yang sama → idempotent (tetap 1 kehadiran hari itu, poin tidak dobel); hari ke-2 valid → kehadiran + kredit kedua; total = 2 × bobot;
    - check-in di luar sesi hari ini (sebelum buka / sesudah tutup / tanpa sesi) ditolak tanpa baris kehadiran;
    - kegiatan satu hari: perilaku lama utuh.
10. BAGIAN G — Tab "Bisa Didaftar" (belum dimulai sama sekali): tab ketiga di `Mahasiswa/KegiatanController@index`, parameter `tab=bisa_daftar`, paginasi sendiri `halaman_bisa_daftar` (9/halaman, independen), pencarian `q` berlaku, resolusi tab lama tidak rusak. Syarat tampil — SEMUANYA di level query, SQL portabel: terbit (scope `terbit()`) dan belum selesai efektif (ujung rentang + `jam_selesai` belum lewat); divisi target mencakup divisi mahasiswa; belum ada pendaftaran berstatus terdaftar milik mahasiswa ini; belum ada kehadiran apa pun milik mahasiswa ini pada kegiatan itu (pendaftaran batal TANPA kehadiran boleh muncul lagi); jendela pendaftaran buka (`pendaftaran_dibuka_at` null/≤ sekarang DAN `batas_daftar_at` null/≥ sekarang); kuota belum penuh (`kuota` null ATAU subquery COUNT pendaftaran terdaftar < `kuota`). Penyimpangan disengaja: kegiatan selesai-efektif disembunyikan walau aksi daftar lama masih menerimanya bila `batas_daftar_at` kosong — catat di laporan, JANGAN ubah aturan aksi daftar. Frontend: tombol tab "Bisa Didaftar" sejajar dua tab lama, status kosong "Tidak ada kegiatan yang bisa didaftar saat ini.", dua tab lama tidak berubah. Test baru: satu skenario lolos semua syarat; satu skenario gugur per syarat; batal-tanpa-kehadiran muncul lagi; multi-hari yang mulainya lewat tapi selesainya belum tetap muncul; paginasi tab independen.

## Larangan

- Mengubah aturan bobot poin, Haversine/radius/ambang akurasi, alur pendaftaran & kuota, skema tabel selain yang sudah dibuat sesi sebelumnya, dan kolom `absensi_buka_at`/`absensi_tutup_at` (tidak boleh dihapus).
- Melonggarkan validasi untuk membuat test lama lulus — payload test yang disesuaikan, bukan aturannya.
- Menulis SQL mentah khas satu mesin database.

## Gerbang & laporan akhir wajib

Jalankan dan laporkan ANGKA PERSIS: `php artisan test --compact`, `vendor\bin\pint`, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Laporan akhir: ringkasan per bagian (A–H), hasil inventaris langkah 1 vs keadaan akhir suite, berkas diubah/dibuat, test lama yang disesuaikan + alasannya, di mana kolom turunan dihitung (satu tempat), catatan Bagian F (pengukuran overflow tidak dijalankan bila tool-nya tidak ada — nyatakan jujur), dan pesan commit yang disarankan: `fix: prevent horizontal overflow on mobile correction form` (Bagian F), `feat: add satellite base layer option to location picker` (Bagian H), `feat: add multi-day activities with per-day attendance sessions` (A–E + G). Bila tokenmu menipis sebelum selesai: berhenti dan tulis STATUS SERAH TERIMA sepersis pendahulumu (selesai apa, belum apa, berkas diubah, hasil test terakhir persis) — jangan berhenti diam.
