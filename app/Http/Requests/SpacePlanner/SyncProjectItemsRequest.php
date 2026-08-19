<?php

namespace App\Http\Requests\SpacePlanner;

use App\Concerns\HexColorValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SyncProjectItemsRequest extends FormRequest
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
        $projectId = $this->route('project')->id;

        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => [
                'nullable',
                'integer',
                Rule::exists('project_items', 'id')->where('project_id', $projectId),
            ],
            'items.*.furniture_id' => ['required_without:items.*.id', 'integer', 'exists:furniture_catalog,id'],
            'items.*.x_coord' => ['required', 'numeric'],
            'items.*.y_coord' => ['required', 'numeric'],
            'items.*.rotation' => ['nullable', 'numeric', 'between:0,359.99'],
            'items.*.custom_color' => $this->hexColorRules(),
            'items.*.meta_data' => ['nullable', 'array'],
        ];
    }
}
