<?php

namespace App\Models;

use Database\Factories\ProjectItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
class ProjectItem extends Model
{
    /** @use HasFactory<ProjectItemFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<FurnitureCatalog, $this>
     */
    public function furniture(): BelongsTo
    {
        return $this->belongsTo(FurnitureCatalog::class, 'furniture_id');
    }

    /**
     * @return BelongsToMany<Reservation, $this>
     */
    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(Reservation::class, 'reservation_items');
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
