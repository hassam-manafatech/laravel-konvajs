import { Badge } from '@/components/ui/badge';
import type { UseSpacePlannerTotalsReturn } from '@/hooks/use-space-planner-totals';

type CapacityMeterProps = {
    totals: UseSpacePlannerTotalsReturn;
};

export function CapacityMeter({ totals }: CapacityMeterProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-sidebar-border/70 bg-card px-3 py-1.5 text-sm dark:border-sidebar-border">
            <Badge variant="secondary">{totals.totalSeats} seats</Badge>
            <span className="text-muted-foreground">{totals.seatsPerSqMeter.toFixed(2)} seats/m²</span>
        </div>
    );
}
