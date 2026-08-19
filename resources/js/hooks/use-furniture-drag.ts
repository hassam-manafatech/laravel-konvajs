import type Konva from 'konva';
import { useCallback, useState } from 'react';
import { pixelsToMeters } from '@/lib/space-planner-units';
import type { FurnitureCatalogItem } from '@/types';

export type UseFurnitureDragReturn = {
    draggingFurniture: FurnitureCatalogItem | null;
    startDraggingFurniture: (furniture: FurnitureCatalogItem) => void;
    handleStageDrop: (
        event: React.DragEvent<HTMLDivElement>,
        stage: Konva.Stage | null,
        onDrop: (furniture: FurnitureCatalogItem, xMeters: number, yMeters: number) => void,
    ) => void;
};

export function useFurnitureDrag(): UseFurnitureDragReturn {
    const [draggingFurniture, setDraggingFurniture] = useState<FurnitureCatalogItem | null>(null);

    const startDraggingFurniture = useCallback((furniture: FurnitureCatalogItem) => {
        setDraggingFurniture(furniture);
    }, []);

    const handleStageDrop = useCallback(
        (
            event: React.DragEvent<HTMLDivElement>,
            stage: Konva.Stage | null,
            onDrop: (furniture: FurnitureCatalogItem, xMeters: number, yMeters: number) => void,
        ) => {
            event.preventDefault();

            if (!draggingFurniture || !stage) {
                return;
            }

            const containerRect = stage.container().getBoundingClientRect();
            const stagePosition = stage.position();
            const stageScale = stage.scaleX() || 1;

            const pointerX = (event.clientX - containerRect.left - stagePosition.x) / stageScale;
            const pointerY = (event.clientY - containerRect.top - stagePosition.y) / stageScale;

            onDrop(draggingFurniture, pixelsToMeters(pointerX), pixelsToMeters(pointerY));
            setDraggingFurniture(null);
        },
        [draggingFurniture],
    );

    return { draggingFurniture, startDraggingFurniture, handleStageDrop };
}
