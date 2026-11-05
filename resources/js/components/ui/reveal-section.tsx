import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type RevealSectionProps = HTMLAttributes<HTMLDivElement> & {
    delayMs?: number;
};

export function RevealSection({
    children,
    className,
    delayMs = 0,
    style,
    ...props
}: RevealSectionProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof window === 'undefined') {
            return;
        }

        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            typeof IntersectionObserver === 'undefined'
        ) {
            setVisible(true);
            return;
        }

        setVisible(false);

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                ...style,
                transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
            }}
            className={cn(
                'transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
