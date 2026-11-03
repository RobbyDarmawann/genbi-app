import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ResponsiveColumn<T> = {
    key: string;
    header: string;
    align?: 'left' | 'right';
    cell: (row: T) => ReactNode;
};

type ResponsiveTableProps<T> = {
    caption?: string;
    columns: ResponsiveColumn<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    renderMobileCard: (row: T) => ReactNode;
    emptyState?: ReactNode;
};

export function ResponsiveTable<T>({
    caption,
    columns,
    data,
    keyExtractor,
    renderMobileCard,
    emptyState,
}: ResponsiveTableProps<T>) {
    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div>
            <div className="grid gap-3 md:hidden">
                {data.map((row) => (
                    <article
                        key={keyExtractor(row)}
                        className="rounded-lg border bg-card p-4 text-card-foreground"
                    >
                        {renderMobileCard(row)}
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto rounded-lg border bg-card md:block">
                <table className="w-full border-collapse text-left text-sm">
                    {caption && (
                        <caption className="sr-only">{caption}</caption>
                    )}
                    <thead className="sticky top-0 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={cn(
                                        'px-4 py-3 font-medium',
                                        column.align === 'right' &&
                                            'text-right tabular-nums',
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.map((row) => (
                            <tr
                                key={keyExtractor(row)}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'px-4 py-3 align-middle',
                                            column.align === 'right' &&
                                                'text-right tabular-nums',
                                        )}
                                    >
                                        {column.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
