MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 6. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Amendemen: urutan puncak & garis hierarki Pembina–Ketua Umum

Tugas ini MENGUBAH hasil tugas sebelumnya (commit "feat: place Pembina beside Ketua Umum as joint board top") di berkas yang sama: `resources/js/pages/public/kepengurusan.tsx`, komponen `OrgChartGroup`. Dua keputusan lama DIBATALKAN dan diganti keputusan pemilik terbaru:

- DIBATALKAN: Pembina di kiri, Ketua Umum di kanan.
- DIBATALKAN: garis turun ke tingkat 2 berasal dari TENGAH pasangan.
- BARU: **Ketua Umum di KIRI, semua Pembina di KANAN-nya** dalam satu baris puncak.
- BARU: **satu-satunya garis yang turun ke tingkat bawah berasal dari KETUA UMUM** (batang utama/trunk menempel di bawah kartu Ketua Umum), dan dari batang itu ada bar horizontal bercabang ke setiap kartu Pembina.

Sketsa hasil akhir (desktop):

```
[Ketua Umum]   [Pembina 1]   [Pembina 2]   ... (semua Pembina, urutan simpan)
     │              │             │
     ├──────────────┴─────────────┘    bar horizontal penghubung
     │
     │   <- satu garis ini saja yang turun dari puncak ke tingkat 2
  tingkat 2 (Sekretaris Umum, Bendahara Umum, ...)
```

## BAGIAN 1 — Pengumpulan entri puncak (ganti logika lama)

Khusus kelompok Wilayah (kelompok Komsat tidak berubah sama sekali):

1. Kumpulkan **SEMUA** entri Pembina: yang `jabatan`-nya (trim, tidak peka huruf besar/kecil) diawali kata "Pembina" — pertahankan urutan simpan di antara sesama Pembina. (Fakta data: ada periode dengan 1 Pembina, ada yang 3, ada yang 4.)
2. `ketua` = entri **non-Pembina pertama** dalam daftar (apa pun judulnya).
3. Bila daftar Pembina TIDAK kosong:
    - `puncak = [ketua, ...semuaPembina]` (Ketua Umum selalu elemen pertama/kiri).
    - `tier2` = 3 entri non-Pembina berikutnya sesudah ketua; `tier3` = sisa entri non-Pembina.
4. Bila daftar Pembina kosong: pemotongan & tampilan LAMA persis seperti sebelum tugas Pembina pertama kali dikerjakan (puncak satu kartu). Jalur ini tidak boleh berubah.
5. Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test bila perlu). Dilarang mengubah controller/seeder/data.

## BAGIAN 2 — Garis hierarki desktop (≥768 px) untuk puncak baru

1. Baris puncak: flex, semua kartu ukuran `featured`, Ketua Umum pertama lalu Pembina-Pembina berikutnya, terpusat (`justify-center`) selama muat.
2. Geometri garis (ikuti teknik setengah-bar yang sudah dipakai tingkat 2 supaya presisi, jangan mengarang piksel bebas):
    - Dari bawah kartu **Ketua Umum**: garis vertikal (`w-0.5 bg-border`, h-8) — ini awal batang utama.
    - Dari bawah **tiap kartu Pembina**: garis vertikal pendek yang sama (h-8).
    - **Bar horizontal** (`h-0.5 bg-border`) di ujung bawah garis-garis pendek itu, membentang dari titik tengah Ketua Umum sampai titik tengah Pembina TERJAUH.
    - **Batang utama**: dari titik tengah Ketua Umum, garis vertikal yang sama DILANJUTKAN turun (h-8 lagi) sampai menyentuh bar horizontal tingkat 2. TIDAK ada garis turun lain dari baris puncak — garis dari tengah bar seperti implementasi sebelumnya HARUS hilang.
