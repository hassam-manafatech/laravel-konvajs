import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { create, index, show } from '@/routes/projects';
import type { Project } from '@/types';

type IndexProps = {
    projects: Project[];
};

export default function Index({ projects }: IndexProps) {
    return (
        <>
            <Head title="Space Planner" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Space Planner</h1>
                    <Button asChild>
                        <Link href={create()}>New project</Link>
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No layouts yet. Create your first project to start designing.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Link key={project.id} href={show(project.id)}>
                                <Card className="transition-colors hover:border-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span
                                                className="size-3 rounded-full"
                                                style={{ backgroundColor: project.brand_color }}
                                                aria-hidden
                                            />
                                            {project.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        {project.width_m}m × {project.height_m}m · {project.total_seats} seats
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Space Planner', href: index() }],
};
