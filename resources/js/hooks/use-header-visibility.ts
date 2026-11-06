import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook untuk mendeteksi apakah header publik harus terlihat atau tersembunyi
 * berdasarkan arah scroll.
 *
 * Logika:
 * - Scroll ke bawah melewati threshold (80px): header sembunyi
 * - Scroll ke atas: header muncul
 * - Di paling atas (scrollY < 10): header selalu tampil
 * - Saat ada elemen fokus di header: header tetap tampil
 */
export function useHeaderVisibility({
    threshold = 80,
    headerRef,
}: {
    threshold?: number;
    headerRef?: React.RefObject<HTMLElement | null>;
} = {}) {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        lastScrollY.current = Math.max(0, window.scrollY);

        const handleScroll = () => {
            if (ticking.current) {
                return;
            }

            ticking.current = true;

            requestAnimationFrame(() => {
                const currentScrollY = Math.max(0, window.scrollY);
                const delta = currentScrollY - lastScrollY.current;

                // Jika ada elemen fokus atau menu/dropdown terbuka di dalam header, jangan sembunyikan
                const hasFocusOrOpenMenu =
                    headerRef?.current &&
                    (headerRef.current.contains(document.activeElement) ||
                        headerRef.current.querySelector(
                            '[data-state="open"], [aria-expanded="true"]',
                        ) !== null);

                if (hasFocusOrOpenMenu) {
                    setIsVisible(true);
                } else if (currentScrollY <= 16) {
                    // Selalu tampil penuh saat posisi di paling atas halaman
                    setIsVisible(true);
                } else if (delta > 0 && currentScrollY > threshold) {
                    // Menggulir ke bawah melewati ambang: sembunyi
                    setIsVisible(false);
                } else if (delta < 0) {
                    // Menggulir ke atas berapa pun jaraknya: muncul kembali seketika
                    setIsVisible(true);
                }

                lastScrollY.current = currentScrollY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold, headerRef]);

    return { isVisible, setIsVisible };
}
