import { useMemo } from 'react';
import type { FurnitureCatalogItem, Project, ProjectItem } from '@/types';

export type UseSpacePlannerTotalsReturn = {
    totalSeats: number;
    seatsPerSqMeter: number;
};

export function useSpacePlannerTotals(
    project: Project,
    items: ProjectItem[],
    furnitureCatalog: FurnitureCatalogItem[],
): UseSpacePlannerTotalsReturn {
    const hasUnreconciledItems = items.some((item) => item.id < 0);

    const clientSeats = useMemo(() => {
        const catalogById = new Map(furnitureCatalog.map((entry) => [entry.id, entry]));

        return items.reduce((seats, item) => {
            const furniture = item.furniture ?? catalogById.get(item.furniture_id);

            return furniture ? seats + furniture.seat_capacity : seats;
        }, 0);
    }, [items, furnitureCatalog]);

    const totalSeats = hasUnreconciledItems ? clientSeats : project.total_seats;

    const floorAreaSqM = parseFloat(project.width_m) * parseFloat(project.height_m);
    const seatsPerSqMeter = floorAreaSqM > 0 ? totalSeats / floorAreaSqM : 0;

    return { totalSeats, seatsPerSqMeter };
}
