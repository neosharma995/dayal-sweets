<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'seasonal_mithai_id',
        'occasion_id',
        'diet_preference_id',
        'product_tag_id',
        'tax_rate_id',
        'tax_status',
        'product_name',
        'product_description',
        'product_price',
        'product_selling_price',
        'product_qty',
        'product_image',
        'product_gallaries',
        'product_details',
        'rating',
        'rating_count',
    ];

    /**
     * Default model attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'product_qty' => 1,
        'tax_status' => 'taxable',
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
        'tax_amount',
        'price_with_tax',
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
            'seasonal_mithai_id' => 'integer',
            'occasion_id' => 'integer',
            'diet_preference_id' => 'integer',
            'product_tag_id' => 'integer',
            'tax_rate_id' => 'integer',
            'tax_status' => 'string',
            'product_price' => 'decimal:2',
            'product_selling_price' => 'decimal:2',
            'product_qty' => 'integer',
            'product_gallaries' => 'array',
            'product_details' => 'array',
            'rating' => 'decimal:2',
            'rating_count' => 'integer',
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
     * Relationship: Product belongs to many Categories (via pivot).
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id')
            ->withTimestamps();
    }

    /**
     * Relationship: Product belongs to a Seasonal Mithai category.
     */
    public function seasonalMithai(): BelongsTo
    {
        return $this->belongsTo(SeasonalMithai::class, 'seasonal_mithai_id');
    }

    /**
     * Relationship: Product belongs to many Seasonal Mithai categories (via pivot).
     */
    public function seasonalMithais(): BelongsToMany
    {
        return $this->belongsToMany(SeasonalMithai::class, 'product_seasonal_mithai', 'product_id', 'seasonal_mithai_id')
            ->withTimestamps();
    }

    /**
     * Relationship: Product belongs to an Occasion category.
     */
    public function occasion(): BelongsTo
    {
        return $this->belongsTo(Occasion::class, 'occasion_id');
    }

    /**
     * Relationship: Product belongs to many Occasions (via pivot).
     */
    public function occasions(): BelongsToMany
    {
        return $this->belongsToMany(Occasion::class, 'occasion_product', 'product_id', 'occasion_id')
            ->withTimestamps();
    }

    /**
     * Relationship: Product belongs to a Diet Preference category.
     */
    public function dietPreference(): BelongsTo
    {
        return $this->belongsTo(DietPreference::class, 'diet_preference_id');
    }

    /**
     * Relationship: Product belongs to many Diet Preferences (via pivot).
     */
    public function dietPreferences(): BelongsToMany
    {
        return $this->belongsToMany(DietPreference::class, 'diet_preference_product', 'product_id', 'diet_preference_id')
            ->withTimestamps();
    }

    /**
     * Relationship: Product belongs to a primary Product Tag.
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(ProductTag::class, 'product_tag_id');
    }

    /**
     * Relationship: Product belongs to many Product Tags (via pivot).
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(ProductTag::class, 'product_tag_relations', 'product_id', 'product_tag_id');
    }

    /**
     * Relationship: Product is available at many Outlets.
     */
    public function outlets(): BelongsToMany
    {
        return $this->belongsToMany(Outlet::class, 'outlet_products', 'product_id', 'outlet_id')
            ->withPivot(['is_available', 'stock_qty'])
            ->withTimestamps();
    }

    /**
     * Relationship: Product belongs to a Tax Rate.
     */
    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class, 'tax_rate_id');
    }

    /**
     * Accessor for calculated tax amount based on product selling price and tax rate.
     */
    protected function taxAmount(): Attribute
    {
        return Attribute::make(
            get: function (): float {
                if ($this->tax_status !== 'taxable' || ! $this->tax_rate_id) {
                    return 0.0;
                }

                $taxRate = $this->relationLoaded('taxRate') ? $this->taxRate : $this->taxRate()->first();
                if (! $taxRate) {
                    return 0.0;
                }

                $basePrice = (float) ($this->product_selling_price ?? $this->product_price ?? 0);

                return $taxRate->calculateTax($basePrice);
            }
        );
    }

    /**
     * Accessor for final price including tax.
     */
    protected function priceWithTax(): Attribute
    {
        return Attribute::make(
            get: function (): float {
                $basePrice = (float) ($this->product_selling_price ?? $this->product_price ?? 0);

                if ($this->tax_status !== 'taxable' || ! $this->tax_rate_id) {
                    return round($basePrice, 2);
                }

                $taxRate = $this->relationLoaded('taxRate') ? $this->taxRate : $this->taxRate()->first();
                if (! $taxRate) {
                    return round($basePrice, 2);
                }

                return round($basePrice + $taxRate->calculateTax($basePrice), 2);
            }
        );
    }

    /**
     * Relationship: Product has many Variations (weights/pack sizes).
     */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class, 'product_id')->orderBy('price');
    }

    /**
     * Relationship: Product has many Reviews.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class, 'product_id')->latest();
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
