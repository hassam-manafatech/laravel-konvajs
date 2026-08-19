import { useCallback, useState } from 'react';

export type SpacePlannerViewMode = '2d' | '3d' | 'split';

export type UseSpacePlannerViewModeReturn = {
    viewMode: SpacePlannerViewMode;
    setViewMode: (mode: SpacePlannerViewMode) => void;
    cycleViewMode: () => void;
};

const ORDER: SpacePlannerViewMode[] = ['split', '2d', '3d'];

export function useSpacePlannerViewMode(initial: SpacePlannerViewMode = 'split'): UseSpacePlannerViewModeReturn {
    const [viewMode, setViewMode] = useState<SpacePlannerViewMode>(initial);

    const cycleViewMode = useCallback(() => {
        setViewMode((current) => ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]);
    }, []);

    return { viewMode, setViewMode, cycleViewMode };
}
