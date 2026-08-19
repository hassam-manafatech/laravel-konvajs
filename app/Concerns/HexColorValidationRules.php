<?php

namespace App\Concerns;

trait HexColorValidationRules
{
    /**
     * Get the validation rules used to validate a hex color string.
     *
     * @return array<int, string>
     */
    protected function hexColorRules(bool $required = false): array
    {
        return [
            $required ? 'required' : 'nullable',
            'string',
            'regex:/^#[0-9A-Fa-f]{6}$/',
        ];
    }
}
