<?php

use App\Models\FurnitureCatalog;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\User;
use Illuminate\Support\Str;

function createTableWithChairs(Project $project, int $chairCount): array
{
    $groupId = (string) Str::uuid();

    $table = ProjectItem::factory()->for($project)->create([
        'furniture_id' => FurnitureCatalog::factory()->table()->create()->id,
        'group_id' => $groupId,
    ]);

    $chairs = ProjectItem::factory()->for($project)->count($chairCount)->create([
        'furniture_id' => FurnitureCatalog::factory()->chair()->create()->id,
        'group_id' => $groupId,
    ]);

    return [$table, $chairs];
}

test('reserving a table reserves every chair in its group', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    [$table, $chairs] = createTableWithChairs($project, 4);

    $response = $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $table->id,
        'customer_name' => 'Alice',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response->assertSessionHasNoErrors();

    $reservation = $project->reservations()->latest()->firstOrFail();
    expect($reservation->reserved_chairs_count)->toBe(4);
    expect($reservation->total_chairs_in_group)->toBe(4);
    expect($reservation->chairs()->count())->toBe(4);
});

test('reserving a single chair only reserves that chair even if it belongs to a group', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    [$table, $chairs] = createTableWithChairs($project, 4);

    $response = $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chairs->first()->id,
        'customer_name' => 'Bob',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response->assertSessionHasNoErrors();

    $reservation = $project->reservations()->latest()->firstOrFail();
    expect($reservation->reserved_chairs_count)->toBe(1);
    expect($reservation->total_chairs_in_group)->toBe(1);
});

test('partial-group reservation only claims currently available chairs', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    [$table, $chairs] = createTableWithChairs($project, 4);

    $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chairs->first()->id,
        'customer_name' => 'Pre-booked',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response = $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $table->id,
        'customer_name' => 'Alice',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response->assertSessionHasNoErrors();

    $reservation = $project->reservations()->where('customer_name', 'Alice')->firstOrFail();
    expect($reservation->total_chairs_in_group)->toBe(4);
    expect($reservation->reserved_chairs_count)->toBe(3);
    expect($reservation->chairs()->pluck('project_items.id'))->not->toContain($chairs->first()->id);
});

test('double reserving an already reserved chair fails', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $chair = ProjectItem::factory()->for($project)->create([
        'furniture_id' => FurnitureCatalog::factory()->chair()->create()->id,
    ]);

    $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chair->id,
        'customer_name' => 'Alice',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response = $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chair->id,
        'customer_name' => 'Bob',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response->assertSessionHasErrors('project_item_id');
});

test('cancelling a reservation frees the chair for a new reservation', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $chair = ProjectItem::factory()->for($project)->create([
        'furniture_id' => FurnitureCatalog::factory()->chair()->create()->id,
    ]);

    $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chair->id,
        'customer_name' => 'Alice',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $reservation = $project->reservations()->firstOrFail();

    $this->actingAs($user)->patch(route('reservations.update', [$project, $reservation]), [
        'status' => 'cancelled',
    ])->assertSessionHasNoErrors();

    $response = $this->actingAs($user)->post(route('reservations.store', $project), [
        'project_item_id' => $chair->id,
        'customer_name' => 'Bob',
        'reservation_time' => now()->addHour()->toDateTimeString(),
    ]);

    $response->assertSessionHasNoErrors();
    expect($project->reservations()->count())->toBe(2);
});
