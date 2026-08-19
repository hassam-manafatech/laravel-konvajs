import { useMemo, useState } from 'react';
import { FloorPlanCanvas2D } from '@/components/space-planner/floor-plan-canvas-2d';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { UseReservationModalReturn } from '@/hooks/use-reservation-modal';
import { availableChairCountForTable, isTableItem, totalChairCountForTable } from '@/lib/space-planner-groups';
import type { EgressPath, Project, ProjectItem } from '@/types';

type ManageReservationsDialogProps = {
    project: Project;
    items: ProjectItem[];
    egressPaths: EgressPath[];
    reservationModal: UseReservationModalReturn;
};

export function ManageReservationsDialog({ project, items, egressPaths, reservationModal }: ManageReservationsDialogProps) {
    const [customerName, setCustomerName] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<string>('');
    const [chairsCount, setChairsCount] = useState(1);

    const handleItemClick = (item: ProjectItem) => {
        if (reservationModal.isReserved(item)) {
            reservationModal.release(item);

            return;
        }

        if (!customerName || !reservationTime) {
            return;
        }

        reservationModal.reserve(item, customerName, reservationTime);
    };

    const tableOptions = useMemo(
        () =>
            items
                .filter(isTableItem)
                .map((table) => ({
                    table,
                    total: totalChairCountForTable(table, items),
                    available: availableChairCountForTable(table, items, reservationModal.reservedItemIds),
                }))
                .filter((option) => option.total > 0),
        [items, reservationModal.reservedItemIds],
    );

    const selectedTableOption = tableOptions.find((option) => String(option.table.id) === selectedTableId);
    const canQuickReserve = Boolean(selectedTableOption && customerName && reservationTime && chairsCount >= 1);

    const handleQuickReserve = () => {
        if (!selectedTableOption || !canQuickReserve) {
            return;
        }

        reservationModal.reserve(selectedTableOption.table, customerName, reservationTime, chairsCount);
        setSelectedTableId('');
        setChairsCount(1);
    };

    return (
        <Dialog open={reservationModal.isOpen} onOpenChange={(open) => (open ? reservationModal.open() : reservationModal.close())}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Manage reservations
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Manage reservations</DialogTitle>
                    <DialogDescription>
                        Click a table to reserve every chair in its group, or click a single chair to reserve just that seat. Click a
                        reserved table or chair again to release it.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-[1fr_14rem] gap-4">
                    <div className="h-[60vh]">
                        <FloorPlanCanvas2D
                            project={project}
                            items={items}
                            egressPaths={egressPaths}
                            mode="reservation"
                            brandColor={project.brand_color}
                            showBlueprintGrid={project.show_blueprint_grid}
                            fireSafetyActive={project.fire_safety_active}
                            selectedId={selectedId}
                            onSelectItem={setSelectedId}
                            onMoveItem={() => {}}
                            onItemClick={handleItemClick}
                            isReserved={reservationModal.isReserved}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="reservation-customer-name">Customer name</Label>
                            <Input
                                id="reservation-customer-name"
                                value={customerName}
                                onChange={(event) => setCustomerName(event.target.value)}
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="reservation-time">Reservation time</Label>
                            <Input
                                id="reservation-time"
                                type="datetime-local"
                                value={reservationTime}
                                onChange={(event) => setReservationTime(event.target.value)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Fill in the details, then click a table or chair on the floor plan to reserve it. Click it again anytime
                            to release it.
                        </p>

                        <Separator />

                        <div className="space-y-1">
                            <Label>Quick reserve by table</Label>
                            <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a table" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tableOptions.map(({ table, total, available }) => (
                                        <SelectItem key={table.id} value={String(table.id)} disabled={available === 0}>
                                            {table.furniture?.name ?? 'Table'} — {available}/{total} available
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="reservation-chairs-count">Chairs to reserve</Label>
                            <Input
                                id="reservation-chairs-count"
                                type="number"
                                min={1}
                                max={selectedTableOption?.available ?? 1}
                                value={chairsCount}
                                onChange={(event) => setChairsCount(Number(event.target.value))}
                            />
                        </div>

                        <Button size="sm" className="w-full" disabled={!canQuickReserve} onClick={handleQuickReserve}>
                            Reserve chairs
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
