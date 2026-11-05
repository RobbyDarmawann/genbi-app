Lakukan UJI TERIMA END-TO-END untuk Sistem Informasi GenBI Gorontalo Terintegrasi. Acuan kebenaran tunggal: docs/01-analisis-sistem.md (alur To-Be Bagian 5 dan KF-00..KF-12), docs/03-usecase.mmd, dan .github/copilot-instructions.md. Jangan menambah fitur dan jangan mengubah logika bisnis pada tahap ini; bila menemukan cacat, CATAT dulu dalam laporan, lalu tawarkan perbaikan terpisah — jangan diam-diam memperbaiki sambil menguji.

Persiapan:
1. Gunakan database lokal khusus pengujian/demo. Jalankan migrate + seeder master + DemoSeeder sesuai README. Catat akun demo yang dipakai (internal dan mahasiswa demo) dan kegiatan demo yang dipakai (satu kegiatan yang akan dibuka absensinya selama uji).
2. Jalankan aplikasi (composer dev / php artisan serve + npm run dev sesuai setup proyek) dan catat URL lokalnya.
3. Buat file hasil: docs/08-hasil-uji-end-to-end.md. Semua skenario di bawah WAJIB masuk sebagai baris tabel: ID | Alur | Aktor | Langkah ringkas | Hasil diharapkan (sesuai rancangan) | Hasil aktual (dari eksekusi nyata) | Bukti | Status LULUS/GAGAL/BLOKIR.

Cara menguji: jalankan sebanyak mungkin sebagai Feature Test otomatis dan/atau browser test yang tersedia di proyek. Untuk langkah yang memang membutuhkan perangkat nyata (izin GPS dan kamera), tandai BLOKIR dengan alasan spesifik dan tulis langkah uji manual yang harus saya lakukan sendiri di HP — jangan menyatakan LULUS untuk langkah yang tidak benar-benar dijalankan.

SKENARIO WAJIB:

A. Guest (tanpa login)
E2E-01 Buka Beranda: tampil nama GenBI Gorontalo, kegiatan terbaru dari database, Komsat aktif. LULUS bila datanya berasal dari DB (bukan hardcode) dan tidak ada error.
E2E-02 Buka Aktivitas: hanya kegiatan publik (bukan draft/dibatalkan); koordinat presisi, radius, dan daftar peserta TIDAK tampil.
E2E-03 Buka Statistik: angka ringkasan dan leaderboard cocok dengan isi database demo (hitung ulang dari poin_transaksi dan bandingkan); tidak ada NIM/foto/koordinat yang terekspos.
E2E-04 Buka Kepengurusan: menampilkan direktori PERIODE AKTIF dengan filter Komsat yang bekerja.
E2E-05 Guest membuka URL dashboard/route login-user: diarahkan ke login, bukan error 500.

B. Fondasi akun (Internal Manajemen)
E2E-06 Login username `internal` berhasil masuk dashboard IM; login dengan password salah gagal dengan pesan jelas; route register publik TIDAK bisa dipakai membuat akun (404/redirect aman).
E2E-07 IM membuat satu akun mahasiswa uji baru (username e2e_mhs) lengkap dengan Komsat+Divisi yang konsisten; pembuatan dengan divisi dari Komsat lain DITOLAK.
E2E-08 Mahasiswa baru bisa login dengan username-nya; mahasiswa yang dinonaktifkan IM tidak bisa login.

C. Kegiatan → Target → Pendaftaran
E2E-09 IM membuat kegiatan uji baru: titik lokasi + radius terisi, bobot peserta/panitia/pemateri terisi, divisi target = satu divisi yang memuat e2e_mhs, status diterbitkan.
E2E-10 e2e_mhs (divisi target) melihat kegiatan itu di "Kegiatan untuk Saya" dan berhasil menekan Ikut: tepat SATU baris pendaftaran, peran peserta.
E2E-11 Mahasiswa demo dari divisi BUKAN target: kegiatan tampil baca-saja di jadwal umum dan pendaftaran DITOLAK di backend (bukan hanya tombol disembunyikan).
E2E-12 e2e_mhs menekan Ikut dua kali / refresh saat submit: tetap satu pendaftaran (idempoten, tidak ada duplikat).
E2E-13 IM mengubah peran e2e_mhs menjadi panitia sebelum absensi: bobot potensial berubah mengikuti bobot panitia. Kembalikan ke peserta sebelum lanjut, atau catat peran final yang dipakai untuk perhitungan poin di skenario berikutnya.

