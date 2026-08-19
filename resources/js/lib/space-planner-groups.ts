import type { ProjectItem } from '@/types';

export type ItemBoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const ITEM_FOOTPRINT_METERS = 1;

export function groupItemsById(
    items: ProjectItem[],
): Map<string, ProjectItem[]> {
    const groups = new Map<string, ProjectItem[]>();

    for (const item of items) {
        if (!item.group_id) {
            continue;
        }

        const members = groups.get(item.group_id) ?? [];
        members.push(item);
        groups.set(item.group_id, members);
    }

    return groups;
}

export function boundingBoxForItems(
    items: ProjectItem[],
    metersToPixels: (meters: number) => number,
): ItemBoundingBox {
    const xs = items.map((item) => parseFloat(item.x_coord));
    const ys = items.map((item) => parseFloat(item.y_coord));
    const halfFootprintPx = metersToPixels(ITEM_FOOTPRINT_METERS / 2);

    const minX = Math.min(...xs) - halfFootprintPx;
    const maxX = Math.max(...xs) + halfFootprintPx;
    const minY = Math.min(...ys) - halfFootprintPx;
    const maxY = Math.max(...ys) + halfFootprintPx;

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

export function isTableItem(item: ProjectItem): boolean {
    return item.furniture?.category === 'table';
}

export function isSeatingItem(item: ProjectItem): boolean {
    return item.furniture?.category === 'seating';
}
