# Manual Pengguna

Manual ini mengikuti istilah dan menu pada aplikasi final. URL internal
dapat berubah melalui Wayfinder; gunakan tautan dan tombol menu aplikasi,
bukan mengetik URL secara manual.

## 1. Guest

Guest tidak perlu login.

### Melihat jadwal dan detail kegiatan

1. Buka `Beranda`.
2. Pilih `Aktivitas` pada navigasi publik.
3. Gunakan pencarian/filter yang tersedia.
4. Pilih judul kegiatan untuk membuka detail `Jadwal`.
5. Periksa tanggal, jam, lokasi, lingkup, dan informasi kegiatan.

Guest hanya melihat kegiatan yang telah diterbitkan. Kegiatan `draft` tidak
ditampilkan sebagai agenda publik.

### Melihat statistik

1. Pilih `Statistik`.
2. Baca ringkasan jumlah kegiatan, anggota, dan Komsat.
3. Gunakan grafik dan tabel leaderboard untuk melihat peringkat poin.

### Melihat direktori kepengurusan

1. Pilih `Kepengurusan`.
2. Pilih periode atau filter Komsat bila tersedia.
3. Baca bagan Wilayah dan kelompok Komsat.
4. Klik atau ketuk kartu pengurus untuk melihat kontak.
5. Pada desktop, hover juga dapat membalik kartu. Gunakan tombol balik untuk
   menutup sisi kontak.

## 2. Internal Manajemen

Login menggunakan username yang dibuat oleh Internal Manajemen. Semua menu
berikut berada di area dashboard internal.

### Dashboard Internal Manajemen

Dashboard menampilkan data operasional aktual:

- `Kegiatan Aktif`: jumlah kegiatan dengan tanggal di antara tanggal mulai dan
  tanggal selesai `Periode` terbaru yang berstatus aktif.
- `Anggota Aktif`: jumlah seluruh baris `mahasiswa` dengan `aktif = true`.
  Definisi ini sama dengan perhitungan aktif pada laporan per Komsat.
- `Kehadiran Bulan Ini`: jumlah `kehadiran` berstatus `Valid` dengan waktu
  check-in pada bulan kalender berjalan menurut timezone server
  `Asia/Makassar` (WITA).
- `Koreksi Menunggu`: jumlah pengajuan `koreksi` berstatus `Menunggu`.

Bagian `Ringkasan Sistem` berisi tiga daftar kerja terbaru:

1. `Koreksi menunggu`, maksimal lima pengajuan terbaru dan tautan ke detail
   `Koreksi`.
2. `Kehadiran menunggu`, maksimal lima check-in berstatus `Menunggu tinjau`
   dan tautan ke `Monitoring` kegiatan terkait.
3. `Kegiatan terdekat`, maksimal tiga kegiatan yang sedang berlangsung atau
   paling dekat berikutnya dan tautan ke detail `Kegiatan`.

Jika daftar kosong, dashboard menampilkan empty state yang menjelaskan bahwa
tidak ada pekerjaan menunggu atau agenda terdekat.

### Menyiapkan master data

1. Buka `Periode`, buat periode dengan tanggal mulai dan selesai, lalu aktifkan
   periode yang digunakan.
2. Buka `Komsat`, pastikan lima master resmi tersedia:
   `UNG`, `IAIN`, `UG`, `UMGO`, dan `UBM`.
3. Buka `Divisi`, buat divisi pada Komsat yang sesuai dan pastikan statusnya
   aktif.

### Membuat akun mahasiswa

1. Buka `Mahasiswa`.
2. Pilih `Tambah mahasiswa`.
3. Isi nama, username, email, NIM, angkatan, Komsat, Divisi, status penerima,
   dan password awal.
4. Simpan data.
5. Gunakan aksi `Reset password` bila mahasiswa kehilangan akses.
6. Gunakan aksi status aktif/nonaktif untuk mengendalikan akses login.

Registrasi publik tidak tersedia. Akun mahasiswa dibuat oleh Internal
Manajemen.

### Membuat kegiatan, target, dan bobot poin