D. Absensi → Poin (alur inti)
E2E-14 Di dalam jendela absensi, e2e_mhs submit absensi dengan koordinat tepat di titik kegiatan dan foto uji: status kehadiran = valid, jarak tercatat masuk akal (≈0–radius), dan tepat SATU poin_transaksi kredit sebesar bobot perannya dibuat dalam transaksi yang sama. Saldo poin e2e_mhs bertambah persis sebesar itu.
E2E-15 Submit absensi kedua untuk kegiatan yang sama: DITOLAK/idempoten — tetap satu kehadiran dan satu transaksi poin.
E2E-16 Mahasiswa terdaftar lain submit dengan koordinat jauh di luar radius: status ditolak, alasan tampil, poin TIDAK bertambah.
E2E-17 Submit di luar jendela absensi (gunakan kegiatan demo yang jendelanya sudah lewat): DITOLAK, poin tidak bertambah.
E2E-18 Uji akurasi buruk: koordinat di dalam radius tetapi akurasi > 100 m menghasilkan status menunggu_tinjau dan poin BELUM bertambah. Bila skenario ini tidak bisa dibuat dengan test otomatis, tandai BLOKIR dan tulis cara uji manualnya.
E2E-19 Foto kehadiran hanya dapat dibuka oleh pemiliknya dan IM; mahasiswa lain dan Guest mendapat 403/404.

E. Tinjauan, Koreksi, Kunci (Internal Manajemen)
E2E-20 IM menyetujui kehadiran menunggu_tinjau dari E2E-18: status menjadi valid dan poin masuk TEPAT SATU KALI (setujui dua kali/refresh tidak menggandakan poin).
E2E-21 Mahasiswa yang absensinya ditolak (E2E-16) mengajukan koreksi dengan alasan + bukti: koreksi tampil di inbox IM berstatus menunggu.
E2E-22 IM menyetujui koreksi itu: tepat satu transaksi poin tipe koreksi tercatat; transaksi lama tidak diubah. Menyetujui ulang tidak menggandakan poin.
E2E-23 IM mencoba mengunci kegiatan yang masih memiliki item menunggu: DITOLAK dengan daftar penghambat. Setelah semua bersih, kunci berhasil; sesudah terkunci: pendaftaran baru, ubah peran, edit parameter, dan absensi baru semuanya DITOLAK di backend.

F. Dashboard, Statistik, Laporan
E2E-24 Dashboard e2e_mhs: total poin = SUM poin_transaksinya, riwayat kehadiran dan riwayat poin tampil konsisten dengan skenario D–E, peringkat leaderboard menempatkannya sesuai total poin.
E2E-25 Dashboard evaluasi IM dengan filter Komsat kegiatan uji: total kegiatan, partisipasi, kehadiran valid, dan total poin cocok dengan data hasil skenario di atas; mengubah filter mengubah angka secara masuk akal.
E2E-26 Ekspor Excel oleh IM: file terunduh, sheet Ringkasan/Rekap Komsat/Kegiatan/Kehadiran/Transaksi Poin ada, angka total sama dengan dashboard; mahasiswa TIDAK bisa mengakses URL ekspor.
E2E-27 Leaderboard publik terbarui mengikuti hasil skenario (nama e2e_mhs muncul dengan total poin yang benar).

G. Konsistensi rancangan & scope (audit akhir)
E2E-28 Periksa bahwa TIDAK ADA role selain internal_manajemen dan mahasiswa, tidak ada route register publik, tidak ada face matching/liveness, tidak ada penalti/poin negatif otomatis, tidak ada check-out. Setiap temuan dinyatakan sebagai pelanggaran scope.
E2E-29 Periksa daftar Komsat: tepat 5 dengan kode UNG, IAIN, UG, UMGO, UBM — tidak ada kode IAINSAG/UNIGO/UIN/UBMG sebagai data baku.
E2E-30 Jalankan seluruh test suite + build satu kali di akhir dan catat hasilnya apa adanya.

Penutup laporan (di docs/08-hasil-uji-end-to-end.md dan ringkas di chat):
1. Tabel seluruh skenario E2E-01..E2E-30 dengan status masing-masing.
2. Ringkasan angka: total skenario, LULUS, GAGAL, BLOKIR.
3. Daftar cacat urut keparahan: ID skenario, langkah reproduksi, hasil aktual vs diharapkan, dugaan file/penyebab, dan usulan prompt perbaikan (gunakan format prompt perbaikan bug pada paket ini) — TANPA memperbaikinya sekarang.
4. Daftar langkah uji manual yang wajib saya lakukan sendiri di perangkat nyata: izin lokasi ditolak, izin kamera ditolak, GPS akurasi buruk, dan tampilan mobile 360 px untuk alur absensi.
5. Putusan akhir SATU dari tiga, berdasarkan bukti:
   - "SIAP DEMO UAS" — semua skenario inti (A–F) LULUS dan tidak ada cacat kritis;
   - "SIAP DENGAN CATATAN" — ada GAGAL/BLOKIR non-kritis yang terdaftar jelas;
   - "BELUM SIAP" — ada kegagalan pada alur inti (pendaftaran, absensi, poin, kunci).
   Dilarang menulis putusan tanpa bukti eksekusi per skenario.
Sarankan pesan commit: `test: add end-to-end acceptance results`.