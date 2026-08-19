<?php

use App\Models\FurnitureCatalog;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\User;

test('a user cannot view, update, or delete another user\'s project', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $project = Project::factory()->for($owner)->create();

    $this->actingAs($intruder)->get(route('projects.show', $project))->assertForbidden();
    $this->actingAs($intruder)->patch(route('projects.update', $project), ['name' => 'Hacked'])->assertForbidden();
    $this->actingAs($intruder)->delete(route('projects.destroy', $project))->assertForbidden();
});

test('a user cannot touch another user\'s nested project resources', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $project = Project::factory()->for($owner)->create();
    $item = ProjectItem::factory()->for($project)->create();
    $furniture = FurnitureCatalog::factory()->create();

    $this->actingAs($intruder)
        ->postJson(route('project-items.sync', $project), [
            'items' => [['furniture_id' => $furniture->id, 'x_coord' => 1, 'y_coord' => 1]],
        ])
        ->assertForbidden();

    $this->actingAs($intruder)
        ->deleteJson(route('project-items.destroy', [$project, $item]))
        ->assertForbidden();

    $this->actingAs($intruder)
        ->patch(route('fire-safety.toggle', $project))
        ->assertForbidden();
});
