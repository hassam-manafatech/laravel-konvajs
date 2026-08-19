import { Card } from '@/components/ui/card';
import type { FurnitureCatalogItem } from '@/types';

type FurnitureCatalogItemProps = {
    furniture: FurnitureCatalogItem;
    onDragStart: (furniture: FurnitureCatalogItem) => void;
};

export function FurnitureCatalogItemCard({ furniture, onDragStart }: FurnitureCatalogItemProps) {
    return (
        <Card
            draggable
            onDragStart={() => onDragStart(furniture)}
            className="cursor-grab gap-1 border-sidebar-border/70 p-3 active:cursor-grabbing dark:border-sidebar-border"
        >
            <div className="flex items-center justify-between gap-2">
                <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: furniture.default_color }}
                    aria-hidden
                />
                <span className="flex-1 truncate text-sm font-medium">{furniture.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
                {furniture.width_m}m × {furniture.depth_m}m
                {furniture.seat_capacity > 0 ? ` · ${furniture.seat_capacity} seats` : ''}
            </p>
        </Card>
    );
}
