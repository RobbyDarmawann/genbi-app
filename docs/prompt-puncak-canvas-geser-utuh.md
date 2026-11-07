MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 6. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Puncak Wilayah: seluruh struktur jadi SATU kanvas geser (kartu selalu utuh)

## Keputusan desain final pemilik (menggantikan semua rancangan puncak sebelumnya)

Kutipan maksud pemilik: seluruh struktur organisasi tingkat Wilayah yang punya Pembina dibuat bisa digeser (scroll) sebagai SATU kesatuan — Pembina berderet ke kanan semua; kalau digeser, bagian kiri ikut tertutup/tergeser (bukan strip terpisah). Kalau lebar struktur melebihi batas grup, strukturnya yang digeser — tampilan awal tetap memperlihatkan struktur dengan kartu yang UTUH. Berlaku HANYA untuk tingkat Wilayah yang punya Pembina; Komsat (dan Wilayah tanpa Pembina) tetap seperti sekarang, tidak bisa digeser.

Masalah saat ini yang dibuktikan screenshot pemilik (periode 2022/2023, 3 Pembina): baris puncak flex-wrap membuat Pembina ketiga (Siti Murtafiah Mooduto) jatuh sendirian ke baris kedua di tengah, garis penghubung antar puncak terputus acak, dan batang ke tingkat 2 berbelok dari tengah baris pertama ke anak bungkus itu. Semua itu hilang dengan desain kanvas di bawah.

## BAGIAN 1 — Struktur kanvas (desktop ≥768 px, HANYA bila kelompok Wilayah DAN ada Pembina)

Di komponen `OrgChartGroup` (berkas `resources/js/pages/public/kepengurusan.tsx`), bila `isWilayah && semuaPembina.length > 0`, render jalur BARU ini menggantikan blok desktop lama untuk kasus tersebut:

1. Pembungkus geser: `<div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">` — scrollbar TIDAK terlihat (pola rumah yang sudah dipakai strip mobile), tetapi area tetap bisa digeser (roda tetikus geser / trackpad / seret).
2. Kanvas dalam: `<div className="mx-auto w-max">` berisi SELURUH struktur desktop grup ini sebagai satu kesatuan: baris puncak + garis ke tingkat 2 + tingkat 2 + tingkat 3. Karena `w-max`, lebar kanvas = lebar alami struktur; karena `mx-auto`, bila struktur lebih sempit dari grup ia terpusat seperti sekarang; bila lebih lebar, ia bisa digeser dan kartu tidak pernah terpotong di tengah (yang di luar layar adalah kartu utuh berikutnya, tergeser masuk secara utuh).
3. Di dalam kanvas, struktur dibangun PERSIS seperti logika lama yang simetris (pola sebelum rangkaian Pembina):
    - Baris puncak: flex `justify-center gap-8` TANPA wrap, berisi kolom-kolom `puncak` (Ketua Umum pertama, lalu semua Pembina), kartu size **featured**.
    - PENEGASAN POSISI DARI SKETSA PEMILIK (jangan ditafsirkan lain): Ketua Umum adalah kartu PERTAMA DI KIRI baris puncak — ia BUKAN di tengah baris dan baris TIDAK dipusatkan pada dirinya. Tingkat 2 menempel DI BAWAH KETUA UMUM: bar tingkat 2 membentang dari titik tengah kartu tingkat-2 pertama sampai titik tengah kartu tingkat-2 terakhir, dan pasangan tingkat 2 itu diposisikan sedemikian rupa sehingga titik tengah barnya segaris vertikal dengan titik tengah Ketua Umum (batang dari Ketua turun LURUS ke tengah bar tingkat 2). Pembina berderet ke kanan SETELAH Ketua dan tidak memengaruhi posisi tingkat 2 sama sekali. Di dalam kanvas, cara mencapai ini: tingkat 2 JANGAN dipusatkan terhadap kanvas (bukan `mx-auto`/grid terpusat penuh) — letakkan blok tingkat 2 berlabuh pada kolom Ketua (mis. blok tingkat 2 selebar grid-nya ditempatkan dengan tepi kiri sejajar tepi kiri kolom Ketua dikurangi setengah selisih lebar, atau teknik lain yang kamu buktikan dengan pengukuran: titik tengah bar tingkat 2 == titik tengah Ketua Umum, selisih ≤ 2 px, untuk tier2 berisi 2 dan 3 kartu).
    - Tiap kolom puncak: kartu + (bila ada tier bawah) stub vertikal `h-8` + segmen bar horizontal di `bottom-8` pola setengah-gap persis seperti blok dual lama (kolom pertama `left-1/2 -right-4`, tengah `-left-4 -right-4`, terakhir `right-1/2 -left-4` dengan gap-8 → segmen `-right-4`/`-left-4`).
    - Sesudah baris puncak: TIDAK ada garis sibling. Batang ke tingkat 2 dibuat dari segmen lanjutan di kolom-kolom? TIDAK — ikuti pola blok dual LAMA sebelum amendemen: kontainer puncak `flex flex-col items-center` dengan baris kartu, lalu satu segmen vertikal `h-8 w-0.5` di tengah BARIS (yang untuk kasus multi jatuh di tengah kerumunan puncak — itu sebabnya pemilik menggambar batang dari Ketua). Maka khusus kanvas ini: batang ke tingkat 2 = segmen vertikal lanjutan HANYA di kolom Ketua Umum (idx 0): kolom Ketua berisi kartu + stub h-8 + bar setengah-gap + segmen lanjutan h-8 (total garis h-16); kolom Pembina berisi kartu + stub h-8 + bar setengah-gap + pengganjal tak terlihat h-8. Pola ini sudah pernah ada di kode (amendemen) — pakai kembali persis.
    - Tingkat 2 di dalam kanvas: grid seperti lama (`max-w-4xl` dengan kolom sesuai jumlah tier2) tetapi DIPOSISIKAN mengikuti penegasan posisi di atas (berlabuh pada Ketua, BUKAN terpusat terhadap kanvas); bar tingkat 2 kolom pertama memakai `left-1/2` SELALU, tanpa penyesuaian khusus.
    - Tingkat 3: grid seperti lama di dalam kanvas.
