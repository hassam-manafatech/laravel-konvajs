import { Fragment, useMemo } from 'react';
import { Rect } from 'react-konva';
import { boundingBoxForItems, groupItemsById } from '@/lib/space-planner-groups';
import { metersToPixels } from '@/lib/space-planner-units';
import type { ProjectItem } from '@/types';

type GroupOutlineLayerProps = {
    items: ProjectItem[];
};

export function GroupOutlineLayer({ items }: GroupOutlineLayerProps) {
    const groups = useMemo(() => groupItemsById(items), [items]);

    return (
        <Fragment>
            {Array.from(groups.entries()).map(([groupId, members]) => {
                if (members.length < 2) {
                    return null;
                }

                const box = boundingBoxForItems(members, metersToPixels);

                return (
                    <Rect
                        key={groupId}
                        x={box.x}
                        y={box.y}
                        width={box.width}
                        height={box.height}
                        cornerRadius={10}
                        stroke="#9ca3af"
                        strokeWidth={1.5}
                        dash={[6, 4]}
                        listening={false}
                    />
                );
            })}
        </Fragment>
    );
}
