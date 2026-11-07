// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Verifikasi BAGIAN 5: Puncak kepengurusan: Ketua Umum berlabuh di tengah, Pembina menyamping ke kanan
 *
 * Kasus uji:
 * 1. Periode 2024/2025 (1 Pembina)
 * 2. Periode 2018/2020 (4 Pembina)
 * 3. Periode 2022/2023 (3 Pembina, tier2 2 kartu)
 * 4. Periode aktif tanpa Pembina dan kelompok Komsat
 * 5. Mobile 360 px: Ketua pertama di strip Pimpinan Utama, lalu Pembina
 */

test.describe('Puncak Ketua Di Tengah & Pembina Menyamping Kanan', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/kepengurusan');
        await page.waitForLoadState('networkidle');
    });

    test('Kasus 1: Periode 2024/2025 (1 Pembina) pada 1280px & 768px', async ({
        page,
    }) => {
        // Pilih Periode 2024/2025
        await page
            .getByRole('button', { name: /2024\/2025/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1280, 768]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            // Screenshot
            await page.screenshot({
                path: `tests/screenshots/kasus1-2024-2025-${width}px.png`,
                fullPage: true,
            });

            const wilayahGroup = page.locator('#group-wilayah');
            await expect(wilayahGroup).toBeVisible();

            const desktopContainer = wilayahGroup
                .locator('.hidden.md\\:block')
                .first();

            // Evaluasi geometri lengkap di browser
            const geom = await desktopContainer.evaluate((el) => {
                const groupRect = el.getBoundingClientRect();
                const groupCenterX = groupRect.left + groupRect.width / 2;

                // Kartu Ketua Umum: kartu featured pertama di desktop
                const allFeatured = el.querySelectorAll(
                    '[class*="max-w-[270px] sm:max-w-[290px]"]',
                );
                const ketuaCard = allFeatured[0];
                const ketuaRect = ketuaCard.getBoundingClientRect();
                const ketuaCenterX = ketuaRect.left + ketuaRect.width / 2;

                // Kartu Pembina: kartu kedua
                const pembinaCard = allFeatured[1];
                const pembinaRect = pembinaCard
                    ? pembinaCard.getBoundingClientRect()
                    : null;

                // Garis penghubung horizontal (di dalam pembungkus pembina)
                const hLine = pembinaCard
                    ? pembinaCard.parentElement?.querySelector(
                          '.bg-border.h-0\\.5',
                      )
                    : null;
                const hLineRect = hLine ? hLine.getBoundingClientRect() : null;

                // Garis turun dari Ketua
                const vDropLines = el.querySelectorAll(
                    ':scope > div:first-child > div[class*="h-8 w-0.5"]',
                );
                const vDrop = vDropLines[0];
                const vDropRect = vDrop ? vDrop.getBoundingClientRect() : null;
                const vDropCenterX = vDropRect
                    ? vDropRect.left + vDropRect.width / 2
                    : null;

                // Garis di bawah Pembina (harus TIDAK ada)
                const pembinaParent = pembinaCard
                    ? pembinaCard.parentElement
                    : null;
                const linesUnderPembina = pembinaParent
                    ? pembinaParent.querySelectorAll(
                          ':scope > div[class*="h-8"]',
                      )
                    : [];

                // Bar tingkat 2
                const tier2Container = el.querySelectorAll(':scope > div')[1]; // Tier 2 kontainer
                const tier2Cards = tier2Container
                    ? tier2Container.querySelectorAll(
                          '[class*="max-w-[240px]"]',
                      )
                    : [];
                const tier2FirstCard = tier2Cards[0];
                const tier2FirstRect = tier2FirstCard
                    ? tier2FirstCard.getBoundingClientRect()
                    : null;
                const tier2FirstCenterX = tier2FirstRect
                    ? tier2FirstRect.left + tier2FirstRect.width / 2
                    : null;

                const tier2Bar = tier2Container
                    ? tier2Container.querySelector('.top-0.z-0.h-0\\.5')
                    : null;
                const tier2BarRect = tier2Bar
                    ? tier2Bar.getBoundingClientRect()
                    : null;

                return {
                    groupCenterX,
                    ketuaCenterX,
                    diffKetuaGroupCenter: Math.abs(ketuaCenterX - groupCenterX),
                    ketuaTop: ketuaRect.top,
                    ketuaRight: ketuaRect.right,
                    pembinaTop: pembinaRect ? pembinaRect.top : null,
                    pembinaLeft: pembinaRect ? pembinaRect.left : null,
                    pembinaIsRightOfKetua: pembinaRect
                        ? pembinaRect.left > ketuaRect.right
                        : false,
                    diffTopKetuaPembina: pembinaRect
                        ? Math.abs(ketuaRect.top - pembinaRect.top)
                        : null,
                    hLineExists: !!hLine,
                    hLineTop: hLineRect ? hLineRect.top : null,
                    hLineRelativeToPembinaTop:
                        hLineRect && pembinaRect
                            ? hLineRect.top - pembinaRect.top
                            : null,
                    vDropCenterX,
                    diffVDropKetuaCenter: vDropCenterX
                        ? Math.abs(vDropCenterX - ketuaCenterX)
                        : null,
                    linesUnderPembinaCount: linesUnderPembina.length,
                    tier2BarLeft: tier2BarRect ? tier2BarRect.left : null,
                    tier2FirstCenterX,
                    diffTier2BarLeftFirstCenter:
                        tier2BarRect && tier2FirstCenterX
                            ? Math.abs(tier2BarRect.left - tier2FirstCenterX)
                            : null,
                    docOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                };
            });

            console.log(
                `[Kasus 1 @ ${width}px] Geometri:`,
                JSON.stringify(geom, null, 2),
            );

            // (a) titik tengah kartu Ketua Umum == titik tengah area konten grup (selisih <= 2 px)
            expect(geom.diffKetuaGroupCenter).toBeLessThanOrEqual(2);

            // (b) Pembina di kanan Ketua, sejajar, dengan garis horizontal penghubung di tengah-tinggi kartu
            expect(geom.pembinaIsRightOfKetua).toBe(true);
            expect(geom.diffTopKetuaPembina).toBeLessThanOrEqual(2); // sejajar
            expect(geom.hLineExists).toBe(true);
            // hLine di tengah-tinggi kartu (~193px)
            expect(geom.hLineRelativeToPembinaTop).toBeGreaterThanOrEqual(185);
            expect(geom.hLineRelativeToPembinaTop).toBeLessThanOrEqual(200);

            // (c) garis turun dari Ketua Umum lurus ke tengah bar tingkat 2 (selisih titik tengah garis vs ketua <= 2px)
            expect(geom.diffVDropKetuaCenter).toBeLessThanOrEqual(2);

            // (d) TIDAK ada garis di bawah kartu Pembina
            expect(geom.linesUnderPembinaCount).toBe(0);

            // (e) ujung kiri bar tingkat 2 == titik tengah kartu pertama tingkat 2 (selisih <= 2px, tidak menjorok)
            expect(geom.diffTier2BarLeftFirstCenter).toBeLessThanOrEqual(2);

            // Dokumen tidak overflow
            expect(geom.docOverflow).toBe(0);
        }
    });

    test('Kasus 2: Periode 2018/2020 (4 Pembina) pada 1280, 768, 360 px', async ({
        page,
    }) => {
        // Pilih Periode 2018/2020
        await page
            .getByRole('button', { name: /2018\/2020/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1280, 768, 360]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            await page.screenshot({
                path: `tests/screenshots/kasus2-2018-2020-${width}px.png`,
                fullPage: true,
            });

            const docOverflow = await page.evaluate(() => {
                return (
                    document.documentElement.scrollWidth -
                    document.documentElement.clientWidth
                );
            });
            expect(docOverflow).toBe(0);

            if (width >= 768) {
                const wilayahGroup = page.locator('#group-wilayah');
                const desktopContainer = wilayahGroup
                    .locator('.hidden.md\\:block')
                    .first();

                const geom = await desktopContainer.evaluate((el) => {
                    const groupRect = el.getBoundingClientRect();
                    const groupCenterX = groupRect.left + groupRect.width / 2;

                    const allFeatured = el.querySelectorAll(
                        '[class*="max-w-[270px] sm:max-w-[290px]"]',
                    );
                    const ketuaCard = allFeatured[0];
                    const ketuaRect = ketuaCard.getBoundingClientRect();
                    const ketuaCenterX = ketuaRect.left + ketuaRect.width / 2;

                    // Strip pembina
                    const strip = el.querySelector(
                        '[class*="overflow-x-auto"]',
                    );
                    const pembinaCards = strip
                        ? strip.querySelectorAll(
                              '[class*="max-w-[270px] sm:max-w-[290px]"]',
                          )
                        : [];

                    return {
                        totalCards: allFeatured.length,
                        pembinaCardsCount: pembinaCards.length,
                        diffKetuaGroupCenter: Math.abs(
                            ketuaCenterX - groupCenterX,
                        ),
                        stripScrollable: strip
                            ? strip.scrollWidth >= strip.clientWidth
                            : false,
                        stripWidth: strip ? strip.clientWidth : 0,
                        stripScrollWidth: strip ? strip.scrollWidth : 0,
                    };
                });

                console.log(
                    `[Kasus 2 @ ${width}px] Geometri:`,
                    JSON.stringify(geom, null, 2),
                );

                // Kelima kartu ada (1 ketua + 4 pembina = 5)
                expect(geom.totalCards).toBe(5);
                expect(geom.pembinaCardsCount).toBe(4);
                expect(geom.diffKetuaGroupCenter).toBeLessThanOrEqual(2);
            }
        }
    });

    test('Kasus 3: Periode 2022/2023 (3 Pembina, tier2 2 kartu)', async ({
        page,
    }) => {
        // Pilih Periode 2022/2023
        await page
            .getByRole('button', { name: /2022\/2023/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        for (const width of [1280, 768]) {
            await page.setViewportSize({ width, height: 900 });
            await page.waitForTimeout(500);

            await page.screenshot({
                path: `tests/screenshots/kasus3-2022-2023-${width}px.png`,
                fullPage: true,
            });

            const wilayahGroup = page.locator('#group-wilayah');
            const desktopContainer = wilayahGroup
                .locator('.hidden.md\\:block')
                .first();

            const geom = await desktopContainer.evaluate((el) => {
                const groupRect = el.getBoundingClientRect();
                const groupCenterX = groupRect.left + groupRect.width / 2;

                const allFeatured = el.querySelectorAll(
                    '[class*="max-w-[270px] sm:max-w-[290px]"]',
                );
                const ketuaCard = allFeatured[0];
                const ketuaRect = ketuaCard.getBoundingClientRect();
                const ketuaCenterX = ketuaRect.left + ketuaRect.width / 2;

                // Tier 2 kartu
                const tier2Container = el.querySelectorAll(':scope > div')[1];
                const tier2Cards = tier2Container
                    ? tier2Container.querySelectorAll(
                          '[class*="max-w-[240px]"]',
                      )
                    : [];

                return {
                    totalFeatured: allFeatured.length,
                    tier2Count: tier2Cards.length,
                    diffKetuaGroupCenter: Math.abs(ketuaCenterX - groupCenterX),
                    docOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                };
            });

            console.log(
                `[Kasus 3 @ ${width}px] Geometri:`,
                JSON.stringify(geom, null, 2),
            );

            // 1 Ketua + 3 Pembina = 4 kartu featured
            expect(geom.totalFeatured).toBe(4);
            expect(geom.diffKetuaGroupCenter).toBeLessThanOrEqual(2);
            expect(geom.docOverflow).toBe(0);
        }
    });

    test('Kasus 4: Periode aktif tanpa Pembina & kelompok Komsat', async ({
        page,
    }) => {
        // Periode default aktif (2025–2026, tanpa Pembina)
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.waitForTimeout(500);

        await page.screenshot({
            path: 'tests/screenshots/kasus4-tanpa-pembina-1280px.png',
            fullPage: true,
        });

        const wilayahGroup = page.locator('#group-wilayah');
        const desktopContainer = wilayahGroup
            .locator('.hidden.md\\:block')
            .first();

        const geom = await desktopContainer.evaluate((el) => {
            const allFeatured = el.querySelectorAll(
                '[class*="max-w-[270px] sm:max-w-[290px]"]',
            );
            const strip = el.querySelector('[class*="overflow-x-auto"]');
            return {
                featuredCount: allFeatured.length,
                hasStrip: !!strip,
            };
        });

        // Tanpa pembina: hanya 1 kartu puncak (Ketua), tanpa strip
        expect(geom.featuredCount).toBe(1);
        expect(geom.hasStrip).toBe(false);

        // Periksa salah satu kelompok komsat (misal UNG)
        const ungGroup = page.locator('#group-komsat-ung');
        if (await ungGroup.isVisible()) {
            const ungDesktop = ungGroup.locator('.hidden.md\\:block').first();
            const ungFeatured = await ungDesktop
                .locator('[class*="max-w-[270px] sm:max-w-[290px]"]')
                .count();
            expect(ungFeatured).toBe(1);
        }
    });

    test('Kasus 5: Mobile 360 px: Ketua pertama di strip Pimpinan Utama, lalu Pembina', async ({
        page,
    }) => {
        // Pilih Periode 2018/2020 (4 Pembina, 1 Ketua)
        await page
            .getByRole('button', { name: /2018\/2020/i })
            .first()
            .click();
        await page.waitForLoadState('networkidle');

        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);

        await page.screenshot({
            path: 'tests/screenshots/kasus5-mobile-360px.png',
            fullPage: true,
        });

        const wilayahGroup = page.locator('#group-wilayah');
        const mobileRail = wilayahGroup.locator('.md\\:hidden');
        const mobileStrip = mobileRail
            .locator('[class*="overflow-x-auto"]')
            .first();
        await expect(mobileStrip).toBeVisible();

        const cards = mobileStrip.locator(':scope > div.flex > div');
        const cardCount = await cards.count();
        expect(cardCount).toBe(5);

        // Verifikasi kartu pertama adalah Ketua Umum
        const firstCardText = await cards.first().textContent();
        expect(firstCardText).toMatch(/Ketua/i);

        // Verifikasi kartu kedua adalah Pembina
        const secondCardText = await cards.nth(1).textContent();
        expect(secondCardText).toMatch(/Pembina/i);

        // Verifikasi dokumen tidak overflow
        const docOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(docOverflow).toBe(0);
    });
});
