<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Product;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $mergeData = [];

        // Support product_galleries alias if sent instead of product_gallaries
        if (! $this->has('product_gallaries') && $this->has('product_galleries')) {
            $mergeData['product_gallaries'] = $this->input('product_galleries');
        }

        // Parse JSON strings to array if sent via multipart form
        if (is_string($this->input('product_gallaries'))) {
            $decoded = json_decode($this->input('product_gallaries'), true);
            if (is_array($decoded)) {
                $mergeData['product_gallaries'] = $decoded;
            }
        }

        if (is_string($this->input('product_details'))) {
            $decoded = json_decode($this->input('product_details'), true);
            if (is_array($decoded)) {
                $mergeData['product_details'] = $decoded;
            }
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_name' => ['sometimes', 'required', 'string', 'max:255'],
            'product_description' => ['nullable', 'string'],
            'product_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'product_selling_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'product_qty' => ['sometimes', 'required', 'integer', 'min:0'],
            'product_image' => ['nullable'],
            'product_gallaries' => ['nullable', 'array'],
            'product_details' => ['nullable', 'array'],
        ];
    }
}
