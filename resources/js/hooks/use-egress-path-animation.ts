import Konva from 'konva';
import { useEffect, useRef } from 'react';

export type UseEgressPathAnimationReturn = {
    registerPath: (id: number) => (node: Konva.Arrow | null) => void;
};

const DASH_LENGTH = 12;
const DASH_SPEED_PX_PER_SECOND = 40;

export function useEgressPathAnimation(active: boolean): UseEgressPathAnimationReturn {
    const nodes = useRef(new Map<number, Konva.Arrow>());
    const animation = useRef<Konva.Animation | null>(null);

    useEffect(() => {
        if (!active) {
            animation.current?.stop();
            animation.current = null;

            return;
        }

        animation.current = new Konva.Animation((frame) => {
            if (!frame) {
                return;
            }

            const offset = (frame.time * DASH_SPEED_PX_PER_SECOND) / 1000;

            nodes.current.forEach((node) => {
                node.dashOffset(-offset % (DASH_LENGTH * 2));
            });
        });

        animation.current.start();

        return () => {
            animation.current?.stop();
            animation.current = null;
        };
    }, [active]);

    const registerPath = (id: number) => (node: Konva.Arrow | null) => {
        if (node) {
            nodes.current.set(id, node);
        } else {
            nodes.current.delete(id);
        }
    };

    return { registerPath };
}