4. Grup Wilayah tanpa Pembina & semua grup Komsat: render jalur lama di luar kanvas (tidak ada pembungkus geser sama sekali).

## BAGIAN 2 — Mobile (<768 px)

Tidak berubah: rel vertikal dengan strip Pimpinan Utama (Ketua pertama, lalu Pembina), scrollbar tersembunyi. Kanvas geser BAGIAN 1 hanya untuk desktop (`hidden md:block` tetap).

## BAGIAN 3 — Yang TIDAK berubah

- Logika pengumpulan (`semuaPembina`, `ketua`, `puncak`, tier2/tier3): TIDAK disentuh.
- Tingkat 2/3 untuk jalur non-kanvas, Komsat, periode tanpa Pembina: pixel-identik.
- Perilaku flip kartu: tidak disentuh.

## BAGIAN 4 — Verifikasi terukur (Playwright/Chromium)

Bukti angka + screenshot tiap kasus pada 360 / 768 / 1280 / 1536 px:

1. **2022/2023 (3 Pembina)** — kasus yang dilaporkan kacau: (a) keempat kartu puncak SATU baris (Ketua + 3 Pembina), tidak ada kartu jatuh ke baris kedua; (b) garis penghubung antar puncak utuh menyambung; (c) tidak ada kartu terpotong di tengah pada posisi geser awal; (d) menggeser kanvas menggerakkan puncak DAN tingkat 2 bersama (buktikan dengan screenshot sebelum/sesudah geser pada 1280: Sekretaris/Bendahara ikut bergeser); (e) tidak ada scrollbar terlihat; (f) dokumen overflow 0.
2. **2018/2020 (4 Pembina)**: lima kartu satu baris utuh; pada 768 kanvas tergeser untuk melihat Pembina terjauh dan semua kartu tetap utuh; dokumen overflow 0.
3. **2024/2025 (1 Pembina)**: pasangan tampil terpusat seperti grup biasa; kanvas tidak menimbulkan perbedaan visual dari jalur lama selain batang dari Ketua.
4. **Periode aktif tanpa Pembina** & **Komsat UNG/IAIN/UG**: TIDAK ada pembungkus geser (buktikan dari struktur/DOM atau pengukuran: tidak ada elemen overflow-x-auto baru di grup itu) dan tampilan identik lama.
5. **Mobile 360**: tidak berubah.

## BAGIAN 5 — LARANGAN & GERBANG

- DILARANG `php artisan wayfinder:generate` manual; berkas generated jangan disentuh; `npm run build` boleh apa adanya.
- Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test verifikasi bila perlu). JANGAN commit.
- Gerbang: suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — angka persis, akuntansi klop.

## BAGIAN 6 — LAPORAN AKHIR

(1) Struktur kanvas final (kelas pembungkus & kanvas, kondisi rendernya); (2) bagaimana batang Ketua & bar tingkat 2 bertemu (posisi mendarat terukur kasus 1); (3) bukti 5 kasus BAGIAN 4 termasuk bukti geser bersama; (4) konfirmasi Komsat & tanpa-Pembina bebas pembungkus geser; (5) hasil gerbang; (6) git status. Tidak ada commit.
