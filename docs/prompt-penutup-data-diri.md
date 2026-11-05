MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

PROMPT PENUTUP DATA DIRI — JANGAN menulis ulang fitur Data Diri. Fitur itu sudah terimplementasi di commit 54a7a0d (migration biodata, pencabutan Delete account, halaman Data Diri, seeder biodata). Tugas sesi ini HANYA menutup tiga hutang bukti yang diakui laporan sesi sebelumnya: (1) feature test khusus biodata belum ada, (2) docs/06-manual-pengguna.md belum disinkronkan, (3) verifikasi browser belum dilakukan. Audit dulu keadaan aktual dengan git log/git show dan membaca file terkait; perbaiki kode HANYA bila audit atau test baru menemukan cacat nyata, dan laporkan setiap perbaikan kode sebagai temuan tersendiri (jangan diam-diam).

BAGIAN 1 — FEATURE TEST BIODATA (file test baru khusus, mis. tests/Feature/Settings/BiodataTest.php):

1. Biodata tersimpan & tampil: mahasiswa login membuka halaman Data Diri (route settings/biodata yang ada) dan keenam field biodata + identitas terkunci tampil sebagai props/halaman.
2. Mahasiswa mengubah biodatanya sendiri: PATCH biodata yang sah tersimpan ke tabel mahasiswa dan nilai baru tampil sesudah reload.
3. Field terkunci TIDAK berubah walau ikut dikirim: kirim payload yang mencampurkan field sah dengan username, nim, email, komsat_id, divisi_id, angkatan, status_penerima, dan aktif yang diubah — assert semua field terkunci tetap nilai semula, field sah berubah.
4. Mahasiswa TIDAK bisa mengubah data mahasiswa lain: upaya mengakses/mengubah biodata milik mahasiswa lain ditolak (403/redirect sesuai pola proyek) dan data korban tidak berubah.
5. Unggahan bukan gambar ditolak: file teks/.pdf sebagai foto menghasilkan error validasi dan foto_path tetap kosong; unggahan gambar sah (Storage::fake pola proyek) tersimpan dan mengganti foto menghapus berkas lama.
6. Validasi: no_hp di luar 9–15 digit ditolak; tanggal_lahir di masa depan ditolak.
7. Endpoint hapus akun sendiri tetap tidak tersedia: route profile.destroy tidak ada (assert Route::has false / respons 404-405) dan akun tetap ada — bila test ini sudah tercakup test profil yang ada, sebutkan file:test-nya dan jangan duplikasi.

BAGIAN 2 — DOKUMEN: sinkronkan docs/06-manual-pengguna.md pada bagian pengaturan mahasiswa: jelaskan halaman Data Diri (field yang bisa disunting sendiri vs identitas terkunci yang hanya diubah Internal Manajemen), unggah/ganti/hapus foto profil, dan bahwa pengguna tidak bisa menghapus akunnya sendiri — penghapusan akun hanya oleh Internal Manajemen. Jangan mengubah bagian dokumen lain.

BAGIAN 3 — VERIFIKASI BROWSER (MySQL lokal, http://127.0.0.1:8000/):

1. Login mhs001: halaman Data Diri tampil dengan identitas terkunci + biodata hasil seeder terisi; ubah SATU field biodata (mis. domisili), simpan, reload — perubahan harus tetap ada.
2. Halaman Detail mahasiswa mhs001 sisi Internal Manajemen menampilkan biodata + foto/avatar sesuai data (bila biodata TIDAK tampil di sisi admin, itu cacat: perbaiki tampilannya mengikuti pola halaman yang ada, tambahkan test props-nya, dan laporkan sebagai perbaikan kode).
3. Avatar/foto tampil di chip pengguna sidebar bila foto ada; bila foto kosong, fallback inisial tampil (cukup verifikasi salah satu keadaan yang ada di data demo dan laporkan keadaannya).
4. Pengaturan untuk kedua peran (mahasiswa dan internal) TIDAK memuat teks "Delete account" — verifikasi dengan pencarian teks di halaman ter-render, bukan hanya di kode.

GERBANG & LAPORAN: test baru + test terkait + suite penuh (patokan: jumlah lulus WAJIB NAIK dari 192, 7 skip, 0 gagal — laporkan angka persisnya), Pint, composer types:check, npm run types:check, npm run check, npm run build. Laporan: daftar test baru dengan hasil per test, bukti verifikasi browser per poin (termasuk field yang diubah dan nilai sesudah reload), perubahan docs/06, dan setiap perbaikan kode yang terpaksa dilakukan beserta alasannya.

Pesan commit yang disarankan: test: cover student biodata and sync user manual (bila ada perbaikan kode, pisahkan: fix: <temuan> — sebutkan di laporan).
