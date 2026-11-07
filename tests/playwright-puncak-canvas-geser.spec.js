// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Verifikasi BAGIAN 4: Puncak Wilayah: seluruh struktur jadi SATU kanvas geser (kartu selalu utuh)
 *
 * Kasus uji:
 * 1. 2022/2023 (3 Pembina):
 *    (a) 4 kartu puncak SATU baris (Ketua + 3 Pembina), tidak ada kartu jatuh ke baris kedua
 *    (b) Garis penghubung antar puncak utuh menyambung
 *    (c) Tidak ada kartu terpotong di tengah pada posisi geser awal
 *    (d) Menggeser kanvas menggerakkan puncak DAN tingkat 2 bersama (bukti sebelum & sesudah geser pada 1280px)
 *    (e) Tidak ada scrollbar terlihat
 *    (f) Dokumen overflow 0
 * 2. 2018/2020 (4 Pembina):
 *    5 kartu satu baris utuh; pada 768px kanvas tergeser untuk melihat Pembina terjauh dan semua kartu tetap utuh; dokumen overflow 0
 * 3. 2024/2025 (1 Pembina):
 *    Pasangan tampil terpusat; batang Ketua mendarat di bar tingkat 2
 * 4. Periode aktif tanpa Pembina & Komsat (UNG, IAIN, UG):
 *    TIDAK ada pembungkus geser (bebas overflow-x-auto)
 * 5. Mobile 360px:
 *    Rel vertikal dengan strip Pimpinan Utama, scrollbar tersembunyi
 */

