import { useMemo } from 'react';
import { FurnitureCatalogItemCard } from '@/components/space-planner/furniture-catalog-item';
import type { FurnitureCatalogItem } from '@/types';

type FurnitureCatalogPanelProps = {
    furnitureCatalog: FurnitureCatalogItem[] | undefined;
    onDragStart: (furniture: FurnitureCatalogItem) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
    table: 'Tables',
    seating: 'Seating',
    counter: 'Counters',
    desk: 'Desks',
    fixture: 'Fixtures',
};

export function FurnitureCatalogPanel({ furnitureCatalog, onDragStart }: FurnitureCatalogPanelProps) {
    const grouped = useMemo(() => {
        const groups = new Map<string, FurnitureCatalogItem[]>();

        (furnitureCatalog ?? []).forEach((item) => {
            const members = groups.get(item.category) ?? [];
            members.push(item);
            groups.set(item.category, members);
        });

        return groups;
    }, [furnitureCatalog]);

    if (!furnitureCatalog) {
        return (
            <div className="space-y-2 p-3">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
            {Array.from(grouped.entries()).map(([category, members]) => (
                <div key={category} className="space-y-2">
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {CATEGORY_LABELS[category] ?? category}
                    </h3>
                    <div className="space-y-2">
                        {members.map((furniture) => (
                            <FurnitureCatalogItemCard key={furniture.id} furniture={furniture} onDragStart={onDragStart} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
