import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Lock,
    MinusCircle,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type SemanticStatus =
    | 'draft'
    | 'terbuka'
    | 'dikunci'
    | 'selesai'
    | 'dibatalkan'
    | 'terdaftar'
    | 'valid'
    | 'ditolak'
    | 'diajukan'
    | 'disetujui'
    | 'aktif'
    | 'nonaktif';

const statusConfig: Record<
    SemanticStatus,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    draft: {
        label: 'Draf',
        className: 'border-border bg-muted text-muted-foreground',
        icon: MinusCircle,
    },
    terbuka: {
        label: 'Terbuka',
        className: 'border-info/30 bg-info/10 text-info',
        icon: Clock,
    },
    dikunci: {
        label: 'Dikunci',
        className: 'border-warning/30 bg-warning/10 text-warning',
        icon: Lock,
    },
    selesai: {
        label: 'Selesai',
        className: 'border-success/30 bg-success/10 text-success',
        icon: CheckCircle2,
    },
    dibatalkan: {
        label: 'Dibatalkan',
        className: 'border-destructive/30 bg-destructive/10 text-destructive',
        icon: XCircle,
    },
    terdaftar: {
        label: 'Terdaftar',
        className: 'border-info/30 bg-info/10 text-info',
        icon: CheckCircle2,
    },
    valid: {
        label: 'Valid',
        className: 'border-success/30 bg-success/10 text-success',
        icon: CheckCircle2,
    },
    ditolak: {
        label: 'Ditolak',
        className: 'border-destructive/30 bg-destructive/10 text-destructive',
        icon: XCircle,
    },
    diajukan: {
        label: 'Menunggu',
        className: 'border-warning/30 bg-warning/10 text-warning',
        icon: AlertCircle,
    },
    disetujui: {
        label: 'Disetujui',
        className: 'border-success/30 bg-success/10 text-success',
        icon: CheckCircle2,
    },
    aktif: {
        label: 'Aktif',
        className: 'border-success/30 bg-success/10 text-success',
        icon: CheckCircle2,
    },
    nonaktif: {
        label: 'Nonaktif',
        className: 'border-border bg-muted text-muted-foreground',
        icon: MinusCircle,
    },
};

export function StatusBadge({
    status,
    label,
    className,
}: {
    status: SemanticStatus;
    label?: string;
    className?: string;
}) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn('gap-1.5 font-medium', config.className, className)}
        >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{label ?? config.label}</span>
        </Badge>
    );
}
