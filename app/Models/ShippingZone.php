<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ShippingZone extends Model
{
    use HasFactory;

    protected $table = 'shipping_zones';

    protected $fillable = [
        'zone_name',
        'zone_slug',
        'zone_regions',
        'zone_postcodes',
        'description',
        'is_active',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'zone_regions' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (ShippingZone $zone): void {
            if (empty($zone->zone_slug)) {
                $baseSlug = Str::slug($zone->zone_name);
                $slug = $baseSlug;
                $counter = 1;
                while (static::where('zone_slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }
                $zone->zone_slug = $slug;
            }
        });
    }

    /**
     * Relationship: Shipping Zone has many shipping methods.
     */
    public function methods(): HasMany
    {
        return $this->hasMany(ShippingZoneMethod::class, 'shipping_zone_id')->orderBy('id');
    }
}
