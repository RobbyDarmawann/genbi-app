MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 4. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Perbaikan kecil: garis menggantung di bawah baris terakhir tingkat 3

## Gejala terverifikasi dari screenshot pemilik (periode 2021/2022, grup Tingkat Wilayah)

Struktur kanvas geser sudah benar. Satu cacat tersisa: di bawah baris TERAKHIR kartu tingkat 3 (para Kadiv) masih tergambar segmen garis vertikal pendek yang turun lalu berhenti di ruang kosong — tidak menyambung ke kartu mana pun. Terlihat di bawah kolom kartu pertama (di bawah Tasya Dwias Amanda, di bawah Nur Amalia Katili, dan di bawah Cahyadi Mutiara pada baris terakhir).

## Dugaan akar (verifikasi di kode, jangan asal percaya)

Di `resources/js/pages/public/kepengurusan.tsx`, kolom kartu tingkat 3 kemungkinan me-render stub vertikal bawah (pola `h-6`/`h-8 w-0.5 bg-border` sesudah kartu) TANPA syarat — warisan dari pola kolom tingkat 2, padahal di bawah tingkat 3 tidak ada tingkat lanjutan. Periksa render kolom tingkat 3 di SEMUA jalur (jalur kanvas Wilayah ber-Pembina, jalur desktop biasa, dan jalur grup Komsat — screenshot menunjukkan grup Komsat pada halaman yang sama TIDAK menunjukkan cacat ini, jadi bandingkan dan samakan perilakunya), serta periksa juga jalur mobile bila pola yang sama ada di sana.

## BAGIAN 1 — Perbaikan

1. Hapus / beri syarat stub vertikal bawah pada kolom tingkat 3 sehingga TIDAK ada segmen garis apa pun yang dirender di bawah kartu tingkat 3, di semua jalur render.
2. JANGAN mengubah apa pun yang lain: garis penghubung antar kartu tingkat 3 (bar horizontal di atas kartu + stub PENDEK DI ATAS kartu yang menyambung ke bar itu) tetap ada persis seperti sekarang; konektor tingkat 2 → tingkat 3 tetap; seluruh geometri kanvas (offset Ketua, batang, bar tingkat 2) TIDAK disentuh; logika pengumpulan TIDAK disentuh.
3. Bila ternyata stub itu bukan di kolom tingkat 3 melainkan elemen lain (mis. sisa konektor tingkat 2), laporkan temuanmu apa adanya dan perbaiki elemen yang benar dengan perubahan seminimal mungkin.

## BAGIAN 2 — Verifikasi (Playwright/Chromium atau inspeksi DOM terukur)

1. Periode 2021/2022 grup Wilayah (kasus screenshot): sesudah perbaikan, hitung elemen garis vertikal (`w-0.5 bg-border` atau setara) yang berada DI BAWAH kartu tingkat 3 terakhir = harus 0; screenshot sebelum/sesudah pada area tingkat 3.
2. Periode dengan tingkat 3 sedikit (mis. 2024/2025) dan satu grup Komsat: tidak ada perubahan visual selain hilangnya garis menggantung bila sebelumnya ada.
3. Garis di ATAS kartu tingkat 3 dan semua konektor lain tetap tergambar (buktikan dari screenshot yang sama).

## BAGIAN 3 — LARANGAN & GERBANG

- Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test bila perlu). JANGAN commit. DILARANG `php artisan wayfinder:generate` manual; berkas generated jangan disentuh.
- Gerbang: suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — angka persis.

## BAGIAN 4 — LAPORAN AKHIR

(1) Elemen penyebab persisnya (kelas & lokasi di berkas) dan kenapa grup Komsat tidak terkena (bila memang beda jalur); (2) perubahan yang dibuat; (3) bukti verifikasi BAGIAN 2; (4) hasil gerbang; (5) git status.
