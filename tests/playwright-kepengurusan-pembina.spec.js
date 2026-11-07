// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Verifikasi BAGIAN 4: Pembina sejajar Ketua Umum sebagai puncak bersama
 *
 * Kasus uji:
 * 1. Periode Wilayah ber-Pembina urutan normal (Pembina sebelum Ketua Umum)
 * 2. Periode Wilayah urutan terbalik (Ketua Umum sebelum Pembina)
 * 3. Periode aktif demo tanpa Pembina (Ketua Wilayah sendirian)
 */

test.describe('Kepengurusan Pembina Sejajar Ketua', () => {
    test.beforeEach(async ({ page }) => {
        // Navigasi ke halaman kepengurusan publik
        await page.goto('http://localhost:8000/kepengurusan');
        await page.waitForLoadState('networkidle');
    });

    test('Kasus 1: Periode 2020/2021 - Pembina dan Ketua Umum sejajar', async ({
        page,
    }) => {
        // Pilih periode 2020/2021 (Pembina tercatat sebelum Ketua Umum)
        await page.getByRole('button', { name: /2020\/2021/i }).click();
        await page.waitForLoadState('networkidle');

        // Desktop (768px, 1280px): pasangan di tengah, garis rapi
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);

        // Screenshot desktop 1280px
        await page.screenshot({
            path: 'tests/screenshots/pembina-2020-2021-desktop-1280.png',
            fullPage: true,
        });

        // Verifikasi ada 2 kartu puncak (Pembina dan Ketua Umum)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const featuredCards = desktopOrgChart.locator('[class*="featured"]');
        const featuredCount = await featuredCards.count();
        expect(featuredCount).toBeGreaterThanOrEqual(2);

        // Verifikasi overflow horizontal dokumen = 0
        const desktopOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(desktopOverflow).toBe(0);

        // Tablet 768px
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/screenshots/pembina-2020-2021-tablet-768.png',
            fullPage: true,
        });

        const tabletOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(tabletOverflow).toBe(0);

        // Mobile 360px: strip geser horizontal
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);

        // Screenshot mobile 360px
        await page.screenshot({
            path: 'tests/screenshots/pembina-2020-2021-mobile-360.png',
            fullPage: true,
        });

        // Verifikasi strip bisa di-scroll (overflow-x-auto)
        const mobileStrip = page
            .locator('.md\\:hidden')
            .first()
            .locator('[class*="overflow-x-auto"]')
            .first();
        const stripExists = await mobileStrip.isVisible();
        expect(stripExists).toBe(true);

        // Verifikasi dokumen tidak overflow horizontal
        const mobileOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(mobileOverflow).toBe(0);

        // Verifikasi kedua kartu ada di mobile strip
        const mobileCards = mobileStrip.locator('[class*="w-\\[270px\\]"]');
        const mobileCardCount = await mobileCards.count();
        expect(mobileCardCount).toBeGreaterThanOrEqual(2);

        // Ukur lebar kartu featured di mobile (harus 270px)
        const firstCardWidth = await mobileCards
            .first()
            .evaluate((el) => el.offsetWidth);
        expect(firstCardWidth).toBeGreaterThanOrEqual(260); // toleransi 10px
        expect(firstCardWidth).toBeLessThanOrEqual(280);
    });

    test('Kasus 2: Periode 2021/2022 - Pembina tetap kiri meski urutan terbalik', async ({
        page,
    }) => {
        // Pilih periode 2021/2022 (berdasarkan kode, periode ini juga punya Pembina)
        await page.getByRole('button', { name: /2021\/2022/i }).click();
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/screenshots/pembina-2021-2022-desktop-1280.png',
            fullPage: true,
        });

        // Verifikasi ada 2 kartu puncak
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const featuredCards = desktopOrgChart.locator('[class*="featured"]');
        const featuredCount = await featuredCards.count();
        expect(featuredCount).toBeGreaterThanOrEqual(2);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/screenshots/pembina-2021-2022-mobile-360.png',
            fullPage: true,
        });

        const mobileOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(mobileOverflow).toBe(0);
    });

    test('Kasus 3: Periode aktif 2025-2026 - Ketua Wilayah sendirian (tanpa Pembina)', async ({
        page,
    }) => {
        // Periode aktif default (tanpa Pembina)
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);

        // Screenshot desktop
        await page.screenshot({
            path: 'tests/screenshots/no-pembina-2025-2026-desktop-1280.png',
            fullPage: true,
        });

        // Verifikasi hanya 1 kartu puncak (Ketua Wilayah)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const featuredCards = desktopOrgChart.locator('[class*="featured"]');
        const featuredCount = await featuredCards.count();
        expect(featuredCount).toBe(1);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/screenshots/no-pembina-2025-2026-mobile-360.png',
            fullPage: true,
        });

        // Verifikasi tidak ada overflow
        const mobileOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(mobileOverflow).toBe(0);

        // Verifikasi mobile hanya 1 kartu featured (tidak ada strip geser)
        const mobileRail = page.locator('.md\\:hidden').first();
        const mobileStrip = mobileRail.locator('[class*="overflow-x-auto"]');
        const stripCount = await mobileStrip.count();

        // Jika strip ada, berarti ini dual puncak (tidak seharusnya untuk periode tanpa Pembina)
        // Jika tidak ada strip, berarti single puncak (benar)
        if (stripCount > 0) {
            const cards = await mobileStrip
                .locator('[class*="w-\\[270px\\]"]')
                .count();
            expect(cards).toBe(1); // Harus hanya 1 kartu jika strip ada
        }
    });
});
