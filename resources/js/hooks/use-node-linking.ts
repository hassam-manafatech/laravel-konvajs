import { useCallback, useState } from 'react';
import { isTableItem } from '@/lib/space-planner-groups';
import type { ProjectItem } from '@/types';

export type LinkToolState = 'idle' | 'selecting-anchor' | 'selecting-members';

export type UseNodeLinkingReturn = {
    linkToolState: LinkToolState;
    anchorItemId: number | null;
    pendingMemberIds: number[];
    toggleLinkTool: () => void;
    handleItemClick: (item: ProjectItem) => void;
    confirmLink: () => Promise<void>;
    cancel: () => void;
};

export function useNodeLinking(onConfirm: (tableItemId: number, chairItemIds: number[]) => Promise<void>): UseNodeLinkingReturn {
    const [linkToolState, setLinkToolState] = useState<LinkToolState>('idle');
    const [anchorItemId, setAnchorItemId] = useState<number | null>(null);
    const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([]);

    const cancel = useCallback(() => {
        setLinkToolState('idle');
        setAnchorItemId(null);
        setPendingMemberIds([]);
    }, []);

    const toggleLinkTool = useCallback(() => {
        setLinkToolState((current) => {
            if (current === 'idle') {
                setAnchorItemId(null);
                setPendingMemberIds([]);

                return 'selecting-anchor';
            }

            setAnchorItemId(null);
            setPendingMemberIds([]);

            return 'idle';
        });
    }, []);

    const handleItemClick = useCallback(
        (item: ProjectItem) => {
            if (linkToolState === 'selecting-anchor') {
                if (!isTableItem(item)) {
                    return;
                }

                setAnchorItemId(item.id);
                setPendingMemberIds([]);
                setLinkToolState('selecting-members');

                return;
            }

            if (linkToolState === 'selecting-members') {
                if (isTableItem(item)) {
                    return;
                }

                setPendingMemberIds((current) =>
                    current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
                );
            }
        },
        [linkToolState],
    );

    const confirmLink = useCallback(async () => {
        if (anchorItemId === null || pendingMemberIds.length === 0) {
            return;
        }

        await onConfirm(anchorItemId, pendingMemberIds);

        setAnchorItemId(null);
        setPendingMemberIds([]);
        setLinkToolState('selecting-anchor');
    }, [anchorItemId, pendingMemberIds, onConfirm]);

    return { linkToolState, anchorItemId, pendingMemberIds, toggleLinkTool, handleItemClick, confirmLink, cancel };
}
