import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { deleteJson, postJson, SpacePlannerApiError } from '@/lib/space-planner-api';
import { destroy as destroyItemRoute, link as linkRoute, sync as syncRoute, unlink as unlinkRoute } from '@/routes/project-items';
import type { FurnitureCatalogItem, Project, ProjectItem, SyncProjectItemInput } from '@/types';

export type UseSpacePlannerItemsReturn = {
    items: ProjectItem[];
    moveItem: (id: number, xCoord: number, yCoord: number, rotation?: number) => void;
    addItem: (furniture: FurnitureCatalogItem, xCoord: number, yCoord: number) => void;
    recolorItem: (id: number, color: string) => void;
    deleteItem: (id: number) => Promise<void>;
    linkGroup: (tableItemId: number, chairItemIds: number[]) => Promise<void>;
    unlinkGroup: (itemIds: number[]) => Promise<void>;
    isSyncing: boolean;
};

const DRAG_DEBOUNCE_MS = 450;
const COLOR_DEBOUNCE_MS = 300;

let nextTempId = -1;

export function useSpacePlannerItems(project: Project): UseSpacePlannerItemsReturn {
    const [items, setItems] = useState<ProjectItem[]>(project.items ?? []);
    const [isSyncing, setIsSyncing] = useState(false);

    const dirtyIds = useRef(new Set<number>());
    const pendingById = useRef(new Map<number, SyncProjectItemInput>());
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const incoming = project.items ?? [];

        setItems((current) => {
            const currentById = new Map(current.map((item) => [item.id, item]));
            const merged = incoming.map((item) =>
                dirtyIds.current.has(item.id) ? (currentById.get(item.id) ?? item) : item,
            );
            const stillOptimisticOnly = current.filter((item) => item.id < 0);

            return [...merged, ...stillOptimisticOnly];
        });
         
    }, [project.items]);

    const flushPending = useCallback(async () => {
        const inputs = Array.from(pendingById.current.values());
        pendingById.current.clear();

        if (inputs.length === 0) {
            return;
        }

        setIsSyncing(true);

        try {
            const response = await postJson<{ items: ProjectItem[] }>(syncRoute.url(project.id), {
                items: inputs,
            });

            inputs.forEach((input) => {
                if (input.id) {
                    dirtyIds.current.delete(input.id);
                }
            });

            setItems(response.items);
        } finally {
            setIsSyncing(false);
        }
    }, [project.id]);

    const scheduleFlush = useCallback(
        (debounceMs: number) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                debounceTimer.current = null;
                void flushPending();
            }, debounceMs);
        },
        [flushPending],
    );

    const moveItem = useCallback(
        (id: number, xCoord: number, yCoord: number, rotation?: number) => {
            dirtyIds.current.add(id);

            setItems((current) =>
                current.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              x_coord: String(xCoord),
                              y_coord: String(yCoord),
                              rotation: rotation ?? item.rotation,
                          }
                        : item,
                ),
            );

            pendingById.current.set(id, { id, x_coord: xCoord, y_coord: yCoord, rotation });
            scheduleFlush(DRAG_DEBOUNCE_MS);
        },
        [scheduleFlush],
    );

    const recolorItem = useCallback(
        (id: number, color: string) => {
            dirtyIds.current.add(id);

            setItems((current) => {
                const next = current.map((item) => (item.id === id ? { ...item, custom_color: color } : item));
                const item = next.find((candidate) => candidate.id === id);

                if (item) {
                    pendingById.current.set(id, {
                        id,
                        x_coord: parseFloat(item.x_coord),
                        y_coord: parseFloat(item.y_coord),
                        rotation: item.rotation,
                        custom_color: color,
                    });
                }

                return next;
            });

            scheduleFlush(COLOR_DEBOUNCE_MS);
        },
        [scheduleFlush],
    );

    const addItem = useCallback(
        async (furniture: FurnitureCatalogItem, xCoord: number, yCoord: number) => {
            const tempId = nextTempId--;

            const optimisticItem: ProjectItem = {
                id: tempId,
                project_id: project.id,
                furniture_id: furniture.id,
                group_id: null,
                x_coord: String(xCoord),
                y_coord: String(yCoord),
                rotation: 0,
                custom_color: null,
                meta_data: null,
                created_at: null,
                updated_at: null,
                furniture,
            };

            setItems((current) => [...current, optimisticItem]);
            setIsSyncing(true);

            try {
                const response = await postJson<{ items: ProjectItem[] }>(syncRoute.url(project.id), {
                    items: [{ furniture_id: furniture.id, x_coord: xCoord, y_coord: yCoord, rotation: 0 }],
                });

                setItems(response.items);
            } catch {
                setItems((current) => current.filter((item) => item.id !== tempId));
            } finally {
                setIsSyncing(false);
            }
        },
        [project.id],
    );

    const deleteItem = useCallback(
        async (id: number) => {
            let removed: ProjectItem | undefined;

            setItems((current) => {
                removed = current.find((item) => item.id === id);

                return current.filter((item) => item.id !== id);
            });

            if (id < 0) {
                return;
            }

            try {
                await deleteJson(destroyItemRoute.url({ project: project.id, item: id }));
            } catch (error) {
                setItems((current) => (removed ? [...current, removed] : current));

                const message =
                    error instanceof SpacePlannerApiError
                        ? (error.payload?.errors?.item?.[0] ?? error.message)
                        : 'Failed to delete item.';

                toast.error(message);
            }
        },
        [project.id],
    );

    const linkGroup = useCallback(
        async (tableItemId: number, chairItemIds: number[]) => {
            const response = await postJson<{ items: ProjectItem[] }>(linkRoute.url(project.id), {
                table_item_id: tableItemId,
                chair_item_ids: chairItemIds,
            });

            setItems(response.items);
        },
        [project.id],
    );

    const unlinkGroup = useCallback(
        async (itemIds: number[]) => {
            const response = await postJson<{ items: ProjectItem[] }>(unlinkRoute.url(project.id), {
                item_ids: itemIds,
            });

            setItems(response.items);
        },
        [project.id],
    );

    return { items, moveItem, addItem, recolorItem, deleteItem, linkGroup, unlinkGroup, isSyncing };
}
