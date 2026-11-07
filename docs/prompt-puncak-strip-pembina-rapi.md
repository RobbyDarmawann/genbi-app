MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 5. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Puncak kepengurusan: strip Pembina diganti grid utuh sejajar (tanpa crop, tanpa scrollbar)

## Masalah terverifikasi dari screenshot pemilik & kode terakhir

Prompt sebelumnya (`prompt-puncak-ketua-di-tengah`) TIDAK terimplementasi di kode yang berjalan: di `resources/js/pages/public/kepengurusan.tsx` TIDAK ada strip absolut `left-1/2 ml-[161px]`, tidak ada garis penghubung `top-[193px]`. Yang ter-render adalah rancangan LAMA dari prompt perbaikan sebelumnya (baris puncak flex terpusat `justify-center`, gap-8, dan `overflow-x-auto` untuk `puncak.length > 2`, dengan scrollbar bawaan peramban yang terlihat).

Hasilnya di layar: kartu Pembina pertama KEPOTONG di tepi (teks nama terpotong) dan scrollbar abu-abu peramban terlihat di bawah baris puncak. Itu yang harus hilang.

## Desain yang WAJIB dihasilkan (desktop ≥768 px, kelompok Wilayah dengan Pembina)

```
                    [ Ketua Umum ]   [ Pembina 1 ]   [ Pembina 2 ]
                          │
              ┌───────────┴───────────┐
           [ Sekretaris ]       [ Bendahara ]
```

1. **Baris puncak = satu flex NON-scroll, terpusat seperti grup biasa**: `flex flex-wrap justify-center gap-8`. Semua kartu puncak (Ketua Umum pertama, lalu semua Pembina) tampil UTUH — tidak ada kartu yang terpotong, tidak ada `overflow-x-auto`/`overflow-hidden` di baris puncak desktop, dan TIDAK ada scrollbar dalam bentuk apa pun di area puncak.
2. **Kartu puncak memakai ukuran MEDIUM** (`KepengurusanPlayingCard` size `medium`, lebar 240 px pada basis / 255 px pada sm — verifikasi dari komponen), BUKAN featured 290 px. Alasan terukur: 5 kartu featured (5×290 + 4×32 = 1.578 px) tidak muat di lebar grup mana pun; 5 kartu medium (5×255 + 4×32 = 1.403 px) muat utuh pada viewport 1536 px ke atas, dan pada lebar di antara itu baris membungkus (wrap) secara rapi ke baris berikutnya dengan kartu tetap utuh — jauh lebih baik daripada terpotong. Perilaku flip kartu tidak berubah (ukuran medium sudah dipakai tingkat 2 selama ini).
3. **Sumbu Ketua Umum**: titik tengah kartu Ketua Umum harus sedekat mungkin ke sumbu tengah grup. Karena barisnya flex terpusat, catat selisih terukurnya di laporan (kasus 1 Pembina akan simetris sempurna = 0 atau hampir 0; kasus banyak Pembina selisihnya adalah konsekuensi jumlah kartu ganjil/genap — laporkan angkanya apa adanya, jangan diakali dengan margin negatif atau transform).
4. **Garis penghubung antar kartu puncak**: SATU garis horizontal di tengah-tinggi kartu (50% tinggi kartu medium = 170 px dari atas baris) membentang dari titik tengah kartu Ketua Umum ke titik tengah kartu Pembina terakhir. Implementasi per kolom seperti pola yang sudah ada (segmen setengah-gap: kartu pertama `left-1/2 -right-4`, kartu tengah `-left-4 -right-4`, kartu terakhir `-left-4 right-1/2`, pada posisi `absolute top-[170px]`), TANPA stub vertikal — garis ini murni menyamping. Bila baris membungkus (wrap) ke dua baris, garis HANYA digambar pada baris pertama (kartu-kartu yang sebidang dengan Ketua Umum); kartu di baris bungkus tidak mendapat garis (dapat diterima & laporkan).
5. **Garis turun ke tingkat 2**: SATU garis vertikal dari titik tengah bawah kartu Ketua Umum ke tengah bar tingkat 2, cara menggambarnya: kolom Ketua Umum berisi kartu + segmen vertikal `relative z-0 h-8 w-0.5 bg-border` + segmen bar horizontal setengah-gap di `absolute bottom-8` (seperti pola kolom pertama yang sudah ada); kolom Pembina berisi kartu + segmen bar yang sama + pengganjal tak terlihat `h-8` TANPA segmen vertikal lanjutan. TIDAK ada elemen garis vertikal sibling sesudah baris kartu. (Ini pola kolom yang sudah ada di kode sekarang — pertahankan persis, yang berubah hanya: ukuran kartu featured→medium, `justify-center` tetap, HAPUS `overflow-x-auto` dan cabang `puncak.length > 2` pada pembungkus baris, dan posisi bar penghubung dari `bottom-8` menjadi `top-[170px]`... PERHATIKAN: bila bar penghubung di `top-[170px]`, segmen vertikal Ketua di bawah kartu dan bar setengah-gap TIDAK lagi dipakai untuk penghubung antar-puncak; bar tingkat 2 menerima batang lewat cara lama: sesudah baris puncak, di dalam kontainer `flex flex-col items-center`, TIDAK ada garis sibling — batang ke tingkat 2 adalah segmen vertikal di kolom Ketua saja yang diteruskan... Agar tidak bingung, ikuti struktur final di BAGIAN 1 dengan tepat.)

