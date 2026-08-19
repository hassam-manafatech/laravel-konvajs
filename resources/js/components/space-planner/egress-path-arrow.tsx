import type Konva from 'konva';
import { Arrow, Text } from 'react-konva';
import { metersToPixels } from '@/lib/space-planner-units';
import type { EgressPath } from '@/types';

type EgressPathArrowProps = {
    path: EgressPath;
    registerRef: (node: Konva.Arrow | null) => void;
};

export function EgressPathArrow({ path, registerRef }: EgressPathArrowProps) {
    const points = path.path_points.flatMap((point) => [metersToPixels(point.x), metersToPixels(point.y)]);
    const last = path.path_points[path.path_points.length - 1];

    return (
        <>
            <Arrow
                ref={registerRef}
                points={points}
                stroke="#dc2626"
                fill="#dc2626"
                strokeWidth={4}
                pointerLength={12}
                pointerWidth={10}
                dash={[12, 8]}
                tension={0.2}
                lineCap="round"
                listening={false}
            />
            {path.door_label && last && (
                <Text
                    text={path.door_label}
                    fontSize={11}
                    fontStyle="bold"
                    fill="#7f1d1d"
                    x={metersToPixels(last.x) + 8}
                    y={metersToPixels(last.y) - 8}
                    listening={false}
                />
            )}
        </>
    );
}
