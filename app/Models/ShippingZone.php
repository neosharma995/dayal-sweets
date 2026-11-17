<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ShippingZone extends Model
{
    use HasFactory;

    protected $table = 'shipping_zones';

    protected $fillable = [
        'outlet_id',
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
            'outlet_id' => 'integer',
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
                $query = static::where('zone_slug', $slug);
                if ($zone->outlet_id) {
                    $query->where('outlet_id', $zone->outlet_id);
                }
                while ($query->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                    $query = static::where('zone_slug', $slug);
                    if ($zone->outlet_id) {
                        $query->where('outlet_id', $zone->outlet_id);
                    }
                }
                $zone->zone_slug = $slug;
            }
        });
    }

    /**
     * Relationship: Shipping Zone belongs to an Outlet.
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'outlet_id');
    }

    /**
     * Relationship: Shipping Zone has many shipping methods.
     */
    public function methods(): HasMany
    {
        return $this->hasMany(ShippingZoneMethod::class, 'shipping_zone_id')->orderBy('id');
    }
}
