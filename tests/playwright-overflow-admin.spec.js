// @ts-check
import { expect, test } from '@playwright/test';

/**
 * Verifikasi Regresi Overflow Admin Gabungan:
 * 1. /admin/dashboard — Nol overflow horizontal pada mobile (390px) dan desktop (1280px, 1440px, 1920px),
 *    tidak ada tumpang tindih antar 3 kolom Ringkasan Sistem baik pada data normal maupun suntikan teks panjang.
 * 2. /admin/kegiatan/create — Nol overflow horizontal pada mobile (390px) dan desktop (1280px, 1440px),
 *    input jam_semua_buka & jam_semua_tutup sejajar vertikal (diff = 0px), dan klik pada peta Leaflet
 *    mengubah nilai input Latitude & Longitude.
 */

test.describe('Admin Overflow & Interaksi Peta Kegiatan', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('http://127.0.0.1:8000/login', {
            waitUntil: 'networkidle',
        });
        await page.fill('input[name="username"]', 'internal');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
    });

    test('Dashboard Admin: nol overflow horizontal dan nol tabrakan kolom pada mobile & desktop', async ({
        page,
    }) => {
        for (const vp of [
            { width: 390, height: 844 },
            { width: 1280, height: 800 },
            { width: 1440, height: 900 },
            { width: 1920, height: 1080 },
        ]) {
            await page.setViewportSize(vp);
            await page.goto('http://127.0.0.1:8000/admin/dashboard', {
                waitUntil: 'networkidle',
            });

            const metrics = await page.evaluate(() => {
                const longText =
                    'Judul_kegiatan_sangat_panjang_tanpa_spasi_' +
                    'X'.repeat(90);
                const heading = [
                    ...document.querySelectorAll('h1,h2,h3,div'),
                ].find(
                    (e) =>
                        e.children.length === 0 &&
                        e.textContent?.trim() === 'Ringkasan Sistem',
                );
                const card =
                    heading?.closest('[data-slot="card"]') ||
                    heading?.parentElement?.parentElement;
                if (!card) {
                    throw new Error('Kartu Ringkasan Sistem tidak ditemukan');
                }

                // Uji suntikan teks panjang pada elemen teks judul (.truncate) untuk memastikan elipsis bekerja
                card.querySelectorAll('section li a span.truncate').forEach(
                    (sp) => {
                        sp.textContent = longText;
                    },
                );

                const cardRect = card.getBoundingClientRect();
                const sections = [...card.querySelectorAll('section')];
                const sectionMetrics = sections.map((sec, idx) => {
                    const rect = sec.getBoundingClientRect();
                    const nextRect =
                        sections[idx + 1]?.getBoundingClientRect() ?? null;
                    const itemRights = [...sec.querySelectorAll('li a')].map(
                        (a) => a.getBoundingClientRect().right,
                    );
                    const maxRight = Math.max(rect.right, ...itemRights);
                    return {
                        width: rect.width,
                        left: rect.left,
                        right: rect.right,
                        maxRight,
                        overCardRight: Math.max(0, maxRight - cardRect.right),
                        overlapNextDesktop:
                            nextRect && nextRect.left >= rect.right - 1
                                ? Math.max(0, maxRight - nextRect.left)
                                : 0,
                    };
                });

                return {
                    docScrollWidth: document.documentElement.scrollWidth,
                    docClientWidth: document.documentElement.clientWidth,
                    cardScrollWidth: card.scrollWidth,
                    cardClientWidth: card.clientWidth,
                    sectionMetrics,
                };
            });

            expect(
                metrics.docScrollWidth,
                `Overflow dokumen pada ${vp.width}px`,
            ).toBeLessThanOrEqual(metrics.docClientWidth);
            expect(
                metrics.cardScrollWidth,
                `Overflow kartu Ringkasan Sistem pada ${vp.width}px`,
            ).toBeLessThanOrEqual(metrics.cardClientWidth);

            for (const sec of metrics.sectionMetrics) {
                expect(sec.overCardRight).toBeLessThanOrEqual(0.5);
                if (vp.width >= 1024) {
                    expect(sec.overlapNextDesktop).toBeLessThanOrEqual(0.5);
                }
            }
        }
    });

    test('Form Kegiatan Create: nol overflow horizontal pada mobile & desktop serta klik peta mengubah Latitude/Longitude', async ({
        page,
    }) => {
        for (const vp of [
            { width: 390, height: 844 },
            { width: 768, height: 1024 },
            { width: 1280, height: 800 },
            { width: 1440, height: 900 },
        ]) {
            await page.setViewportSize(vp);
            await page.goto('http://127.0.0.1:8000/admin/kegiatan/create', {
                waitUntil: 'networkidle',
            });

            const layout = await page.evaluate(() => {
                const section = [...document.querySelectorAll('section')].find(
                    (s) =>
                        s.textContent?.includes('Lokasi dan absensi') &&
                        s.querySelector('.leaflet-container'),
                );
                if (!section) {
                    throw new Error(
                        'Section Lokasi dan absensi tidak ditemukan',
                    );
                }
                const secRect = section.getBoundingClientRect();
                const mapRect = section
                    .querySelector('.leaflet-container')
                    ?.getBoundingClientRect();
                const bukaRect = document
                    .getElementById('jam_semua_buka')
                    ?.getBoundingClientRect();
                const tutupRect = document
                    .getElementById('jam_semua_tutup')
                    ?.getBoundingClientRect();

                const offending = [...section.querySelectorAll('*')].filter(
                    (el) =>
                        !el.closest('.leaflet-container') &&
                        el.getBoundingClientRect().right > secRect.right + 1,
                );

                return {
                    docScrollWidth: document.documentElement.scrollWidth,
                    docClientWidth: document.documentElement.clientWidth,
                    secScrollWidth: section.scrollWidth,
                    secClientWidth: section.clientWidth,
                    secRight: secRect.right,
                    mapRight: mapRect?.right ?? 0,
                    jamTopDiff:
                        bukaRect && tutupRect
                            ? Math.abs(bukaRect.top - tutupRect.top)
                            : 999,
                    tutupRight: tutupRect?.right ?? 0,
                    offendingCount: offending.length,
                };
            });

            expect(
                layout.docScrollWidth,
                `Overflow dokumen create pada ${vp.width}px`,
            ).toBeLessThanOrEqual(layout.docClientWidth);
            expect(
                layout.secScrollWidth,
                `Overflow section lokasi pada ${vp.width}px`,
            ).toBeLessThanOrEqual(layout.secClientWidth);
            expect(layout.mapRight).toBeLessThanOrEqual(layout.secRight);
            expect(layout.tutupRight).toBeLessThanOrEqual(layout.secRight);
            expect(layout.jamTopDiff).toBeLessThanOrEqual(1);
            expect(layout.offendingCount).toBe(0);
        }

        // Verifikasi interaktif: klik pada peta Leaflet mengubah nilai input Latitude dan Longitude
        const latInput = page.locator('input[name="latitude"]');
        const lngInput = page.locator('input[name="longitude"]');
        const mapContainer = page.locator('.leaflet-container');

        await mapContainer.scrollIntoViewIfNeeded();
        const initialLat = await latInput.inputValue();
        const initialLng = await lngInput.inputValue();

        const box = await mapContainer.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
            // Klik pada koordinat offset di dalam kanvas peta (bukan tepat di tengah dan bukan di kontrol layer kanan atas)
            await page.mouse.click(
                box.x + box.width * 0.25,
                box.y + box.height * 0.65,
            );
        }

        await expect
            .poll(async () => await latInput.inputValue(), { timeout: 5000 })
            .not.toBe(initialLat);
        await expect
            .poll(async () => await lngInput.inputValue(), { timeout: 5000 })
            .not.toBe(initialLng);
    });
});
