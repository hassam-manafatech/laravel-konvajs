import { Head } from '@inertiajs/react';
import { SpacePlannerWorkspace } from '@/components/space-planner/space-planner-workspace';
import { index } from '@/routes/projects';
import type { FurnitureCatalogItem, Project } from '@/types';

type ShowProps = {
    project: Project;
    furnitureCatalog?: FurnitureCatalogItem[];
};

export default function Show({ project, furnitureCatalog }: ShowProps) {
    return (
        <>
            <Head title={project.name} />
            <SpacePlannerWorkspace project={project} furnitureCatalog={furnitureCatalog} />
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Space Planner', href: index() },
    ],
};
