<?php

namespace App\Http\Requests\SpacePlanner;

use App\Concerns\HexColorValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    use HexColorValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'template_id' => ['nullable', 'integer', 'exists:templates,id'],
            'name' => ['required', 'string', 'max:255'],
            'width_m' => ['required_without:template_id', 'numeric', 'min:1', 'max:200'],
            'height_m' => ['required_without:template_id', 'numeric', 'min:1', 'max:200'],
            'brand_color' => $this->hexColorRules(),
        ];
    }
}
