import { router } from '@inertiajs/react';
import { Link2, Link2Off, ShieldAlert } from 'lucide-react';
import { BrandColorPopover } from '@/components/space-planner/brand-color-popover';
import { CapacityMeter } from '@/components/space-planner/capacity-meter';
import { CostEstimatorSheet } from '@/components/space-planner/cost-estimator-sheet';
import { ManageReservationsDialog } from '@/components/space-planner/manage-reservations-dialog';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { UseNodeLinkingReturn } from '@/hooks/use-node-linking';
import type { UseReservationModalReturn } from '@/hooks/use-reservation-modal';
import type { UseSpacePlannerTotalsReturn } from '@/hooks/use-space-planner-totals';
import type { SpacePlannerViewMode } from '@/hooks/use-space-planner-view-mode';
import { toggle as fireSafetyToggleRoute } from '@/routes/fire-safety';
import type { EgressPath, FurnitureCatalogItem, Project, ProjectItem } from '@/types';

type SpacePlannerToolbarProps = {
    project: Project;
    items: ProjectItem[];
    egressPaths: EgressPath[];
    furnitureCatalog: FurnitureCatalogItem[] | undefined;
    viewMode: SpacePlannerViewMode;
    onViewModeChange: (mode: SpacePlannerViewMode) => void;
    linking: UseNodeLinkingReturn;
    reservationModal: UseReservationModalReturn;
    totals: UseSpacePlannerTotalsReturn;
    onBrandColorChange: (color: string) => void;
};

export function SpacePlannerToolbar({
    project,
    items,
    egressPaths,
    furnitureCatalog,
    viewMode,
    onViewModeChange,
    linking,
    reservationModal,
    totals,
    onBrandColorChange,
}: SpacePlannerToolbarProps) {
    const isLinkToolActive = linking.linkToolState !== 'idle';

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-sidebar-border/70 p-3 dark:border-sidebar-border">
            <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={viewMode}
                onValueChange={(value) => value && onViewModeChange(value as SpacePlannerViewMode)}
            >
                <ToggleGroupItem value="2d">2D</ToggleGroupItem>
                <ToggleGroupItem value="split">Split</ToggleGroupItem>
                <ToggleGroupItem value="3d">3D</ToggleGroupItem>
            </ToggleGroup>

            <Button
                variant={isLinkToolActive ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={linking.toggleLinkTool}
            >
                {isLinkToolActive ? <Link2 className="size-4" /> : <Link2Off className="size-4" />}
                Link tool
            </Button>

            {linking.linkToolState === 'selecting-members' && linking.pendingMemberIds.length > 0 && (
                <Button size="sm" onClick={() => void linking.confirmLink()}>
                    Confirm link ({linking.pendingMemberIds.length})
                </Button>
            )}

            <Button
                variant={project.fire_safety_active ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => router.patch(fireSafetyToggleRoute.url(project.id), {}, { preserveScroll: true, preserveState: true })}
            >
                <ShieldAlert className="size-4" />
                Fire safety
            </Button>

            <BrandColorPopover color={project.brand_color} onChange={onBrandColorChange} />

            <ManageReservationsDialog project={project} items={items} egressPaths={egressPaths} reservationModal={reservationModal} />

            <CostEstimatorSheet items={items} furnitureCatalog={furnitureCatalog} totalCost={totals.totalCost} />

            <div className="ml-auto">
                <CapacityMeter totals={totals} />
            </div>
        </div>
    );
}
