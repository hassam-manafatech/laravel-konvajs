<?php

namespace App\Http\Requests\SpacePlanner;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEgressPathRequest extends FormRequest
{
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
            'path_points' => ['required', 'array', 'min:2'],
            'path_points.*.x' => ['required', 'numeric'],
            'path_points.*.y' => ['required', 'numeric'],
            'door_label' => ['nullable', 'string', 'max:255'],
        ];
    }
}
