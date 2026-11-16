<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SeasonalMithai extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_seasonal_mithais';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_name',
        'category_slug',
        'category_image',
        'category_description',
    ];

    /**
     * Additional attributes to append to array/JSON forms.
     *
     * @var list<string>
     */
    protected $appends = [
        'category_image_url',
        'name',
        'slug',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (SeasonalMithai $item) {
            if (empty($item->category_slug) && ! empty($item->category_name)) {
                $item->category_slug = Str::slug($item->category_name);
            }
        });
    }

    /**
     * Relationship: Seasonal Mithai has many Products (just like Category).
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seasonal_mithai_id');
    }

    /**
     * Aliases for standard name and slug access.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->category_name,
            set: fn (?string $value) => ['category_name' => $value]
        );
    }

    protected function slug(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->category_slug,
            set: fn (?string $value) => ['category_slug' => $value]
        );
    }

    /**
     * Accessor for full image URL.
     */
    protected function categoryImageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if (! $this->category_image) {
                    return null;
                }

                if (str_starts_with($this->category_image, 'http://') || str_starts_with($this->category_image, 'https://')) {
                    return $this->category_image;
                }

                return Storage::disk('public')->url($this->category_image);
            }
        );
    }
}