## BAGIAN 1 — Struktur final blok desktop hasMultiPuncak

Ganti blok desktop `hasMultiPuncak` menjadi struktur ini (nama kelas persis; sesuaikan hanya bila konflik dengan format proyek):

```tsx
<div className="relative flex flex-col items-center">
    <div className="flex flex-wrap justify-center gap-8">
        {puncak.map((entry, idx) => (
            <div
                key={entry.id}
                className="relative flex w-[240px] flex-none flex-col items-center sm:w-[255px]"
            >
                <KepengurusanPlayingCard entry={entry} size="medium" />
                {(tier2.length > 0 || tier3.length > 0) && (
                    <>
                        {/* garis penghubung menyamping di tengah-tinggi kartu */}
                        <div
                            aria-hidden="true"
                            className={cn(
                                'absolute top-[170px] z-0 h-0.5 bg-border',
                                idx === 0 && '-right-4 left-1/2',
                                idx > 0 &&
                                    idx < puncak.length - 1 &&
                                    '-right-4 -left-4',
                                idx === puncak.length - 1 &&
                                    'right-1/2 -left-4',
                            )}
                        />
                        {/* kolom Ketua: stub turun; kolom Pembina: pengganjal */}
                        {idx === 0 ? (
                            <div
                                aria-hidden="true"
                                className="relative z-0 h-8 w-0.5 bg-border"
                            />
                        ) : (
                            <div aria-hidden="true" className="h-8" />
                        )}
                    </>
                )}
            </div>
        ))}
    </div>
</div>
```

Syarat tambahan:

