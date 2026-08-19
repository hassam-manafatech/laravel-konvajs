import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FloorPlanCanvas2D } from '@/components/space-planner/floor-plan-canvas-2d';
import { FurnitureCatalogPanel } from '@/components/space-planner/furniture-catalog-panel';
import { PerspectiveScene3D } from '@/components/space-planner/perspective-scene-3d';
import { SpacePlannerCanvasSplit } from '@/components/space-planner/space-planner-canvas-split';
import { SpacePlannerToolbar } from '@/components/space-planner/space-planner-toolbar';
import { useCameraSwing } from '@/hooks/use-camera-swing';
import { useFurnitureDrag } from '@/hooks/use-furniture-drag';
import { useNodeLinking } from '@/hooks/use-node-linking';
import { useReservationModal } from '@/hooks/use-reservation-modal';
import { useSpacePlannerCanvas } from '@/hooks/use-space-planner-canvas';
import { useSpacePlannerItems } from '@/hooks/use-space-planner-items';
import { useSpacePlannerTotals } from '@/hooks/use-space-planner-totals';
import { useSpacePlannerViewMode } from '@/hooks/use-space-planner-view-mode';
import { groupItemsById, isItemReserved, reservedChairIds } from '@/lib/space-planner-groups';
import { update as updateProjectRoute } from '@/routes/projects';
import type { FurnitureCatalogItem, Project, ProjectItem } from '@/types';

type SpacePlannerWorkspaceProps = {
    project: Project;
    furnitureCatalog: FurnitureCatalogItem[] | undefined;
};

const BRAND_COLOR_DEBOUNCE_MS = 300;

