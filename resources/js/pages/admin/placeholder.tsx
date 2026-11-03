import ModulePlaceholder from '@/components/module-placeholder';

export default function AdminPlaceholder({ module }: { module: string }) {
    return <ModulePlaceholder module={module} audience="Internal Manajemen" />;
}