1. Buka `Kegiatan`, pilih `Tambah kegiatan`.
2. Isi judul, deskripsi, lokasi, tanggal, jam mulai, jam selesai, dan kuota.
3. Isi titik latitude/longitude serta `Radius absensi`.
4. Atur `Absensi dibuka` dan `Absensi ditutup`.
5. Atur waktu `Pendaftaran dibuka` dan `Batas daftar`.
6. Pilih lingkup Komsat bila kegiatan hanya untuk satu Komsat; kosongkan untuk
   kegiatan Wilayah bila pola form menyediakan pilihan tersebut.
7. Pilih satu atau beberapa `Target divisi`. Target dapat berasal dari
   beberapa Komsat.
8. Isi bobot poin untuk peran `Peserta`, `Panitia`, dan `Pemateri`.
9. Simpan sebagai `draft`, lalu terbitkan melalui aksi status ketika siap.

Mahasiswa hanya dapat mendaftar jika aktif dan berada pada salah satu divisi
target kegiatan. Satu mahasiswa memiliki satu peran per kegiatan.

### Memantau pendaftaran dan absensi

1. Dari detail kegiatan pilih `Peserta` untuk melihat pendaftar.
2. Gunakan aksi `Ubah peran` bila peran perlu diubah sebelum kegiatan dikunci.
3. Buka `Monitoring` untuk melihat status kehadiran.
4. Tinjau absensi berstatus `Menunggu tinjau` melalui aksi review.
5. Foto bukti absensi dibuka dari controller berizin; jangan menyalin path
   storage privat ke luar aplikasi.
6. Setelah semua kehadiran dan koreksi selesai, pilih `Kunci kegiatan`.

Kegiatan tidak boleh dikunci bila masih ada kehadiran atau koreksi yang
menunggu tinjauan sesuai aturan aplikasi.

### Memproses koreksi

1. Buka `Koreksi`.
2. Pilih pengajuan untuk membaca mahasiswa, kegiatan, jenis, alasan, dan bukti.
3. Pilih keputusan `Setujui` atau `Tolak`.
4. Isi catatan proses jika diperlukan.
5. Simpan keputusan.

Keputusan koreksi yang berdampak pada poin menggunakan transaksi ledger dan
tercatat pada audit log.

### Melihat laporan dan export

1. Buka `Rekap`.
2. Pilih periode, rentang tanggal, Komsat, Divisi, atau status kegiatan.
3. Pilih `Terapkan filter`.
4. Tinjau kartu ringkasan, grafik tren, rekap Komsat, dan partisipasi kegiatan.
5. Tinjau panel `Proyeksi Tren per Komsat`. Panel menampilkan jumlah bulan
   data, arah tren, dan estimasi partisipasi bulan berikutnya. Bila data belum
   mencapai empat bulan, sistem menampilkan pesan bahwa data belum cukup.
6. Proyeksi dihitung dengan regresi linear dari data partisipasi bulanan periode
   aktif. Angka proyeksi adalah estimasi arah tren, bukan kepastian.
7. Pilih `Export` untuk mengunduh hasil rekap sesuai filter. Setiap sheet
   memiliki judul, konteks periode, header berwarna, garis tabel, dan freeze
   panes di bawah header.

### Mengelola kepengurusan

1. Buka `Kepengurusan`.
2. Pilih periode dan Komsat atau Wilayah.
3. Tambah pengurus dengan nama tampil, jabatan, urutan, mahasiswa terkait,
   kontak terstruktur, dan foto bila tersedia.
4. Simpan, lalu gunakan aksi ubah atau hapus sesuai kebutuhan.
5. Atur `urutan` untuk menentukan hierarki bagan direktori; urutan pertama
   menjadi kartu puncak.

Foto kepengurusan berbeda dari foto bukti absensi. Jangan menggunakan foto
absensi sebagai foto direktori.

## 3. Mahasiswa

### Pengaturan dan data diri

1. Buka menu `Pengaturan` lalu tab `Profil`.
2. Mahasiswa melihat halaman `Data diri` dengan identitas terkunci: username,
   NIM, email, Komsat, Divisi, angkatan, dan status penerima.