export function SpacePlannerWorkspace({ project, furnitureCatalog }: SpacePlannerWorkspaceProps) {
    const { items, moveItem, addItem, deleteItem, linkGroup, unlinkGroup } = useSpacePlannerItems(project);
    const { stageRef, selectedId, setSelectedId } = useSpacePlannerCanvas();
    const { draggingFurniture, startDraggingFurniture, handleStageDrop } = useFurnitureDrag();
    const linking = useNodeLinking(linkGroup);
    const reservationModal = useReservationModal(project);
    const totals = useSpacePlannerTotals(project, items, furnitureCatalog ?? []);
    const { viewMode, setViewMode } = useSpacePlannerViewMode();
    const { controlsRef } = useCameraSwing();

    const reservedItemIds = useMemo(() => reservedChairIds(project.reservations), [project.reservations]);
    const isReserved = useCallback((item: ProjectItem) => isItemReserved(item, items, reservedItemIds), [items, reservedItemIds]);

    const [pendingBrandColor, setPendingBrandColor] = useState<string | null>(null);
    const brandColor = pendingBrandColor ?? project.brand_color;
    const brandColorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleBrandColorChange = useCallback(
        (color: string) => {
            setPendingBrandColor(color);

            if (brandColorTimer.current) {
                clearTimeout(brandColorTimer.current);
            }

            brandColorTimer.current = setTimeout(() => {
                router.patch(
                    updateProjectRoute.url(project.id),
                    { brand_color: color },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => setPendingBrandColor(null),
                    },
                );
            }, BRAND_COLOR_DEBOUNCE_MS);
        },
        [project.id],
    );

    const handleItemClick = (item: ProjectItem) => {
        if (linking.linkToolState !== 'idle') {
            linking.handleItemClick(item);
        }
    };

    const selectedItem = items.find((item) => item.id === selectedId) ?? null;
    const selectedGroupMembers = selectedItem?.group_id ? (groupItemsById(items).get(selectedItem.group_id) ?? []) : [];

    const handleDeleteSelected = useCallback(() => {
        if (!selectedItem) {
            return;
        }

        if (isReserved(selectedItem)) {
            toast.error('This item has an active reservation and cannot be deleted.');

            return;
        }

        void deleteItem(selectedItem.id);
        setSelectedId(null);
    }, [selectedItem, isReserved, deleteItem, setSelectedId]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTypingInField = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

            if (isTypingInField || linking.linkToolState !== 'idle') {
                return;
            }

            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                handleDeleteSelected();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleDeleteSelected, linking.linkToolState]);

    return (
        <div className="flex h-full min-h-0 flex-1 gap-4 overflow-hidden p-4">
            <aside className="w-64 shrink-0 rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                <FurnitureCatalogPanel furnitureCatalog={furnitureCatalog} onDragStart={startDraggingFurniture} />
            </aside>

            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <SpacePlannerToolbar
                    project={project}
                    items={items}
                    egressPaths={project.egressPaths ?? []}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    linking={linking}
                    reservationModal={reservationModal}
                    totals={totals}
                    onBrandColorChange={handleBrandColorChange}
                />

                <SpacePlannerCanvasSplit
                    viewMode={viewMode}
                    floorPlan={
                        <FloorPlanCanvas2D
                            project={project}
                            items={items}
                            egressPaths={project.egressPaths ?? []}
                            mode="edit"
                            brandColor={brandColor}
                            showBlueprintGrid={project.show_blueprint_grid}
                            fireSafetyActive={project.fire_safety_active}
                            selectedId={selectedId}
                            onSelectItem={setSelectedId}
                            onMoveItem={moveItem}
                            onItemClick={handleItemClick}
                            linkToolState={linking.linkToolState}
                            anchorItemId={linking.anchorItemId}
                            pendingMemberIds={linking.pendingMemberIds}
                            isReserved={isReserved}
                            draggingFurniture={draggingFurniture}
                            onDropFurniture={(event, stage) =>
                                handleStageDrop(event, stage, (furniture, xMeters, yMeters) =>
                                    void addItem(furniture, xMeters, yMeters),
                                )
                            }
                            stageRef={stageRef}
                        />
                    }
                    perspective={
                        <PerspectiveScene3D
                            project={project}
                            items={items}
                            brandColor={brandColor}
                            selectedId={selectedId}
                            onSelectItem={setSelectedId}
                            isReserved={isReserved}
                            cameraControlsRef={controlsRef}
                        />
                    }
                />
            </div>

            {linking.linkToolState !== 'idle' && (
                <div className="fixed right-6 bottom-6 rounded-lg border border-sidebar-border/70 bg-card px-4 py-2 text-sm shadow-lg dark:border-sidebar-border">
                    {linking.linkToolState === 'selecting-anchor'
                        ? 'Link tool: click a table to start a group.'
                        : `Link tool: click chairs to add them (${linking.pendingMemberIds.length} selected).`}
                    <button
                        type="button"
                        className="ml-3 text-xs underline"
                        onClick={() => (linking.linkToolState === 'selecting-members' ? linking.cancel() : linking.toggleLinkTool())}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {linking.linkToolState === 'idle' && selectedItem && (
                <div className="fixed right-6 bottom-6 flex items-center gap-3 rounded-lg border border-sidebar-border/70 bg-card px-4 py-2 text-sm shadow-lg dark:border-sidebar-border">
                    <span>
                        {selectedItem.furniture?.name ?? 'Item'} selected
                        {selectedGroupMembers.length > 1 ? ` · ${selectedGroupMembers.length} items linked` : ''}
                    </span>
                    {selectedGroupMembers.length > 1 && (
                        <button
                            type="button"
                            className="text-xs underline"
                            onClick={() => void unlinkGroup(selectedGroupMembers.map((member) => member.id))}
                        >
                            Unlink group
                        </button>
                    )}
                    {isReserved(selectedItem) ? (
                        <span className="text-xs text-muted-foreground">Reserved — release it first to delete</span>
                    ) : (
                        <button
                            type="button"
                            className="flex items-center gap-1 text-xs text-destructive underline"
                            onClick={handleDeleteSelected}
                        >
                            <Trash2 className="size-3" />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
