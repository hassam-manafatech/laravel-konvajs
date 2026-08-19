<?php

namespace App\Models;

use App\Enums\FurnitureCategory;
use Database\Factories\FurnitureCatalogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property FurnitureCategory $category
 * @property string $width_m
 * @property string $depth_m
 * @property string $height_m
 * @property string $price
 * @property int $seat_capacity
 * @property string $default_color
 * @property array<string, mixed>|null $render_metadata
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('space_planner_furniture_catalog')]
#[Fillable(['name', 'category', 'width_m', 'depth_m', 'height_m', 'price', 'seat_capacity', 'default_color', 'render_metadata'])]
class SpacePlannerFurnitureCatalog extends Model
{
    /** @use HasFactory<FurnitureCatalogFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return FurnitureCatalogFactory::new();
    }

    /**
     * @return HasMany<SpacePlannerProjectItem, $this>
     */
    public function projectItems(): HasMany
    {
        return $this->hasMany(SpacePlannerProjectItem::class, 'furniture_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => FurnitureCategory::class,
            'render_metadata' => 'array',
        ];
    }
}
