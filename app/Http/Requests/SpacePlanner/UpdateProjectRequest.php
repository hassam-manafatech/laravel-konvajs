<?php

namespace App\Http\Requests\SpacePlanner;

use App\Concerns\HexColorValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    use HexColorValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'width_m' => ['sometimes', 'numeric', 'min:1', 'max:200'],
            'height_m' => ['sometimes', 'numeric', 'min:1', 'max:200'],
            'brand_color' => ['sometimes', ...$this->hexColorRules(required: true)],
            'show_blueprint_grid' => ['sometimes', 'boolean'],
        ];
    }
}
