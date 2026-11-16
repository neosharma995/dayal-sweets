<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductTag extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_tags';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'product_tag_name',
        'product_tag_slug',
        'product_tag_description',
        'product_tag_image',
    ];

    /**
     * Additional attributes to append to array/JSON forms.
     *
     * @var list<string>
     */
    protected $appends = [
        'product_tag_image_url',
        'name',
        'slug',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (ProductTag $tag) {
            if (empty($tag->product_tag_slug) && ! empty($tag->product_tag_name)) {
                $tag->product_tag_slug = Str::slug($tag->product_tag_name);
            }
        });
    }

    /**
     * Relationship: Tag has many Products (direct foreign key).
     */
    public function directProducts(): HasMany
    {
        return $this->hasMany(Product::class, 'product_tag_id');
    }

    /**
     * Relationship: Tag belongs to many Products (via pivot table).
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_tag_relations', 'product_tag_id', 'product_id');
    }

    /**
     * Standard name and slug accessors.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->product_tag_name,
            set: fn (?string $value) => ['product_tag_name' => $value]
        );
    }

    protected function slug(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => $this->product_tag_slug,
            set: fn (?string $value) => ['product_tag_slug' => $value]
        );
    }

    /**
     * Accessor for tag image URL.
     */
    protected function productTagImageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                if (! $this->product_tag_image) {
                    return null;
                }

                if (str_starts_with($this->product_tag_image, 'http://') || str_starts_with($this->product_tag_image, 'https://')) {
                    return $this->product_tag_image;
                }

                return Storage::disk('public')->url($this->product_tag_image);
            }
        );
    }
}
