<?php

namespace App\Models;

use App\Enums\TemplateType;
use Database\Factories\TemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property TemplateType $type
 * @property string $default_width_m
 * @property string $default_height_m
 * @property string|null $thumbnail_url
 * @property array<string, mixed>|null $layout_data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'type', 'default_width_m', 'default_height_m', 'thumbnail_url', 'layout_data'])]
class SpacePlannerTemplate extends Model
{
    /** @use HasFactory<TemplateFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return TemplateFactory::new();
    }

    /**
     * @return HasMany<SpacePlannerProject, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(SpacePlannerProject::class, 'template_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => TemplateType::class,
            'layout_data' => 'array',
        ];
    }
}
