<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_categories';

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
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        // Auto-generate slug from name if not provided
        static::saving(function (Category $category) {
            if (empty($category->category_slug) && ! empty($category->category_name)) {
                $category->category_slug = Str::slug($category->category_name);
            }
        });
    }

    /**
     * Relationship: Category has many Products.
     * E.g. A category contains 10 products.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    /**
     * Accessor for full category image URL.
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
