import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { groupItemsById, isSeatingItem, isTableItem } from '@/lib/space-planner-groups';
import { store as reservationsStoreRoute } from '@/routes/reservations';
import type { Project, ProjectItem, ReservationStatus } from '@/types';

export type UseReservationModalReturn = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    reserve: (item: ProjectItem, customerName: string, reservationTime: string) => void;
    isReserved: (item: ProjectItem) => boolean;
    isSubmitting: boolean;
};

const ACTIVE_STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'checked_in'];

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

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const reservedItemIds = useMemo(() => {
        const ids = new Set<number>();

        (project.reservations ?? [])
            .filter((reservation) => ACTIVE_STATUSES.includes(reservation.status))
            .forEach((reservation) => (reservation.chairs ?? []).forEach((chair) => ids.add(chair.id)));

        return ids;
    }, [project.reservations]);

    const isReserved = useCallback(
        (item: ProjectItem) => reservedItemIds.has(item.id) || optimisticReservedIds.has(item.id),
        [reservedItemIds, optimisticReservedIds],
    );

    const reserve = useCallback(
        (item: ProjectItem, customerName: string, reservationTime: string) => {
            const targets = targetsForClick(item, project.items ?? []);
            const targetIds = targets.map((target) => target.id);

            setOptimisticReservedIds((current) => new Set([...current, ...targetIds]));
            setIsSubmitting(true);

            router.post(
                reservationsStoreRoute.url(project.id),
                {
                    project_item_id: item.id,
                    customer_name: customerName,
                    reservation_time: reservationTime,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
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
        [project.id, project.items],
    );

    return { isOpen, open, close, reserve, isReserved, isSubmitting };
}
