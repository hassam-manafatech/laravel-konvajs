import { useMemo } from 'react';
import type { FurnitureCatalogItem, Project, ProjectItem } from '@/types';

export type UseSpacePlannerTotalsReturn = {
    totalSeats: number;
    totalCost: number;
    seatsPerSqMeter: number;
};

export function useSpacePlannerTotals(
    project: Project,
    items: ProjectItem[],
    furnitureCatalog: FurnitureCatalogItem[],
): UseSpacePlannerTotalsReturn {
    const hasUnreconciledItems = items.some((item) => item.id < 0);

    const clientTotals = useMemo(() => {
        const catalogById = new Map(furnitureCatalog.map((entry) => [entry.id, entry]));

        return items.reduce(
            (totals, item) => {
                const furniture = item.furniture ?? catalogById.get(item.furniture_id);

                if (!furniture) {
                    return totals;
                }

                return {
                    seats: totals.seats + furniture.seat_capacity,
                    cost: totals.cost + parseFloat(furniture.price),
                };
            },
            { seats: 0, cost: 0 },
        );
    }, [items, furnitureCatalog]);

    const totalSeats = hasUnreconciledItems ? clientTotals.seats : project.total_seats;
    const totalCost = hasUnreconciledItems ? clientTotals.cost : parseFloat(project.total_cost);

    const floorAreaSqM = parseFloat(project.width_m) * parseFloat(project.height_m);
    const seatsPerSqMeter = floorAreaSqM > 0 ? totalSeats / floorAreaSqM : 0;

    return { totalSeats, totalCost, seatsPerSqMeter };
}
