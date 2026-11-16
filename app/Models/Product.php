<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'product_name',
        'product_description',
        'product_price',
        'product_selling_price',
        'product_qty',
        'product_image',
        'product_gallaries',
        'product_details',
    ];

    /**
     * Default model attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'product_qty' => 1,
        'product_gallaries' => '[]',
        'product_details' => '[]',
    ];

    /**
     * Additional attributes to append to array/JSON forms.
     *
     * @var list<string>
     */
    protected $appends = [
        'product_image_url',
        'product_gallaries_urls',
        'min_price',
        'max_price',
        'total_stock',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'product_price' => 'decimal:2',
            'product_selling_price' => 'decimal:2',
            'product_qty' => 'integer',
            'product_gallaries' => 'array',
            'product_details' => 'array',
        ];
    }

    /**
     * Relationship: Product belongs to a Category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relationship: Product has many Variations (weights/pack sizes).
     */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class, 'product_id')->orderBy('price');
    }

    /**
     * Accessor for minimum selling price among variations (falls back to base product selling price).
     */
    protected function minPrice(): Attribute
    {
        return Attribute::make(
            get: function (): ?float {
                $vars = $this->relationLoaded('variations') ? $this->variations : $this->variations()->get();
                if ($vars->isNotEmpty()) {
                    return (float) $vars->min('selling_price');
                }

                $basePrice = $this->product_selling_price ?? $this->product_price;

                return $basePrice !== null ? (float) $basePrice : null;
            }
        );
    }

    /**
     * Accessor for maximum selling price among variations (falls back to base product price).
     */
    protected function maxPrice(): Attribute
    {
        return Attribute::make(
            get: function (): ?float {
                $vars = $this->relationLoaded('variations') ? $this->variations : $this->variations()->get();
                if ($vars->isNotEmpty()) {
                    return (float) $vars->max('selling_price');
                }

                $basePrice = $this->product_price ?? $this->product_selling_price;

                return $basePrice !== null ? (float) $basePrice : null;
            }
        );
    }

    /**
     * Accessor for total inventory stock across all variations (falls back to base product qty).
     */
    protected function totalStock(): Attribute
    {
        return Attribute::make(
            get: function (): int {
                $vars = $this->relationLoaded('variations') ? $this->variations : $this->variations()->get();
                if ($vars->isNotEmpty()) {
                    return (int) $vars->sum('product_qty');
                }

                return (int) ($this->product_qty ?? 0);
            }
        );
    }

    /**
     * Accessor for full product image URL.
     */
    protected function productImageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if (! $this->product_image) {
                    return null;
                }

                if (str_starts_with($this->product_image, 'http://') || str_starts_with($this->product_image, 'https://')) {
                    return $this->product_image;
                }

                return Storage::disk('public')->url($this->product_image);
            }
        );
    }

    /**
     * Accessor for full product galleries URLs.
     */
    protected function productGallariesUrls(): Attribute
    {
        return Attribute::make(
            get: function (): array {
                $gallaries = $this->product_gallaries;

                if (empty($gallaries) || ! is_array($gallaries)) {
                    return [];
                }

                return array_map(function ($item) {
                    if (is_string($item) && (str_starts_with($item, 'http://') || str_starts_with($item, 'https://'))) {
                        return $item;
                    }

                    return is_string($item) ? Storage::disk('public')->url($item) : $item;
                }, $gallaries);
            }
        );
    }

    /**
     * Alias accessor/mutator for product_galleries (handles both spellings seamlessly).
     */
    protected function productGalleries(): Attribute
    {
        return Attribute::make(
            get: fn (): ?array => $this->product_gallaries,
            set: fn ($value) => ['product_gallaries' => is_array($value) ? json_encode($value) : $value]
        );
    }
}
