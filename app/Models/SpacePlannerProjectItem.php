<?php

namespace App\Models;

use Database\Factories\ProjectItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property int $furniture_id
 * @property string|null $group_id
 * @property string $x_coord
 * @property string $y_coord
 * @property float $rotation
 * @property string|null $custom_color
 * @property array<string, mixed>|null $meta_data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['furniture_id', 'group_id', 'x_coord', 'y_coord', 'rotation', 'custom_color', 'meta_data'])]
class SpacePlannerProjectItem extends Model
{
    /** @use HasFactory<ProjectItemFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return ProjectItemFactory::new();
    }

    /**
     * @return BelongsTo<SpacePlannerProject, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerProject::class, 'project_id');
    }

    /**
     * @return BelongsTo<SpacePlannerFurnitureCatalog, $this>
     */
    public function furniture(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerFurnitureCatalog::class, 'furniture_id');
    }

    /**
     * @return BelongsToMany<SpacePlannerReservation, $this>
     */
    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(
            SpacePlannerReservation::class,
            'space_planner_reservation_items',
            'project_item_id',
            'reservation_id',
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meta_data' => 'array',
            'rotation' => 'float',
        ];
    }
}