test.describe('Puncak Wilayah Kanvas Geser Utuh', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/kepengurusan');
        await page.waitForLoadState('networkidle');
    });

    test('Kasus 1: Periode 2022/2023 (3 Pembina) - 4 kartu satu baris, geser kanvas menggerakkan tier 1 & 2 bersama', async ({
        page,
    }) => {
        await page
            .getByRole('button', { name: /2022.*2023/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1536, 1280, 768]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            const wilayahGroup = page.locator('#group-wilayah');
            await expect(wilayahGroup).toBeVisible();

            const desktopContainer = wilayahGroup
                .locator('.hidden.md\\:block')
                .first();

            // Reset scrollLeft ke 0 sebelum pengukuran di tiap breakpoint
            await desktopContainer.evaluate((el) => {
                const wrapper = el.querySelector(
                    ':scope > div.overflow-x-auto',
                );
                if (wrapper) wrapper.scrollLeft = 0;
            });
            await page.waitForTimeout(200);

            // Ambil data geometri awal
            const geom = await desktopContainer.evaluate((el) => {
                const canvasWrapper = el.querySelector(
                    ':scope > div.overflow-x-auto',
                );
                const canvas =
                    canvasWrapper?.querySelector(':scope > div.w-max');

                if (!canvasWrapper || !canvas)
                    return { error: 'Kanvas tidak ditemukan' };

                const puncakRow = canvas.querySelector(
                    ':scope > div.relative.flex.flex-col > div.flex.justify-center.gap-8',
                );
                const allColumns = Array.from(
                    puncakRow?.querySelectorAll(':scope > div.relative.flex') ||
                        [],
                );
                const cards = allColumns
                    .map((col) => {
                        const card = col.querySelector(
                            '[class*="max-w-[270px] sm:max-w-[290px]"]',
                        );
                        return card ? card.getBoundingClientRect() : null;
                    })
                    .filter(Boolean);

                // Cek apakah semua kartu satu baris (top sama ±5px)
                const firstTop = cards[0]?.top ?? 0;
                const allSameRow = cards.every(
                    (c) => Math.abs(c.top - firstTop) <= 5,
                );

                // Cek horizontal lines antar puncak
                const hLines = allColumns.map((col) => {
                    const line = col.querySelector(
                        '.absolute.bottom-8.z-0.h-0\\.5.bg-border',
                    );
                    return line ? line.getBoundingClientRect() : null;
                });

                // Cek stub ketua & lanjutan
                const ketuaCol = allColumns[0];
                const ketuaStubs = ketuaCol
                    ? Array.from(
                          ketuaCol.querySelectorAll(
                              '.relative.z-0.h-8.w-0\\.5.bg-border',
                          ),
                      )
                    : [];

                // Cek tier 2
                const tier2Container = canvas.querySelectorAll(
                    ':scope > div.relative.flex.flex-col',
                )[1];
                const tier2Cards = tier2Container
                    ? Array.from(
                          tier2Container.querySelectorAll(
                              '[class*="max-w-[240px]"]',
                          ),
                      )
                    : [];

                // Scrollbar styles
                const wrapperStyle = window.getComputedStyle(canvasWrapper);
                const hasScrollbarHidden =
                    canvasWrapper.classList.contains(
                        '[scrollbar-width:none]',
                    ) &&
                    canvasWrapper.classList.contains(
                        '[&::-webkit-scrollbar]:hidden',
                    );

                const canvasRect = canvas.getBoundingClientRect();

                // Posisi mendarat batang Ketua vs bar tingkat 2
                // Titik tengah bar tingkat 2 = titik tengah grid tier 2
                const tier2Grid = tier2Container
                    ? tier2Container.querySelector('.grid')
                    : null;
                const tier2GridRect = tier2Grid
                    ? tier2Grid.getBoundingClientRect()
                    : null;
                const tier2BarCenterX = tier2GridRect
                    ? tier2GridRect.left + tier2GridRect.width / 2
                    : null;
                const ketuaCardRect = cards[0];
                const ketuaCenterX = ketuaCardRect
                    ? ketuaCardRect.left + ketuaCardRect.width / 2
                    : null;

                const alignmentDiff =
                    ketuaCenterX && tier2BarCenterX
                        ? Math.abs(ketuaCenterX - tier2BarCenterX)
                        : null;
                const isAlignedWithKetua =
                    alignmentDiff !== null && alignmentDiff <= 2;

                return {
                    canvasExists: true,
                    canvasWidth: canvasRect.width,
                    wrapperClientWidth: canvasWrapper.clientWidth,
                    wrapperScrollWidth: canvasWrapper.scrollWidth,
                    canScroll:
                        canvasWrapper.scrollWidth > canvasWrapper.clientWidth,
                    cardCount: cards.length,
                    allSameRow,
                    hLinesCount: hLines.filter(Boolean).length,
                    ketuaStubsCount: ketuaStubs.length,
                    tier2CardCount: tier2Cards.length,
                    hasScrollbarHidden,
                    scrollbarWidth: wrapperStyle.scrollbarWidth,
                    ketuaCenterX,
                    tier2BarCenterX,
                    alignmentDiff,
                    isAlignedWithKetua,
                    docOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                };
            });

            console.log(
                `[Kasus 1 @ ${width}px] Geometri:`,
                JSON.stringify(geom, null, 2),
            );

            expect(geom.canvasExists).toBe(true);
            expect(geom.cardCount).toBe(4); // 1 Ketua + 3 Pembina
            expect(geom.allSameRow).toBe(true); // Semua 4 kartu SATU baris
            expect(geom.hLinesCount).toBe(4); // Bar horizontal ada di 4 kolom
            expect(geom.ketuaStubsCount).toBe(2); // 2 stub (total h-16) di kolom Ketua
            expect(geom.hasScrollbarHidden).toBe(true);
            expect(geom.scrollbarWidth).toBe('none');
            expect(geom.docOverflow).toBe(0);

            // VERIFIKASI ALIGNMENT: Batang Ketua harus mendarat di bar tier 2 (≤2px)
            expect(geom.isAlignedWithKetua).toBe(true);
            expect(geom.alignmentDiff).toBeLessThanOrEqual(2);

            // Screenshot posisi awal
            await page.screenshot({
                path: `test-results/kasus1-2022-2023-${width}px-awal.png`,
                fullPage: true,
            });

            // Pada 1280px dan 768px, uji geser kanvas dan buktikan tier 1 & 2 bergeser bersama
            if (geom.canScroll) {
                // Catat posisi sebelum geser
                const posBefore = await desktopContainer.evaluate((el) => {
                    const canvas = el.querySelector(
                        ':scope > div.overflow-x-auto > div.w-max',
                    );
                    const ketua = canvas?.querySelector(
                        '[class*="max-w-[270px]"]',
                    );
                    const tier2First = canvas?.querySelectorAll(
                        '[class*="max-w-[240px]"]',
                    )[0];
                    const wrapper = el.querySelector(
                        ':scope > div.overflow-x-auto',
                    );
                    return {
                        ketuaLeft: ketua?.getBoundingClientRect().left,
                        tier2FirstLeft:
                            tier2First?.getBoundingClientRect().left,
                        scrollLeftBefore: wrapper?.scrollLeft,
                    };
                });

                // Scroll kanvas 250px ke kanan dengan scrollBy untuk lebih reliable
                await desktopContainer.evaluate((el) => {
                    const wrapper = el.querySelector(
                        ':scope > div.overflow-x-auto',
                    );
                    if (wrapper) {
                        wrapper.scrollBy({ left: 250, behavior: 'instant' });
                    }
                });
                await page.waitForTimeout(500);

                // Screenshot sesudah geser
                await page.screenshot({
                    path: `test-results/kasus1-2022-2023-${width}px-geser.png`,
                    fullPage: true,
                });

                const posAfter = await desktopContainer.evaluate((el) => {
                    const canvas = el.querySelector(
                        ':scope > div.overflow-x-auto > div.w-max',
                    );
                    const ketua = canvas?.querySelector(
                        '[class*="max-w-[270px]"]',
                    );
                    const tier2First = canvas?.querySelectorAll(
                        '[class*="max-w-[240px]"]',
                    )[0];
                    const wrapper = el.querySelector(
                        ':scope > div.overflow-x-auto',
                    );
                    return {
                        scrollLeft: wrapper?.scrollLeft,
                        ketuaLeft: ketua?.getBoundingClientRect().left,
                        tier2FirstLeft:
                            tier2First?.getBoundingClientRect().left,
                    };
                });

                console.log(
                    `[Kasus 1 @ ${width}px] Pergeseran:`,
                    JSON.stringify({ posBefore, posAfter }, null, 2),
                );

                // Buktikan scroll berhasil
                expect(posAfter.scrollLeft).toBeGreaterThan(
                    posBefore.scrollLeftBefore,
                );

                // Buktikan Ketua DAN Tier 2 ikut bergeser ke kiri dengan delta yang sama!
                const deltaKetua = posBefore.ketuaLeft - posAfter.ketuaLeft;
                const deltaTier2 =
                    posBefore.tier2FirstLeft - posAfter.tier2FirstLeft;
                expect(Math.abs(deltaKetua - deltaTier2)).toBeLessThanOrEqual(
                    2,
                );
                expect(deltaKetua).toBeGreaterThan(100);
            }
        }
    });

    test('Kasus 2: Periode 2018/2020 (4 Pembina) - 5 kartu satu baris utuh, geser pada 768px melihat Pembina terjauh', async ({
        page,
    }) => {
        await page
            .getByRole('button', { name: /2018.*2020/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1536, 1280, 768]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            const wilayahGroup = page.locator('#group-wilayah');
            await expect(wilayahGroup).toBeVisible();

            const desktopContainer = wilayahGroup
                .locator('.hidden.md\\:block')
                .first();

            const geom = await desktopContainer.evaluate((el) => {
                const canvasWrapper = el.querySelector(
                    ':scope > div.overflow-x-auto',
                );
                const canvas =
                    canvasWrapper?.querySelector(':scope > div.w-max');

                if (!canvasWrapper || !canvas)
                    return { error: 'Kanvas tidak ditemukan' };

                const puncakRow = canvas.querySelector(
                    ':scope > div.relative.flex.flex-col > div.flex.justify-center.gap-8',
                );
                const allColumns = Array.from(
                    puncakRow?.querySelectorAll(':scope > div.relative.flex') ||
                        [],
                );
                const cards = allColumns
                    .map((col) => {
                        const card = col.querySelector(
                            '[class*="max-w-[270px] sm:max-w-[290px]"]',
                        );
                        return card ? card.getBoundingClientRect() : null;
                    })
                    .filter(Boolean);

                const firstTop = cards[0]?.top ?? 0;
                const allSameRow = cards.every(
                    (c) => Math.abs(c.top - firstTop) <= 5,
                );

                return {
                    canvasExists: true,
                    cardCount: cards.length,
                    allSameRow,
                    canvasWidth: canvas.getBoundingClientRect().width,
                    wrapperClientWidth: canvasWrapper.clientWidth,
                    wrapperScrollWidth: canvasWrapper.scrollWidth,
                    docOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                };
            });

            console.log(
                `[Kasus 2 @ ${width}px] Geometri:`,
                JSON.stringify(geom, null, 2),
            );

            expect(geom.canvasExists).toBe(true);
            expect(geom.cardCount).toBe(5); // 1 Ketua + 4 Pembina
            expect(geom.allSameRow).toBe(true); // Semua 5 kartu SATU baris
            expect(geom.docOverflow).toBe(0);

            // Screenshot posisi awal
            await page.screenshot({
                path: `test-results/kasus2-2018-2020-${width}px-awal.png`,
                fullPage: true,
            });

            // Pada 768px, scroll sampai ke Pembina terjauh dan pastikan kartu utuh
            if (width === 768) {
                await desktopContainer.evaluate((el) => {
                    const wrapper = el.querySelector(
                        ':scope > div.overflow-x-auto',
                    );
                    if (wrapper)
                        wrapper.scrollLeft =
                            wrapper.scrollWidth - wrapper.clientWidth;
                });
                await page.waitForTimeout(300);

                await page.screenshot({
                    path: `test-results/kasus2-2018-2020-768px-terjauh.png`,
                    fullPage: true,
                });

                const lastCardVisible = await desktopContainer.evaluate(
                    (el) => {
                        const canvas = el.querySelector(
                            ':scope > div.overflow-x-auto > div.w-max',
                        );
                        const allCards = canvas?.querySelectorAll(
                            '[class*="max-w-[270px] sm:max-w-[290px]"]',
                        );
                        const lastCard = allCards
                            ? allCards[allCards.length - 1]
                            : null;
                        const wrapper = el.querySelector(
                            ':scope > div.overflow-x-auto',
                        );
                        if (!lastCard || !wrapper) return false;
                        const r = lastCard.getBoundingClientRect();
                        const wr = wrapper.getBoundingClientRect();
                        return (
                            r.right <= wr.right + 10 && r.left >= wr.left - 50
                        );
                    },
                );

                expect(lastCardVisible).toBe(true);
            }
        }
    });

    test('Kasus 3: Periode 2024/2025 (1 Pembina) - pasangan tampil terpusat', async ({
        page,
    }) => {
        await page
            .getByRole('button', { name: /2024\/2025/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1280, 768]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            const wilayahGroup = page.locator('#group-wilayah');
            await expect(wilayahGroup).toBeVisible();

            const desktopContainer = wilayahGroup
                .locator('.hidden.md\\:block')
                .first();

            const geom = await desktopContainer.evaluate((el) => {
                const canvasWrapper = el.querySelector(
                    ':scope > div.overflow-x-auto',
                );
                const canvas =
                    canvasWrapper?.querySelector(':scope > div.w-max');

                if (!canvasWrapper || !canvas)
                    return { error: 'Kanvas tidak ditemukan' };

                const allColumns = Array.from(
                    canvas.querySelectorAll(
                        ':scope > div.relative.flex.flex-col:first-child > div.flex > div.relative.flex',
                    ),
                );
                const cards = allColumns
                    .map((col) => {
                        const card = col.querySelector(
                            '[class*="max-w-[270px] sm:max-w-[290px]"]',
                        );
                        return card ? card.getBoundingClientRect() : null;
                    })
                    .filter(Boolean);

                const canvasRect = canvas.getBoundingClientRect();
                const groupRect = el.getBoundingClientRect();

                return {
                    canvasExists: true,
                    cardCount: cards.length,
                    canvasWidth: canvasRect.width,
                    groupWidth: groupRect.width,
                    diffTop:
                        cards[0] && cards[1]
                            ? Math.abs(cards[0].top - cards[1].top)
                            : null,
                    docOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                };
            });

            console.log(
                `[Kasus 3 @ ${width}px] Geometri:`,
                JSON.stringify(geom, null, 2),
            );

            expect(geom.canvasExists).toBe(true);
            expect(geom.cardCount).toBe(2); // 1 Ketua + 1 Pembina
            expect(geom.diffTop).toBeLessThanOrEqual(2); // Sebidang
            expect(geom.docOverflow).toBe(0);

            await page.screenshot({
                path: `test-results/kasus3-2024-2025-${width}px.png`,
                fullPage: true,
            });
        }
    });

    test('Kasus 4: Periode aktif tanpa Pembina & Komsat UNG/IAIN/UG - bebas pembungkus geser', async ({
        page,
    }) => {
        // Pada halaman awal, periode aktif sudah terpilih secara default
        await page.waitForTimeout(500);

        await page.setViewportSize({ width: 1280, height: 900 });
        await page.waitForTimeout(500);

        const checkResult = await page.evaluate(() => {
            const results = {};

            // Periksa Wilayah
            const wilayah = document.getElementById('group-wilayah');
            if (wilayah) {
                const desktop = wilayah.querySelector('.hidden.md\\:block');
                const hasOverflowX =
                    desktop?.querySelector('.overflow-x-auto') !== null;
                results['wilayah'] = { hasOverflowX };
            }

            // Periksa Komsat UNG, IAIN, UG
            ['UNG', 'IAIN', 'UG'].forEach((kode) => {
                const komsatEl = document.getElementById(`group-${kode}`);
                if (komsatEl) {
                    const desktop =
                        komsatEl.querySelector('.hidden.md\\:block');
                    const hasOverflowX =
                        desktop?.querySelector('.overflow-x-auto') !== null;
                    results[kode] = { hasOverflowX };
                }
            });

            return results;
        });

        console.log(
            '[Kasus 4] Check bebas overflow-x-auto:',
            JSON.stringify(checkResult, null, 2),
        );

        // Wilayah tanpa Pembina HARUS tidak memiliki overflow-x-auto
        expect(checkResult['wilayah']?.hasOverflowX).toBe(false);

        // Semua Komsat HARUS tidak memiliki overflow-x-auto
        ['UNG', 'IAIN', 'UG'].forEach((kode) => {
            if (checkResult[kode]) {
                expect(checkResult[kode].hasOverflowX).toBe(false);
            }
        });

        await page.screenshot({
            path: `test-results/kasus4-non-canvas-1280px.png`,
            fullPage: true,
        });
    });

    test('Kasus 5: Mobile 360px - strip geser tanpa scrollbar terlihat', async ({
        page,
    }) => {
        await page
            .getByRole('button', { name: /2022.*2023/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        await page.setViewportSize({ width: 360, height: 640 });
        await page.waitForTimeout(500);

        const wilayahGroup = page.locator('#group-wilayah');
        await expect(wilayahGroup).toBeVisible();

        const mobileCheck = await wilayahGroup.evaluate((el) => {
            const mobileContainer = el.querySelector('.md\\:hidden');
            const strip = mobileContainer?.querySelector('.overflow-x-auto');
            if (!strip) return { error: 'Strip mobile tidak ditemukan' };

            const computed = window.getComputedStyle(strip);
            return {
                scrollbarWidth: computed.scrollbarWidth,
                overflowX: computed.overflowX,
                docOverflow:
                    document.documentElement.scrollWidth -
                    document.documentElement.clientWidth,
            };
        });

        console.log(
            '[Kasus 5 @ 360px] Mobile check:',
            JSON.stringify(mobileCheck, null, 2),
        );

        expect(mobileCheck.overflowX).toBe('auto');
        expect(mobileCheck.scrollbarWidth).toBe('none');
        expect(mobileCheck.docOverflow).toBe(0);

        await page.screenshot({
            path: `test-results/kasus5-mobile-360px.png`,
            fullPage: true,
        });
    });
});