- Batang dari kolom Ketua (h-8) mendarat di bar tingkat 2: grid tingkat 2 terpusat (`w-full max-w-4xl`), titik tengah grid = sumbu grup. Untuk kasus 1 Pembina (baris puncak simetris), titik tengah Ketua == sumbu grup sehingga batang vertikal lurus sempurna. Untuk kasus asimetris, hubungkan batang ke bar tingkat 2 dengan cara yang sama seperti pola lama (batang tetap vertikal di kolom Ketua; bar tingkat 2 kolom pertama memakai `left-1/2` SELALU — penyesuaian `left-0` tetap terlarang).
- Kartu di baris bungkus (wrap): bila sebuah kolom Pembina membungkus ke baris kedua, segmen penghubung `top-[170px]`-nya akan menggambar garis yatim di baris itu — cegah dengan cara terukur: ukur pada verifikasi; bila kasus nyata (2018/2020 pada 768 px) membungkus, sembunyikan segmen penghubung untuk kartu yang TIDAK sebidang dengan Ketua memakai pendekatan sederhana yang kamu pilih dan jelaskan (mis. garis penghubung hanya dirender untuk idx yang berada di baris pertama berdasarkan perhitungan lebar yang deterministik, atau bungkus dinonaktifkan khusus agar semua kartu tetap satu baris dengan ukuran medium). Keputusanmu harus dibuktikan dengan screenshot 768 px kasus 2018/2020: tidak ada garis yatim, tidak ada kartu terpotong.
- Ukuran kartu tingkat 2 dan jalur puncak tunggal & Komsat: TIDAK berubah. Khusus puncak tunggal (tanpa Pembina) kartu tetap featured seperti sekarang.

## BAGIAN 2 — Scrollbar disembunyikan konsisten (mobile & strip lain)

Pola rumah yang sudah ada di proyek untuk strip geser mobile: `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`. Terapkan pola yang sama ke SEMUA strip `overflow-x-auto` di berkas ini yang belum memakainya (termasuk strip Pimpinan Utama mobile bila belum, strip linimasa periode, dan strip Komsat), supaya tidak ada scrollbar peramban mentah yang terlihat di mana pun pada halaman ini. Jangan mengubah perilaku gesernya.

## BAGIAN 3 — Mobile (<768 px)

Tidak berubah selain BAGIAN 2: strip Pimpinan Utama tetap Ketua pertama lalu Pembina, tanpa garis, scrollbar tersembunyi.

## BAGIAN 4 — Verifikasi terukur (Playwright/Chromium)

Bukti angka + screenshot tiap kasus pada 360 / 768 / 1280 / 1536 px:

1. **2024/2025 (1 Pembina)**: kedua kartu utuh & sebidang; garis penghubung menyamping terlihat di tengah-tinggi kartu; batang vertikal lurus dari Ketua ke tengah bar tingkat 2; selisih titik tengah Ketua vs sumbu grup dilaporkan (target ≤ 2 px); tidak ada scrollbar terlihat di area puncak.
2. **2018/2020 (4 Pembina)**: kelima kartu tampil UTUH (tidak ada teks terpotong) pada 1536; pada 1280 & 768 tampilkan hasil wrap-mu dan buktikan: tidak ada kartu terpotong, tidak ada garis yatim, tidak ada scrollbar terlihat, dokumen overflow 0.
3. **2022/2023 (3 Pembina)**: pola sama; 4 kartu utuh satu baris pada 1280 (4×255 + 3×32 = 1.116 px ≤ lebar konten grup pada 1280? bila tidak muat dan membungkus, buktikan kerapian yang sama seperti kasus 2).
4. **Periode aktif tanpa Pembina** & **Komsat**: identik lama.
5. **Mobile 360**: strip geser tanpa scrollbar terlihat (pola BAGIAN 2 bekerja).

## BAGIAN 5 — LARANGAN & GERBANG & LAPORAN

- DILARANG `php artisan wayfinder:generate` manual; berkas generated jangan disentuh; `npm run build` boleh apa adanya.
- Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test verifikasi bila perlu). Logika pengumpulan puncak TIDAK diubah. JANGAN commit.
- Gerbang: suite penuh, Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — angka persis.
- LAPORAN AKHIR: (1) struktur baris puncak final + ukuran kartu yang dipakai + bagaimana wrap/garis yatim ditangani beserta buktinya; (2) selisih titik tengah Ketua vs sumbu grup untuk kasus 1 & 2; (3) daftar strip yang diberi pola sembunyi-scrollbar; (4) bukti 5 kasus; (5) hasil gerbang; (6) git status.
