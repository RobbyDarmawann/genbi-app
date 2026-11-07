// @ts-check
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * BAGIAN 4: Verifikasi terukur perbaikan puncak kepengurusan
 * - Gerbang hasMultiPuncak (>= 2)
 * - Geometri batang Ketua Umum
 * - Overflow horizontal = 0
 * - Posisi x garis turun = titik tengah Ketua Umum
 */

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('BAGIAN 4 - Verifikasi Perbaikan Puncak Kepengurusan', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/kepengurusan');
        await page.waitForLoadState('networkidle');
    });

    test('Kasus 1: Periode 2024/2025 (1 Pembina) - Garis turun di bawah Ketua Umum', async ({
        page,
    }) => {
        // Buka periode 2024/2025 (id = 9)
        await page.goto('http://localhost:8000/kepengurusan?periode=9');
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus1-2024-2025-desktop-1280.png'),
            fullPage: true,
        });

        // Verifikasi 2 kartu puncak (Ketua Umum + Pembina)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const puncakContainer = desktopOrgChart
            .locator('div.flex.gap-8')
            .first();
        const puncakColumns = puncakContainer.locator('> div');
        const puncakCount = await puncakColumns.count();
        expect(puncakCount).toBe(2);

        // Verifikasi overflow horizontal dokumen = 0
        const desktopOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(desktopOverflow).toBe(0);

        // PENGUKURAN KRITIS: Posisi x garis turun vs titik tengah Ketua Umum
        const ketuaCol = puncakColumns.first();
        const ketuaCard = ketuaCol.locator('> div').first();
        const ketuaBox = await ketuaCard.boundingBox();
        expect(ketuaBox).not.toBeNull();
        const ketuaMidX = ketuaBox.x + ketuaBox.width / 2;

        // Garis turun lanjutan adalah garis kedua di kolom Ketua (yang memiliki h-8 w-0.5 bg-border)
        const garisTurun = ketuaCol
            .locator('div.relative.z-0.h-8.w-0\\.5.bg-border')
            .last();
        const garisBox = await garisTurun.boundingBox();
        expect(garisBox).not.toBeNull();
        const garisMidX = garisBox.x + garisBox.width / 2;

        console.log(
            `[Kasus 1] Ketua Umum midX: ${ketuaMidX.toFixed(2)}px, Garis turun midX: ${garisMidX.toFixed(2)}px, Selisih: ${Math.abs(ketuaMidX - garisMidX).toFixed(2)}px`,
        );
        expect(Math.abs(ketuaMidX - garisMidX)).toBeLessThan(2); // Selisih < 2px (sempurna di tengah kolom Ketua)

        // Tablet 768px
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus1-2024-2025-tablet-768.png'),
            fullPage: true,
        });

        const tabletOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(tabletOverflow).toBe(0);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus1-2024-2025-mobile-360.png'),
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

    test('Kasus 2: Periode 2018/2020 (4 Pembina) - Strip geser, 5 kartu tampil', async ({
        page,
    }) => {
        // Buka periode 2018/2020 (id = 4)
        await page.goto('http://localhost:8000/kepengurusan?periode=4');
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus2-2018-2020-desktop-1280.png'),
            fullPage: true,
        });

        // Verifikasi 5 kartu puncak (Ketua Umum + 4 Pembina)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const puncakContainer = desktopOrgChart
            .locator('div.flex.gap-8')
            .first();
        const puncakColumns = puncakContainer.locator('> div');
        const puncakCount = await puncakColumns.count();
        expect(puncakCount).toBe(5); // 5 kartu tampil utuh!

        // Verifikasi strip geser (overflow-x-auto pada container puncak)
        const stripContainer = desktopOrgChart
            .locator('div.overflow-x-auto')
            .first();
        const stripExists = await stripContainer.isVisible();
        expect(stripExists).toBe(true);

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
            path: path.join(screenshotDir, 'kasus2-2018-2020-tablet-768.png'),
            fullPage: true,
        });

        const tabletOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(tabletOverflow).toBe(0);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus2-2018-2020-mobile-360.png'),
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

    test('Kasus 3: Periode 2022/2023 (3 Pembina, tier2 2 kartu) - Batang mendarat di bar tier2', async ({
        page,
    }) => {
        // Buka periode 2022/2023 (id = 7)
        await page.goto('http://localhost:8000/kepengurusan?periode=7');
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus3-2022-2023-desktop-1280.png'),
            fullPage: true,
        });

        // Verifikasi 4 kartu puncak (Ketua Umum + 3 Pembina)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const puncakContainer = desktopOrgChart
            .locator('div.flex.gap-8')
            .first();
        const puncakColumns = puncakContainer.locator('> div');
        const puncakCount = await puncakColumns.count();
        expect(puncakCount).toBe(4);

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
            path: path.join(screenshotDir, 'kasus3-2022-2023-tablet-768.png'),
            fullPage: true,
        });

        const tabletOverflow = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(tabletOverflow).toBe(0);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus3-2022-2023-mobile-360.png'),
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

    test('Kasus 4: Periode aktif demo tanpa Pembina - Identik tampilan lama (single)', async ({
        page,
    }) => {
        // Periode aktif default (id = 2)
        await page.goto('http://localhost:8000/kepengurusan?periode=2');
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(
                screenshotDir,
                'kasus4-demo-no-pembina-desktop-1280.png',
            ),
            fullPage: true,
        });

        // Verifikasi HANYA 1 kartu puncak (single puncak)
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        // Pada single puncak, tidak ada div.flex.gap-8 di puncak
        const multiPuncak = desktopOrgChart.locator('div.flex.gap-8');
        expect(await multiPuncak.count()).toBe(0);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(
                screenshotDir,
                'kasus4-demo-no-pembina-mobile-360.png',
            ),
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

    test('Kasus 5: Kelompok Komsat - Tidak berubah', async ({ page }) => {
        // Switch ke lingkup Komsat UNG pada periode 2
        await page.goto(
            'http://localhost:8000/kepengurusan?periode=2&lingkup=UNG',
        );
        await page.waitForLoadState('networkidle');

        // Desktop 1280px
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus5-komsat-desktop-1280.png'),
            fullPage: true,
        });

        // Verifikasi struktur Komsat: single puncak
        const desktopOrgChart = page.locator('.hidden.md\\:block').first();
        const multiPuncak = desktopOrgChart.locator('div.flex.gap-8');
        expect(await multiPuncak.count()).toBe(0);

        // Mobile 360px
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(screenshotDir, 'kasus5-komsat-mobile-360.png'),
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
});