3. Wajib diverifikasi pada 768 px dan 1280 px bahwa batang utama selalu MENDARAT di atas bar horizontal tingkat 2 (tidak melayang di luar rentang bar). Bila pada suatu lebar batang meleset dari bar tingkat 2, sesuaikan rentang bar tingkat 2 seminimal mungkin (atau posisi baris puncak) dan laporkan penyesuaiannya secara eksplisit.
4. Bila tidak ada tier2/tier3: bar & batang tidak digambar (cukup kartu-kartu puncak).

## BAGIAN 3 — Baris puncak yang lebar (periode Pembina ≥3)

Total lebar baris puncak bisa melebihi kontainer pada periode dengan 3–4 Pembina (5 kartu featured). Aturannya:

- Kartu TIDAK BOLEH menyusut dan baris TIDAK BOLEH membungkus (wrap) ke baris kedua — konsep "sejajar" harus utuh.
- Bila baris tidak muat, baris puncak menjadi strip `overflow-x-auto` (kartu `flex-none`) JUGA di desktop, dengan garis-garis BAGIAN 2 digambar di dalam konten strip mengikuti geometri yang sama (batang tetap dari Ketua Umum).
- Dokumen halaman tidak boleh mendapat overflow horizontal global.
- Periode dengan 1–2 Pembina harus tetap tampil terpusat TANPA strip scroll di desktop, seperti pasangan yang sudah benar sekarang.

## BAGIAN 4 — Mobile (<768 px)

- Di dalam strip geser horizontal yang sudah ada (menempel rel, label "Pimpinan Utama", simpul rel dipertahankan): urutan kartu diganti menjadi **Ketua Umum pertama, lalu Pembina-Pembina** — cukup tukar urutannya.
- Di mobile TIDAK perlu menggambar batang/bar di dalam strip; sisanya persis implementasi strip yang sekarang.
- Dokumen tetap tanpa overflow horizontal global; kartu ukuran asli tidak menyusut.

## BAGIAN 5 — Verifikasi terukur (Playwright/Chromium, bukti sebelum–sesudah)

Pakai data lokal seeder historis; uji kasus-kasus ini pada 360 / 768 / 1280 px:

1. **Periode 1 Pembina** (mis. 2024/2025): Ketua Umum kiri, Pembina kanan; batang turun dari Ketua Umum; bar menyambung ke Pembina; batang mendarat di bar tingkat 2.
2. **Periode 4 Pembina** (2018/2020): Ketua Umum kiri + 4 Pembina berderet ke kanan; bar menjangkau Pembina terjauh; di desktop baris menjadi strip geser bila tidak muat (dokumen overflow 0); Ketua Umum TIDAK lagi jatuh ke tingkat 2.
3. **Periode 3 Pembina** (salah satu periode tengah): pola sama dengan kasus 2.
4. **Periode aktif demo tanpa Pembina**: identik dengan tampilan sebelum seluruh rangkaian tugas Pembina (Ketua Wilayah tunggal di puncak).
5. Kelompok Komsat pada periode mana pun: tidak berubah.

Sertakan screenshot dan/atau angka pengukuran tiap kasus di laporan.

## BAGIAN 6 — LARANGAN KERAS & GERBANG

- DILARANG menjalankan `php artisan wayfinder:generate` manual. Berkas `resources/js/actions/` & `resources/js/routes/` jangan disentuh. `npm run build` boleh apa adanya.
- JANGAN commit. Pemilik yang commit.
- Gerbang: test terkait + suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — laporkan angka persis, akuntansi suite klop (passed + skipped + failed = total).
- LAPORAN AKHIR: (1) logika pengumpulan puncak baru; (2) geometri garis yang diterapkan + hasil cek batang mendarat di bar tingkat 2 pada 768/1280; (3) perilaku baris lebar (kasus 4 Pembina) di desktop; (4) bukti verifikasi semua kasus BAGIAN 5; (5) hasil gerbang; (6) daftar berkas berubah (git status). Tidak ada commit.
