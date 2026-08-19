import type { SpacePlannerViewMode } from '@/hooks/use-space-planner-view-mode';
import { cn } from '@/lib/utils';

type SpacePlannerCanvasSplitProps = {
    viewMode: SpacePlannerViewMode;
    floorPlan: React.ReactNode;
    perspective: React.ReactNode;
};

export function SpacePlannerCanvasSplit({ viewMode, floorPlan, perspective }: SpacePlannerCanvasSplitProps) {
    return (
        <div
            className={cn(
                'grid h-full min-h-0 flex-1 gap-4 transition-[grid-template-columns] duration-500 ease-in-out',
                viewMode === '2d' && 'grid-cols-[1fr_0fr]',
                viewMode === '3d' && 'grid-cols-[0fr_1fr]',
                viewMode === 'split' && 'grid-cols-[1fr_1fr]',
            )}
        >
            <div className={cn('min-h-0 min-w-0 overflow-hidden', viewMode === '3d' && 'pointer-events-none opacity-0')}>{floorPlan}</div>
            <div className={cn('min-h-0 min-w-0 overflow-hidden', viewMode === '2d' && 'pointer-events-none opacity-0')}>{perspective}</div>
        </div>
    );
}
