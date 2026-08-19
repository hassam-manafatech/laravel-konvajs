import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { FurnitureCatalogItem, ProjectItem } from '@/types';

type CostEstimatorSheetProps = {
    items: ProjectItem[];
    furnitureCatalog: FurnitureCatalogItem[] | undefined;
    totalCost: number;
};

export function CostEstimatorSheet({ items, furnitureCatalog, totalCost }: CostEstimatorSheetProps) {
    const lineItems = useMemo(() => {
        const catalogById = new Map((furnitureCatalog ?? []).map((entry) => [entry.id, entry]));
        const counts = new Map<number, { furniture: FurnitureCatalogItem; count: number }>();

        items.forEach((item) => {
            const furniture = item.furniture ?? catalogById.get(item.furniture_id);

            if (!furniture) {
                return;
            }

            const existing = counts.get(furniture.id);
            counts.set(furniture.id, { furniture, count: (existing?.count ?? 0) + 1 });
        });

        return Array.from(counts.values());
    }, [items, furnitureCatalog]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Cost estimate
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cost estimate</SheetTitle>
                    <SheetDescription>Rough furniture and fixture totals for the current layout.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 px-4">
                    {lineItems.map(({ furniture, count }) => (
                        <div key={furniture.id} className="flex items-center justify-between text-sm">
                            <span>
                                {furniture.name} × {count}
                            </span>
                            <span className="text-muted-foreground">
                                ${(parseFloat(furniture.price) * count).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    {lineItems.length === 0 && <p className="text-sm text-muted-foreground">No furniture placed yet.</p>}

                    <Separator />

                    <div className="flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
