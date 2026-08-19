import type Konva from 'konva';
import { useCallback, useRef, useState } from 'react';

export type UseSpacePlannerCanvasReturn = {
    stageRef: React.RefObject<Konva.Stage | null>;
    scale: number;
    position: { x: number; y: number };
    selectedId: number | null;
    setSelectedId: (id: number | null) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    handleWheelZoom: (event: Konva.KonvaEventObject<WheelEvent>) => void;
};

const ZOOM_STEP = 1.15;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

export function useSpacePlannerCanvas(): UseSpacePlannerCanvasReturn {
    const stageRef = useRef<Konva.Stage | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const clampScale = useCallback((value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value)), []);

    const zoomIn = useCallback(() => setScale((current) => clampScale(current * ZOOM_STEP)), [clampScale]);
    const zoomOut = useCallback(() => setScale((current) => clampScale(current / ZOOM_STEP)), [clampScale]);

    const resetView = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const handleWheelZoom = useCallback(
        (event: Konva.KonvaEventObject<WheelEvent>) => {
            event.evt.preventDefault();

            const direction = event.evt.deltaY > 0 ? -1 : 1;

            setScale((current) => clampScale(direction > 0 ? current * ZOOM_STEP : current / ZOOM_STEP));
        },
        [clampScale],
    );

    return { stageRef, scale, position, selectedId, setSelectedId, zoomIn, zoomOut, resetView, handleWheelZoom };
}
