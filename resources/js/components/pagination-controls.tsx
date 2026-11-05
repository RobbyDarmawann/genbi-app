import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginationMeta = {
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

type Props = {
    meta: PaginationMeta;
    itemLabel?: string;
};

export function PaginationControls({ meta, itemLabel = 'item' }: Props) {
    if (meta.total === 0) {
        return null;
    }

    const showPagination = meta.links.length > 3;

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total}{' '}
                {itemLabel}
            </p>
            {showPagination && (
                <nav className="flex items-center gap-1">
                    {meta.links.map((link, index) => {
                        const isFirst = index === 0;
                        const isLast = index === meta.links.length - 1;
                        const label = link.label
                            .replace('&laquo;', '')
                            .replace('&raquo;', '')
                            .replace('Previous', '')
                            .replace('Next', '')
                            .trim();

                        if (isFirst) {
                            return (
                                <Button
                                    key="prev"
                                    variant="outline"
                                    size="sm"
                                    asChild={!!link.url}
                                    disabled={!link.url}
                                    className="h-9 gap-1 px-3"
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                        >
                                            <ChevronLeft className="size-4" />
                                            <span className="sr-only sm:not-sr-only">
                                                Sebelumnya
                                            </span>
                                        </Link>
                                    ) : (
                                        <>
                                            <ChevronLeft className="size-4" />
                                            <span className="sr-only sm:not-sr-only">
                                                Sebelumnya
                                            </span>
                                        </>
                                    )}
                                </Button>
                            );
                        }

                        if (isLast) {
                            return (
                                <Button
                                    key="next"
                                    variant="outline"
                                    size="sm"
                                    asChild={!!link.url}
                                    disabled={!link.url}
                                    className="h-9 gap-1 px-3"
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                        >
                                            <span className="sr-only sm:not-sr-only">
                                                Berikutnya
                                            </span>
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            <span className="sr-only sm:not-sr-only">
                                                Berikutnya
                                            </span>
                                            <ChevronRight className="size-4" />
                                        </>
                                    )}
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild={!!link.url}
                                disabled={!link.url}
                                className="size-9"
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span>{label}</span>
                                )}
                            </Button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