3. Lengkapi atau ubah jenis kelamin, agama, golongan darah, tanggal lahir,
   domisili, dan nomor HP, lalu pilih `Simpan`.
4. Unggah foto profil JPG, JPEG, atau PNG maksimal 2 MB. Foto baru menggantikan
   foto lama; foto dapat dihapus dari form.
5. Tab `Keamanan` dan `Tampilan` tetap tersedia sesuai hak akses.

Mahasiswa tidak dapat mengubah identitas terkunci dan tidak dapat menghapus
akun sendiri. Penghapusan atau penonaktifan akun hanya dilakukan Internal
Manajemen melalui menu `Mahasiswa`.

### Login dan dashboard

1. Buka halaman `Login`.
2. Isi `Username` dan `Password`.
3. Setelah berhasil, buka `Dashboard`.
4. Gunakan kartu ringkasan untuk melihat total poin, kegiatan diikuti,
   kehadiran valid, dan koreksi menunggu. Kartu `Total Poin` juga merinci
   `Kredit Peserta`, `Kredit Panitia`, `Kredit Pemateri`, dan `Koreksi`.

Akun nonaktif tidak dapat login.

### Mendaftar kegiatan

1. Buka `Kegiatan` atau `Katalog Kegiatan`.
2. Pilih kegiatan yang sesuai divisi Anda.
3. Baca detail lokasi, waktu, kuota, target divisi, dan bobot poin.
4. Pilih `Daftar kegiatan`.
5. Pastikan status pendaftaran berubah menjadi `Terdaftar`.
6. Bila belum dikunci dan perlu membatalkan, gunakan `Batalkan pendaftaran`.

Pendaftaran default menggunakan peran `Peserta`. Perubahan ke `Panitia` atau
`Pemateri` dilakukan Internal Manajemen.

### Melakukan absensi

1. Buka detail kegiatan yang status pendaftarannya `Terdaftar`.
2. Pilih `Absen` atau `Check-in`.
3. Izinkan akses lokasi browser.
4. Tunggu status lokasi terbaca dan pastikan akurasi berada dalam batas.
5. Izinkan akses kamera, ambil foto selfie, dan periksa preview.
6. Pastikan urutannya jelas: lokasi, foto, lalu kirim.
7. Pilih `Kirim absensi`.
8. Baca status `Menunggu tinjau`, `Valid`, atau `Ditolak`.

Absensi hanya dapat dilakukan dalam jendela waktu kegiatan, di dalam radius
yang ditentukan, dengan pendaftaran aktif. Sistem mencegah duplikasi
berdasarkan `pendaftaran_id`.

### Melihat kehadiran dan poin

1. Buka `Riwayat Kehadiran` untuk melihat check-in dan statusnya.
2. Buka `Riwayat Poin` untuk melihat transaksi ledger.
3. Total poin berasal dari penjumlahan transaksi yang tercatat, termasuk
   transaksi `kredit` dan `koreksi`. Rincian peran pada dashboard memakai
   transaksi kredit dari kehadiran valid dan selalu direkonsiliasi dengan total
   ledger.

### Mengajukan koreksi

1. Buka `Koreksi`.
2. Pilih kegiatan dan, bila tersedia, pendaftaran terkait.
3. Pilih jenis `Belum absen`, `Poin belum masuk`, `Data salah`, atau `Lainnya`.
4. Isi alasan secara jelas.
5. Lampirkan bukti jika diperlukan oleh form.
6. Pilih `Ajukan koreksi`.
7. Pantau status `Menunggu`, `Disetujui`, atau `Ditolak`.

## 4. Fitur fase 2 yang belum tersedia

Dokumentasi ini tidak menjanjikan fitur berikut sebagai fitur aktif:

- Face matching, face recognition, dan liveness detection.
- Check-out.
- Penalti atau poin negatif otomatis.
- Aplikasi mobile native.
- API publik pihak ketiga dan WebSocket.
- Deteksi mock location yang andal.
