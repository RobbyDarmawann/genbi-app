MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

KONTAK MAHASISWA UNTUK INTERNAL MANAJEMEN — dua bagian satu tema. Latar terverifikasi dari browser pengguna: halaman Detail mahasiswa sisi Internal Manajemen (admin/mahasiswa/{id}) saat ini hanya menampilkan Profil Keanggotaan, Ringkasan Riwayat, dan Riwayat Transaksi Poin — biodata yang diisi mahasiswa lewat Data Diri TIDAK tampil di sana, padahal Internal Manajemen perlu membacanya (mis. untuk mengisi kontak kepengurusan orang tersebut). Jangan mengklaim bagian mana pun sudah ada sebelum memeriksanya di kode dan di browser.

BAGIAN A — Blok "Data Diri" hanya-baca di Detail mahasiswa admin:

1. Audit dulu: controller admin mahasiswa untuk halaman show/detail (prop apa saja yang dikirim sekarang), komponen show.tsx, dan tipe datanya. Tambahkan biodata mahasiswa ke props detail bila belum ada: jenis_kelamin, agama, golongan_darah, tanggal_lahir, domisili, no_hp, email akun, dan foto_url (dari foto_path, pola yang sama seperti pemakaian lain di proyek).
2. Render kartu "Data Diri" HANYA-BACA di halaman Detail, ditempatkan sesudah kartu Profil Keanggotaan/Ringkasan Riwayat dan sebelum Riwayat Transaksi Poin, mengikuti pola kartu & tipografi halaman itu. Isi: keenam field biodata (tanggal_lahir diformat tanggal Indonesia, mis. "4 November 2004"), email akun, foto/avatar dengan fallback inisial bila ada foto_path, dan nomor HP sebagai chip/tautan https://wa.me/<nomor ternormalisasi> mengikuti pola tautan kontak kepengurusan. Field yang kosong tampil "—". Bila seluruh biodata kosong, tampilkan kalimat: "Mahasiswa belum melengkapi data diri."
3. TIDAK ada formulir/endpoint edit biodata untuk Internal Manajemen — biodata tetap hanya bisa diubah mahasiswa sendiri lewat Data Diri.
4. Test: halaman Detail sebagai Internal Manajemen memuat props biodata yang benar untuk mahasiswa yang biodatanya terisi (assert nilai no_hp dan satu field lain), dan halaman admin ini tetap tidak bisa diakses mahasiswa/guest (ikuti pola test otorisasi proyek).

BAGIAN B — Prefill kontak kepengurusan dari biodata mahasiswa terpilih:

1. Audit formulir tambah/edit pengurus (dialog di admin kepengurusan) dan props daftar mahasiswa kandidat yang tersedia di halaman itu. Bila props kandidat belum memuat no_hp mahasiswa dan email akunnya, tambahkan kedua field itu ke props (hanya untuk halaman admin ini).
2. Perilaku prefill pada dialog TAMBAH pengurus: saat Internal Manajemen memilih mahasiswa, kolom "Nomor HP" terisi otomatis dari no_hp biodata mahasiswa itu dan kolom "Email" dari email akunnya — HANYA bila kolom itu masih kosong/belum diubah manual pada sesi dialog ini; mengganti mahasiswa tidak menimpa isian yang sudah diketik/diubah Internal Manajemen. Instagram tetap manual (biodata tidak menyimpannya). Prefill adalah nilai awal yang bebas diubah/dihapus sebelum simpan; yang tersimpan tetap salinan pada record kepengurusan seperti sekarang — TANPA kolom/skema baru dan TANPA sinkronisasi dua arah (perubahan biodata sesudahnya tidak mengubah kontak pengurus, dan sebaliknya).
3. Pada dialog EDIT pengurus, perilaku lama tidak berubah (kontak yang tersimpan yang ditampilkan; prefill Bagian B hanya untuk tambah baru).
4. Test: props kandidat memuat no_hp + email; dan simpan pengurus baru dengan nilai hasil prefill yang diubah manual tetap menyimpan nilai manual itu (ikuti pola test kepengurusan yang ada — jangan menulis ulang suite-nya).

VERIFIKASI BROWSER (http://127.0.0.1:8000/, akun demo internal/password): (1) buka Detail Kartika Sari (mhs011) — kartu Data Diri harus terlihat berisi biodata demo termasuk nomor HP-nya; (2) buka dialog Tambah pengurus, pilih satu mahasiswa demo yang biodatanya terisi — kolom Nomor HP dan Email harus sudah terisi dari biodatanya, lalu ubah nomor itu manual dan pastikan isian manual tidak tertimpa saat memilih ulang. Laporkan hasil kedua verifikasi dengan nilai persis yang terlihat.

GERBANG: test terkait + suite penuh (patokan tidak turun dari 211 lulus, 7 skip, 0 gagal — jumlah lulus harus NAIK), Pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: hasil audit awal (props sebelum vs sesudah), file berubah per bagian, hasil verifikasi browser dengan nilai persis, angka gerbang.
Pesan commit yang disarankan: feat: show student biodata to internal management and prefill board contacts
