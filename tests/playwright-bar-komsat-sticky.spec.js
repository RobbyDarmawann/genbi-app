// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Verifikasi BAGIAN 4: Bar komsat sticky mobile bertukar tempat dengan header
 *
 * Kasus uji:
 * 1. Mobile 360px - posisi scroll atas: header tampil, bar komsat top = 142px ± 2px
 * 2. Mobile 360px - scroll ke bawah: header sembunyi, bar komsat top = 0px ± 2px, bar bisa diklik
 * 3. Mobile 360px - scroll jauh ke bawah (grup terakhir): bar MASIH sticky
 * 4. Mobile 360px - scroll kembali ke atas: bar kembali ke 142px
 * 5. Mobile 390px - sama seperti 360px
 * 6. Desktop 1280px - bar tidak sticky (static)
 */

test.describe('Bar Komsat Sticky Mobile', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/kepengurusan');
        await page.waitForLoadState('networkidle');

        // Pilih periode aktif yang memiliki data wilayah + komsat
        // (misal 2024/2025 atau periode terbaru)
        const periodeButtons = page
            .locator('[class*="periode"]')
            .getByRole('button');
        const firstPeriode = periodeButtons.first();
        if (await firstPeriode.isVisible()) {
            await firstPeriode.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(500);
        }
    });

    test('Kasus 1-4: Mobile 360px - bar sticky bertukar posisi dengan header', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.waitForTimeout(500);

        const barKomsat = page.locator('#bar-komsat');
        await expect(barKomsat).toBeVisible();

        // 1. Scroll ke zona sticky dan picu header tampil (scroll ke atas sedikit agar delta < 0)
        await page.evaluate(() => {
            const bar = document.querySelector('#bar-komsat');
            if (bar) {
                const barRect = bar.getBoundingClientRect();
                const scrollY = window.scrollY;
                const barTopFromDoc = scrollY + barRect.top;
                // Scroll melebihi bar sedikit, lalu naik sedikit agar delta < 0
                const targetScroll = barTopFromDoc - 142;
                window.scrollTo(0, targetScroll + 30);
                window.scrollTo(0, targetScroll);
            }
        });
        await page.waitForTimeout(600);

        const topAtStart = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-360-scroll-sticky-header-visible.png',
            fullPage: false,
        });

        expect(topAtStart).toBeGreaterThanOrEqual(140);
        expect(topAtStart).toBeLessThanOrEqual(144);
        console.log(
            `[360px] Zona sticky (header tampil): bar top = ${topAtStart}px (expected 142px ± 2px)`,
        );

        // 2. Scroll ke bawah melewati ambang autohide: header sembunyi, bar top = 0px
        const currentScroll = await page.evaluate(() => window.scrollY);
        await page.evaluate(
            (scroll) => window.scrollTo(0, scroll + 150),
            currentScroll,
        );
        await page.waitForTimeout(400); // beri waktu transisi selesai

        const topAfterScroll = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-360-scroll-down.png',
            fullPage: false,
        });

        expect(topAfterScroll).toBeGreaterThanOrEqual(-2);
        expect(topAfterScroll).toBeLessThanOrEqual(2);
        console.log(
            `[360px] Scroll bawah: bar top = ${topAfterScroll}px (expected 0px ± 2px)`,
        );

        // Verifikasi bar bisa diklik (ganti lingkup)
        const wilayahButton = barKomsat.getByRole('button', {
            name: 'Wilayah',
        });
        await expect(wilayahButton).toBeVisible();
        await wilayahButton.click();
        await page.waitForTimeout(300);

        // Kembalikan ke Semua
        const semuaButton = barKomsat.getByRole('button', { name: 'Semua' });
        await semuaButton.click();
        await page.waitForTimeout(300);

        // 3. Scroll jauh ke bawah (grup terakhir): bar MASIH sticky
        await page.evaluate(() => {
            const lastGroup = Array.from(
                document.querySelectorAll('[id^="group-"]'),
            ).pop();
            if (lastGroup) {
                lastGroup.scrollIntoView({ block: 'end' });
            }
        });
        await page.waitForTimeout(500);

        const topAtBottom = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-360-scroll-bottom.png',
            fullPage: false,
        });

        expect(topAtBottom).toBeGreaterThanOrEqual(-2);
        expect(topAtBottom).toBeLessThanOrEqual(2);
        await expect(barKomsat).toBeVisible();
        console.log(
            `[360px] Scroll jauh bawah: bar top = ${topAtBottom}px, masih sticky`,
        );

        // 4. Scroll kembali ke atas (zona sticky, header muncul): bar kembali ke 142px
        await page.evaluate(() => {
            const bar = document.querySelector('#bar-komsat');
            if (bar) {
                const barRect = bar.getBoundingClientRect();
                const scrollY = window.scrollY;
                const barTopFromDoc = scrollY + barRect.top;
                const targetScroll = Math.max(0, barTopFromDoc - 142);
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        });
        await page.waitForTimeout(600);

        const topBackToTop = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-360-scroll-back-sticky.png',
            fullPage: false,
        });

        expect(topBackToTop).toBeGreaterThanOrEqual(140);
        expect(topBackToTop).toBeLessThanOrEqual(144);
        console.log(
            `[360px] Scroll kembali atas: bar top = ${topBackToTop}px (expected 142px ± 2px)`,
        );

        // Verifikasi tidak ada overflow horizontal dokumen
        const overflowX = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(overflowX).toBe(0);
        console.log(`[360px] Dokumen overflow horizontal = ${overflowX}px`);
    });

    test('Kasus 5: Mobile 390px - bar sticky bertukar posisi dengan header', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(500);

        const barKomsat = page.locator('#bar-komsat');
        await expect(barKomsat).toBeVisible();

        // Scroll ke zona sticky saat header tampil: top = 142px
        await page.evaluate(() => {
            const bar = document.querySelector('#bar-komsat');
            if (bar) {
                const barRect = bar.getBoundingClientRect();
                const scrollY = window.scrollY;
                const barTopFromDoc = scrollY + barRect.top;
                const targetScroll = barTopFromDoc - 142;
                window.scrollTo(0, targetScroll + 30);
                window.scrollTo(0, targetScroll);
            }
        });
        await page.waitForTimeout(600);

        const topAtStart = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-390-scroll-sticky.png',
            fullPage: false,
        });

        expect(topAtStart).toBeGreaterThanOrEqual(140);
        expect(topAtStart).toBeLessThanOrEqual(144);
        console.log(`[390px] Zona sticky: bar top = ${topAtStart}px`);

        // Scroll bawah: top = 0px (header sembunyi)
        const currentScroll = await page.evaluate(() => window.scrollY);
        await page.evaluate(
            (scroll) => window.scrollTo(0, scroll + 150),
            currentScroll,
        );
        await page.waitForTimeout(400);

        const topAfterScroll = await barKomsat.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-mobile-390-scroll-down.png',
            fullPage: false,
        });

        expect(topAfterScroll).toBeGreaterThanOrEqual(-2);
        expect(topAfterScroll).toBeLessThanOrEqual(2);
        console.log(`[390px] Scroll bawah: bar top = ${topAfterScroll}px`);

        // Verifikasi bar bisa diklik
        const wilayahButton = barKomsat.getByRole('button', {
            name: 'Wilayah',
        });
        await expect(wilayahButton).toBeVisible();
        await wilayahButton.click();
        await page.waitForTimeout(300);

        const overflowX = await page.evaluate(() => {
            return (
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
            );
        });
        expect(overflowX).toBe(0);
        console.log(`[390px] Dokumen overflow horizontal = ${overflowX}px`);
    });

    test('Kasus 6: Desktop 1280px - bar tidak sticky (static)', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForTimeout(500);

        const barKomsat = page.locator('#bar-komsat');
        await expect(barKomsat).toBeVisible();

        // Periksa computed style: position harus static di desktop
        const position = await barKomsat.evaluate((el) => {
            return window.getComputedStyle(el).position;
        });

        await page.screenshot({
            path: 'tests/screenshots/bar-komsat-desktop-1280.png',
            fullPage: true,
        });

        expect(position).toBe('static');
        console.log(
            `[1280px] Bar komsat position = ${position} (expected: static)`,
        );

        // Scroll ke bawah, bar tidak sticky di desktop
        await page.evaluate(() => window.scrollTo(0, 400));
        await page.waitForTimeout(300);

        const positionAfterScroll = await barKomsat.evaluate((el) => {
            return window.getComputedStyle(el).position;
        });

        expect(positionAfterScroll).toBe('static');
        console.log(
            `[1280px] Setelah scroll: position = ${positionAfterScroll}`,
        );
    });
});
