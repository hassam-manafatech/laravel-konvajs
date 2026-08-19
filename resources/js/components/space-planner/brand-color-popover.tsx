import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type BrandColorPopoverProps = {
    color: string;
    onChange: (color: string) => void;
};

export function BrandColorPopover({ color, onChange }: BrandColorPopoverProps) {
    const [draftColor, setDraftColor] = useState(color);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <span className="size-4 rounded-full border" style={{ backgroundColor: color }} aria-hidden />
                    Brand color
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 space-y-2">
                <Label htmlFor="brand-color-input">Brand color</Label>
                <input
                    id="brand-color-input"
                    type="color"
                    value={draftColor}
                    onChange={(event) => {
                        setDraftColor(event.target.value);
                        onChange(event.target.value);
                    }}
                    className="h-10 w-full cursor-pointer rounded-md border border-input"
                />
            </PopoverContent>
        </Popover>
    );
}
