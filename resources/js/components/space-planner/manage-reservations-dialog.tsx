import { useState } from 'react';
import { FloorPlanCanvas2D } from '@/components/space-planner/floor-plan-canvas-2d';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UseReservationModalReturn } from '@/hooks/use-reservation-modal';
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

    const handleItemClick = (item: ProjectItem) => {
        if (!customerName || !reservationTime || reservationModal.isReserved(item)) {
            return;
        }

        reservationModal.reserve(item, customerName, reservationTime);
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
                        Click a table to reserve every chair in its group, or click a single chair to reserve just that seat.
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
                            Fill in the details, then click a table or chair on the floor plan to reserve it.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
