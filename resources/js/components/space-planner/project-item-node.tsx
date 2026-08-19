import type Konva from 'konva';
import { Circle, Group, Rect, Text } from 'react-konva';
import { isSeatingItem } from '@/lib/space-planner-groups';
import { metersToPixels, pixelsToMeters } from '@/lib/space-planner-units';
import type { ProjectItem } from '@/types';

const CIRCLE_SHAPES = new Set(['round', 'chair', 'stool']);

type ProjectItemNodeProps = {
    item: ProjectItem;
    isSelected: boolean;
    isReserved: boolean;
    isLinkAnchor: boolean;
    isPendingLinkMember: boolean;
    brandColor: string;
    draggable: boolean;
    onSelect: (id: number) => void;
    onDragEnd: (id: number, xMeters: number, yMeters: number) => void;
    onClick: (item: ProjectItem) => void;
};

const RESERVED_FILL = '#94a3b8';

export function ProjectItemNode({
    item,
    isSelected,
    isReserved,
    isLinkAnchor,
    isPendingLinkMember,
    brandColor,
    draggable,
    onSelect,
    onDragEnd,
    onClick,
}: ProjectItemNodeProps) {
    const widthMeters = parseFloat(item.furniture?.width_m ?? '1');
    const depthMeters = parseFloat(item.furniture?.depth_m ?? '1');
    const width = metersToPixels(widthMeters);
    const height = metersToPixels(depthMeters);
    const x = metersToPixels(parseFloat(item.x_coord));
    const y = metersToPixels(parseFloat(item.y_coord));

    const renderMetadata = item.furniture?.render_metadata;
    const fill = isReserved
        ? RESERVED_FILL
        : (item.custom_color ?? (renderMetadata?.brand_accent ? brandColor : item.furniture?.default_color) ?? brandColor);
    const opacity = isReserved ? 0.55 : 1;
    const shapeHint = renderMetadata?.shape;
    const isCircle = shapeHint ? CIRCLE_SHAPES.has(shapeHint) : isSeatingItem(item);

    const handleDragEnd = (event: Konva.KonvaEventObject<DragEvent>) => {
        const node = event.target;

        onDragEnd(item.id, parseFloat(pixelsToMeters(node.x()).toFixed(2)), parseFloat(pixelsToMeters(node.y()).toFixed(2)));
    };

    return (
        <Group
            x={x}
            y={y}
            rotation={item.rotation}
            draggable={draggable}
            onClick={() => {
                onSelect(item.id);
                onClick(item);
            }}
            onTap={() => {
                onSelect(item.id);
                onClick(item);
            }}
            onDragEnd={handleDragEnd}
        >
            {isCircle ? (
                <Circle
                    radius={Math.min(width, height) / 2}
                    fill={fill}
                    opacity={opacity}
                    stroke={isSelected || isLinkAnchor || isPendingLinkMember ? '#111827' : undefined}
                    strokeWidth={isSelected || isLinkAnchor || isPendingLinkMember ? 2 : 0}
                />
            ) : (
                <Rect
                    width={width}
                    height={height}
                    offsetX={width / 2}
                    offsetY={height / 2}
                    cornerRadius={6}
                    fill={fill}
                    opacity={opacity}
                    stroke={isSelected || isLinkAnchor || isPendingLinkMember ? '#111827' : undefined}
                    strokeWidth={isSelected || isLinkAnchor || isPendingLinkMember ? 2 : 0}
                />
            )}

            <Text
                text={item.furniture?.name ?? ''}
                fontSize={11}
                fill="#111827"
                width={width}
                align="center"
                x={0}
                y={height / 2 + 4}
                listening={false}
            />

            {isReserved && (
                <Text
                    text="Reserved"
                    fontSize={10}
                    fontStyle="bold"
                    fill="#7f1d1d"
                    width={width}
                    align="center"
                    x={0}
                    y={-height / 2 - 16}
                    listening={false}
                />
            )}
        </Group>
    );
}
