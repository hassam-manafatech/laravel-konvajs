import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { groupItemsById, isItemReserved, isSeatingItem, isTableItem, reservedChairIds } from '@/lib/space-planner-groups';
import { release as reservationsReleaseRoute, store as reservationsStoreRoute } from '@/routes/reservations';
import type { Project, ProjectItem } from '@/types';

export type UseReservationModalReturn = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    reserve: (item: ProjectItem, customerName: string, reservationTime: string, chairsCount?: number) => void;
    release: (item: ProjectItem) => void;
    isReserved: (item: ProjectItem) => boolean;
    reservedItemIds: Set<number>;
    isSubmitting: boolean;
};

function targetsForClick(item: ProjectItem, items: ProjectItem[]): ProjectItem[] {
    if (isTableItem(item) && item.group_id) {
        const groups = groupItemsById(items);

        return (groups.get(item.group_id) ?? []).filter(isSeatingItem);
    }

    return [item];
}

export function useReservationModal(project: Project): UseReservationModalReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [optimisticReservedIds, setOptimisticReservedIds] = useState<Set<number>>(new Set());
    const [optimisticReleasedIds, setOptimisticReleasedIds] = useState<Set<number>>(new Set());

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const resetOptimisticState = useCallback(() => {
        setOptimisticReservedIds(new Set());
        setOptimisticReleasedIds(new Set());
    }, []);

    const confirmedReservedIds = useMemo(() => reservedChairIds(project.reservations), [project.reservations]);

    const reservedItemIds = useMemo(() => {
        const ids = new Set([...confirmedReservedIds, ...optimisticReservedIds]);
        optimisticReleasedIds.forEach((id) => ids.delete(id));

        return ids;
    }, [confirmedReservedIds, optimisticReservedIds, optimisticReleasedIds]);

    const isReserved = useCallback(
        (item: ProjectItem) => isItemReserved(item, project.items ?? [], reservedItemIds),
        [reservedItemIds, project.items],
    );

    const reserve = useCallback(
        (item: ProjectItem, customerName: string, reservationTime: string, chairsCount?: number) => {
            const clickedTargets = targetsForClick(item, project.items ?? []);
            const availableTargets = clickedTargets.filter((target) => !reservedItemIds.has(target.id));
            const targets = chairsCount != null ? availableTargets.slice(0, chairsCount) : availableTargets;
            const targetIds = targets.map((target) => target.id);

            setOptimisticReservedIds((current) => new Set([...current, ...targetIds]));
            setIsSubmitting(true);

            router.post(
                reservationsStoreRoute.url(project.id),
                {
                    project_item_id: item.id,
                    customer_name: customerName,
                    reservation_time: reservationTime,
                    ...(chairsCount != null ? { chairs_count: chairsCount } : {}),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: resetOptimisticState,
                    onError: () => {
                        setOptimisticReservedIds((current) => {
                            const next = new Set(current);
                            targetIds.forEach((id) => next.delete(id));

                            return next;
                        });
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        },
        [project.id, project.items, reservedItemIds, resetOptimisticState],
    );

    const release = useCallback(
        (item: ProjectItem) => {
            const clickedTargets = targetsForClick(item, project.items ?? []);
            const targets = clickedTargets.filter((target) => reservedItemIds.has(target.id));
            const targetIds = targets.map((target) => target.id);

            if (targetIds.length === 0) {
                return;
            }

            setOptimisticReleasedIds((current) => new Set([...current, ...targetIds]));
            setIsSubmitting(true);

            router.post(
                reservationsReleaseRoute.url(project.id),
                { project_item_id: item.id },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: resetOptimisticState,
                    onError: () => {
                        setOptimisticReleasedIds((current) => {
                            const next = new Set(current);
                            targetIds.forEach((id) => next.delete(id));

                            return next;
                        });
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        },
        [project.id, project.items, reservedItemIds, resetOptimisticState],
    );

    return { isOpen, open, close, reserve, release, isReserved, reservedItemIds, isSubmitting };
}
