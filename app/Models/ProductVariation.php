<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariation extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_variations';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'attribute_value_id',
        'variation_name',
        'price',
        'selling_price',
        'product_qty',
        'weight_value',
        'weight_unit',
        'sku',
        'is_default',
    ];

    /**
     * Default model attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'product_qty' => 1,
        'weight_unit' => 'g',
        'is_default' => false,
    ];

    /**
     * Additional attributes to append to array/JSON forms.
     *
     * @var list<string>
     */
    protected $appends = [
        'discount_percentage',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'product_id' => 'integer',
            'price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'product_qty' => 'integer',
            'weight_value' => 'decimal:2',
            'is_default' => 'boolean',
        ];
    }

    /**
     * Relationship: Variation belongs to a Product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Relationship: Variation optionally belongs to an Attribute Value.
     */
    public function attributeValue(): BelongsTo
    {
        return $this->belongsTo(ProductAttributeValue::class, 'attribute_value_id');
    }

    /**
     * Accessor for discount percentage.
     */
    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function (): int {
                $regular = (float) $this->price;
                $selling = (float) $this->selling_price;

                if ($regular > 0 && $regular > $selling) {
                    return (int) round((($regular - $selling) / $regular) * 100);
                }

                return 0;
            }
        );
    }
}
