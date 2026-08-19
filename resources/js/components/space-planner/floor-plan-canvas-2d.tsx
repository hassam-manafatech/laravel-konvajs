import type Konva from 'konva';
import { useMemo } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { EgressPathArrow } from '@/components/space-planner/egress-path-arrow';
import { GroupOutlineLayer } from '@/components/space-planner/group-outline-layer';
import { ProjectItemNode } from '@/components/space-planner/project-item-node';
import { useEgressPathAnimation } from '@/hooks/use-egress-path-animation';
import type { LinkToolState } from '@/hooks/use-node-linking';
import { metersToPixels } from '@/lib/space-planner-units';
import type { EgressPath, FurnitureCatalogItem, Project, ProjectItem } from '@/types';

export type FloorPlanCanvasMode = 'edit' | 'reservation';

type FloorPlanCanvas2DProps = {
    project: Project;
    items: ProjectItem[];
    egressPaths: EgressPath[];
    mode: FloorPlanCanvasMode;
    brandColor: string;
    showBlueprintGrid: boolean;
    fireSafetyActive: boolean;
    selectedId: number | null;
    onSelectItem: (id: number | null) => void;
    onMoveItem: (id: number, xMeters: number, yMeters: number) => void;
    onItemClick: (item: ProjectItem) => void;
    linkToolState?: LinkToolState;
    anchorItemId?: number | null;
    pendingMemberIds?: number[];
    isReserved?: (item: ProjectItem) => boolean;
    draggingFurniture?: FurnitureCatalogItem | null;
    onDropFurniture?: (event: React.DragEvent<HTMLDivElement>, stage: Konva.Stage | null) => void;
    stageRef?: React.RefObject<Konva.Stage | null>;
};

const GRID_MINOR_STROKE = 'rgba(31, 58, 95, 0.06)';
const GRID_MAJOR_STROKE = 'rgba(31, 58, 95, 0.14)';
const GRID_MAJOR_INTERVAL_METERS = 5;
const PADDING_METERS = 1;

export function FloorPlanCanvas2D({
    project,
    items,
    egressPaths,
    mode,
    brandColor,
    showBlueprintGrid,
    fireSafetyActive,
    selectedId,
    onSelectItem,
    onMoveItem,
    onItemClick,
    linkToolState = 'idle',
    anchorItemId = null,
    pendingMemberIds = [],
    isReserved,
    draggingFurniture,
    onDropFurniture,
    stageRef,
}: FloorPlanCanvas2DProps) {
    const widthMeters = parseFloat(project.width_m) + PADDING_METERS * 2;
    const heightMeters = parseFloat(project.height_m) + PADDING_METERS * 2;
    const stageWidth = metersToPixels(widthMeters);
    const stageHeight = metersToPixels(heightMeters);
    const offset = metersToPixels(PADDING_METERS);

    const { registerPath } = useEgressPathAnimation(fireSafetyActive);

    const gridLines = useMemo(() => {
        if (!showBlueprintGrid) {
            return [];
        }

        const lines: { key: string; points: number[]; major: boolean }[] = [];

        for (let x = 0; x <= widthMeters; x += 1) {
            lines.push({
                key: `v-${x}`,
                points: [metersToPixels(x), 0, metersToPixels(x), stageHeight],
                major: x % GRID_MAJOR_INTERVAL_METERS === 0,
            });
        }

        for (let y = 0; y <= heightMeters; y += 1) {
            lines.push({
                key: `h-${y}`,
                points: [0, metersToPixels(y), stageWidth, metersToPixels(y)],
                major: y % GRID_MAJOR_INTERVAL_METERS === 0,
            });
        }

        return lines;
    }, [showBlueprintGrid, widthMeters, heightMeters, stageWidth, stageHeight]);

    return (
        <div
            className="relative h-full w-full overflow-auto rounded-lg border border-sidebar-border/70 bg-warm-white dark:border-sidebar-border"
            onDragOver={(event) => {
                if (draggingFurniture) {
                    event.preventDefault();
                }
            }}
            onDrop={(event) => onDropFurniture?.(event, stageRef?.current ?? null)}
        >
            <Stage
                ref={stageRef}
                width={stageWidth}
                height={stageHeight}
                x={0}
                y={0}
                onMouseDown={(event) => {
                    if (event.target === event.target.getStage()) {
                        onSelectItem(null);
                    }
                }}
            >
                <Layer x={offset} y={offset}>
                    {gridLines.map((line) => (
                        <Line
                            key={line.key}
                            points={line.points}
                            stroke={line.major ? GRID_MAJOR_STROKE : GRID_MINOR_STROKE}
                            strokeWidth={line.major ? 1.25 : 1}
                            listening={false}
                        />
                    ))}
                </Layer>

                <Layer x={offset} y={offset}>
                    <GroupOutlineLayer items={items} />

                    {items.map((item) => (
                        <ProjectItemNode
                            key={item.id}
                            item={item}
                            isSelected={selectedId === item.id}
                            isReserved={isReserved?.(item) ?? false}
                            isLinkAnchor={anchorItemId === item.id}
                            isPendingLinkMember={pendingMemberIds.includes(item.id)}
                            brandColor={brandColor}
                            draggable={mode === 'edit' && linkToolState === 'idle' && !(isReserved?.(item) ?? false)}
                            onSelect={onSelectItem}
                            onDragEnd={onMoveItem}
                            onClick={onItemClick}
                        />
                    ))}
                </Layer>

                {fireSafetyActive && (
                    <Layer x={offset} y={offset}>
                        {egressPaths.map((path) => (
                            <EgressPathArrow key={path.id} path={path} registerRef={registerPath(path.id)} />
                        ))}
                    </Layer>
                )}
            </Stage>
        </div>
    );
}
