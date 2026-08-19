<?php

use App\Enums\ReservationStatus;
use App\Models\SpacePlannerFurnitureCatalog;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;
use App\Models\SpacePlannerReservation;
use App\Models\User;
use Illuminate\Support\Str;

test('linking assigns a shared group id to a table and its chairs', function () {
    $user = User::factory()->create();
    $project = SpacePlannerProject::factory()->for($user)->create();
    $table = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => SpacePlannerFurnitureCatalog::factory()->table()->create()->id,
        'group_id' => null,
    ]);
    $chair1 = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => SpacePlannerFurnitureCatalog::factory()->chair()->create()->id,
        'group_id' => null,
    ]);
    $chair2 = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => SpacePlannerFurnitureCatalog::factory()->chair()->create()->id,
        'group_id' => null,
    ]);

    $response = $this->actingAs($user)->postJson(route('project-items.link', $project), [
        'table_item_id' => $table->id,
        'chair_item_ids' => [$chair1->id, $chair2->id],
    ]);

    $response->assertOk();

    $table->refresh();
    $chair1->refresh();
    $chair2->refresh();

    expect($table->group_id)->not->toBeNull();
    expect($chair1->group_id)->toBe($table->group_id);
    expect($chair2->group_id)->toBe($table->group_id);
});

test('unlinking clears the shared group id', function () {
    $user = User::factory()->create();
    $project = SpacePlannerProject::factory()->for($user)->create();
    $groupId = (string) Str::uuid();
    $chair = SpacePlannerProjectItem::factory()->for($project, 'project')->create(['group_id' => $groupId]);

    $response = $this->actingAs($user)->postJson(route('project-items.unlink', $project), [
        'item_ids' => [$chair->id],
    ]);

    $response->assertOk();
    expect($chair->fresh()->group_id)->toBeNull();
});

test('unlinking a chair with an active reservation is rejected', function () {
    $user = User::factory()->create();
    $project = SpacePlannerProject::factory()->for($user)->create();
    $groupId = (string) Str::uuid();
    $table = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => SpacePlannerFurnitureCatalog::factory()->table()->create()->id,
        'group_id' => $groupId,
    ]);
    $chair = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => SpacePlannerFurnitureCatalog::factory()->chair()->create()->id,
        'group_id' => $groupId,
    ]);

    $reservation = SpacePlannerReservation::factory()->for($project, 'project')->create([
        'table_item_id' => $table->id,
        'group_id' => $groupId,
        'status' => ReservationStatus::Confirmed,
    ]);
    $reservation->chairs()->attach($chair->id);

    $response = $this->actingAs($user)->postJson(route('project-items.unlink', $project), [
        'item_ids' => [$chair->id],
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('item_ids');
    expect($chair->fresh()->group_id)->toBe($groupId);
});
