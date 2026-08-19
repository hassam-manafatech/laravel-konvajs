import { Form, Head } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/SpacePlanner/ProjectController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/projects';
import type { Template } from '@/types';

type CreateProps = {
    templates?: Template[];
};

export default function Create({ templates }: CreateProps) {
    return (
        <>
            <Head title="New project" />

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">New project</h1>

                <Form {...ProjectController.store.form()} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="template_id">Template</Label>
                                <select
                                    id="template_id"
                                    name="template_id"
                                    defaultValue=""
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                                >
                                    <option value="">Blank canvas</option>
                                    {(templates ?? []).map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.template_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Project name</Label>
                                <Input id="name" name="name" required placeholder="Downtown Café" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="width_m">Width (m)</Label>
                                    <Input id="width_m" name="width_m" type="number" min={1} max={200} step={0.5} placeholder="10" />
                                    <InputError message={errors.width_m} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="height_m">Height (m)</Label>
                                    <Input id="height_m" name="height_m" type="number" min={1} max={200} step={0.5} placeholder="10" />
                                    <InputError message={errors.height_m} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="brand_color">Brand color</Label>
                                <Input id="brand_color" name="brand_color" type="color" defaultValue="#2563eb" className="h-10 w-24 p-1" />
                                <InputError message={errors.brand_color} />
                            </div>

                            <Button disabled={processing}>Create project</Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Space Planner', href: index() },
        { title: 'New project', href: index() },
    ],
};
