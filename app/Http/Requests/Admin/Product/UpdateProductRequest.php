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

        if (is_string($this->input('variations'))) {
            $decoded = json_decode($this->input('variations'), true);
            if (is_array($decoded)) {
                $mergeData['variations'] = $decoded;
            }
        }

        foreach (['tag_ids', 'outlet_ids', 'category_ids', 'seasonal_mithai_ids', 'occasion_ids', 'diet_preference_ids'] as $arrayField) {
            if (is_string($this->input($arrayField))) {
                $decoded = json_decode($this->input($arrayField), true);
                if (is_array($decoded)) {
                    $mergeData[$arrayField] = $decoded;
                }
            }
        }

        foreach (['category_id', 'seasonal_mithai_id', 'occasion_id', 'diet_preference_id', 'product_tag_id', 'tax_rate_id'] as $idField) {
            if ($this->has($idField) && ($this->input($idField) === '' || $this->input($idField) === 'null')) {
                $mergeData[$idField] = null;
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
            'category_id' => ['nullable', 'integer', 'exists:product_categories,id'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:product_categories,id'],
            'seasonal_mithai_id' => ['nullable', 'integer', 'exists:product_seasonal_mithais,id'],
            'seasonal_mithai_ids' => ['nullable', 'array'],
            'seasonal_mithai_ids.*' => ['integer', 'exists:product_seasonal_mithais,id'],
            'occasion_id' => ['nullable', 'integer', 'exists:product_occasions,id'],
            'occasion_ids' => ['nullable', 'array'],
            'occasion_ids.*' => ['integer', 'exists:product_occasions,id'],
            'diet_preference_id' => ['nullable', 'integer', 'exists:product_diet_preferences,id'],
            'diet_preference_ids' => ['nullable', 'array'],
            'diet_preference_ids.*' => ['integer', 'exists:product_diet_preferences,id'],
            'product_tag_id' => ['nullable', 'integer', 'exists:product_tags,id'],
            'tax_rate_id' => ['nullable', 'integer', 'exists:tax_rates,id'],
            'tax_status' => ['nullable', 'string', 'in:taxable,none,shipping'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:product_tags,id'],
            'outlet_ids' => ['nullable', 'array'],
            'outlet_ids.*' => ['integer', 'exists:outlets,id'],
            'product_name' => ['sometimes', 'required', 'string', 'max:255'],
            'product_description' => ['nullable', 'string'],
            'product_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'product_selling_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'product_qty' => ['sometimes', 'required', 'integer', 'min:0'],
            'product_image' => ['nullable'],
            'product_gallaries' => ['nullable', 'array'],
            'product_details' => ['nullable', 'array'],
            'variations' => ['nullable', 'array'],
            'variations.*.id' => ['nullable'],
            'variations.*.attribute_value_id' => ['nullable', 'integer', 'exists:product_attribute_values,id'],
            'variations.*.variation_name' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.price' => ['required_with:variations', 'numeric', 'min:0'],
            'variations.*.selling_price' => ['required_with:variations', 'numeric', 'min:0'],
            'variations.*.product_qty' => ['nullable', 'integer', 'min:0'],
            'variations.*.weight_value' => ['nullable', 'numeric'],
            'variations.*.weight_unit' => ['nullable', 'string', 'max:20'],
            'variations.*.sku' => ['nullable', 'string', 'max:100'],
            'variations.*.is_default' => ['nullable', 'boolean'],
        ];
    }
}
