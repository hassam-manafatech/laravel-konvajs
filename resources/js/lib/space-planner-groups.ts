import type { Project, ProjectItem, ReservationStatus } from '@/types';

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

export const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'checked_in'];

/** Chair `ProjectItem` ids currently tied to an active reservation. */
export function reservedChairIds(reservations: Project['reservations']): Set<number> {
    const ids = new Set<number>();

    (reservations ?? [])
        .filter((reservation) => ACTIVE_RESERVATION_STATUSES.includes(reservation.status))
        .forEach((reservation) => (reservation.chairs ?? []).forEach((chair) => ids.add(chair.id)));

    return ids;
}

function chairsForTable(table: ProjectItem, items: ProjectItem[]): ProjectItem[] {
    if (!table.group_id) {
        return [];
    }

    return (groupItemsById(items).get(table.group_id) ?? []).filter(isSeatingItem);
}

/** A table reads as reserved once every chair in its group is reserved; a lone chair reads as reserved on its own. */
export function isItemReserved(item: ProjectItem, items: ProjectItem[], reservedIds: Set<number>): boolean {
    if (reservedIds.has(item.id)) {
        return true;
    }

    if (!isTableItem(item)) {
        return false;
    }

    const chairs = chairsForTable(item, items);

    return chairs.length > 0 && chairs.every((chair) => reservedIds.has(chair.id));
}

export function totalChairCountForTable(table: ProjectItem, items: ProjectItem[]): number {
    return chairsForTable(table, items).length;
}

export function availableChairCountForTable(table: ProjectItem, items: ProjectItem[], reservedIds: Set<number>): number {
    return chairsForTable(table, items).filter((chair) => !reservedIds.has(chair.id)).length;
}
