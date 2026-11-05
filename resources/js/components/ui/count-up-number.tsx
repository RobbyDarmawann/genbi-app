import { useEffect, useRef, useState } from 'react';
import { formatAngka } from '@/lib/format';
import { cn } from '@/lib/utils';

type CountUpNumberProps = {
    value: number;
    duration?: number;
    formatter?: (val: number) => string;
    className?: string;
    suffix?: string;
    prefix?: string;
};

export function CountUpNumber({
    value,
    duration = 850,
    formatter = formatAngka,
    className,
    suffix = '',
    prefix = '',
}: CountUpNumberProps) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const [displayValue, setDisplayValue] = useState<number>(
        prefersReduced ? value : 0,
    );
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (
            !node ||
            typeof window === 'undefined' ||
            prefersReduced ||
            value === 0 ||
            typeof IntersectionObserver === 'undefined'
        ) {
            setDisplayValue(value);
            return;
        }

        let rafId = 0;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting || hasAnimatedRef.current) {
                    return;
                }
                hasAnimatedRef.current = true;
                observer.disconnect();

                const startTime = performance.now();
                const step = (now: number) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplayValue(Math.round(eased * value));

                    if (progress < 1) {
                        rafId = window.requestAnimationFrame(step);
                    } else {
                        setDisplayValue(value);
                    }
                };

                rafId = window.requestAnimationFrame(step);
            },
            { threshold: 0.2 },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, [value, duration, prefersReduced]);

    return (
        <span
            ref={ref}
            className={cn('tabular-nums', className)}
            aria-label={`${prefix}${formatter(value)}${suffix}`}
        >
            {prefix}
            {formatter(displayValue)}
            {suffix}
        </span>
    );
}
