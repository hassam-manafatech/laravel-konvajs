import type CameraControlsImpl from 'camera-controls';
import { useCallback, useRef } from 'react';

export type UseCameraSwingReturn = {
    controlsRef: React.RefObject<CameraControlsImpl | null>;
    swingTo: (position: [number, number, number], target: [number, number, number]) => void;
    resetView: () => void;
};

const DEFAULT_POSITION: [number, number, number] = [8, 8, 8];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

export function useCameraSwing(): UseCameraSwingReturn {
    const controlsRef = useRef<CameraControlsImpl | null>(null);

    const swingTo = useCallback((position: [number, number, number], target: [number, number, number]) => {
        void controlsRef.current?.setLookAt(...position, ...target, true);
    }, []);

    const resetView = useCallback(() => {
        swingTo(DEFAULT_POSITION, DEFAULT_TARGET);
    }, [swingTo]);

    return { controlsRef, swingTo, resetView };
}
