<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Outlet extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'outlets';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'subtitle',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'phone_raw',
        'whatsapp',
        'whatsapp_raw',
        'email',
        'timings',
        'image',
        'map_url',
        'status',
        'is_active',
        'is_coming_soon',
        'expected_opening',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_coming_soon' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Additional attributes to append to array/JSON forms.
     *
     * @var list<string>
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Outlet $outlet) {
            if (empty($outlet->slug) && ! empty($outlet->name)) {
                $outlet->slug = Str::slug($outlet->name);
            }

            // Sync boolean flags with status string
            if ($outlet->status === 'coming_soon') {
                $outlet->is_coming_soon = true;
            } elseif ($outlet->status === 'inactive') {
                $outlet->is_active = false;
                $outlet->is_coming_soon = false;
            } elseif ($outlet->status === 'active') {
                $outlet->is_active = true;
                $outlet->is_coming_soon = false;
            }

            // Auto clean raw phone and whatsapp numbers if missing
            if (! empty($outlet->phone) && empty($outlet->phone_raw)) {
                $outlet->phone_raw = preg_replace('/[^0-9+]/', '', $outlet->phone);
            }
            if (! empty($outlet->whatsapp) && empty($outlet->whatsapp_raw)) {
                $outlet->whatsapp_raw = preg_replace('/[^0-9]/', '', $outlet->whatsapp);
            }
        });
    }

    /**
     * Scope to retrieve only active outlets.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('status', '!=', 'inactive');
    }

    /**
     * Scope to retrieve coming soon outlets.
     */
    public function scopeComingSoon(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->where('is_coming_soon', true)
              ->orWhere('status', 'coming_soon');
        });
    }

    /**
     * Accessor for full image URL.
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                $image = $this->image;

                if (! empty($image)) {
                    if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
                        return $image;
                    }

                    if (str_starts_with($image, '/')) {
                        if (file_exists(public_path(ltrim($image, '/')))) {
                            return $image;
                        }
                    }

                    if (Storage::disk('public')->exists($image)) {
                        return Storage::disk('public')->url($image);
                    }

                    if (file_exists(public_path('storage/' . ltrim($image, '/')))) {
                        return '/storage/' . ltrim($image, '/');
                    }

                    if (file_exists(public_path(ltrim($image, '/')))) {
                        return '/' . ltrim($image, '/');
                    }
                }

                // Fallback to public images by slug/name if missing or not found in storage
                $slug = Str::slug($this->slug ?: $this->name);

                $uploadCandidates = [
                    'amb' => '/uploads/2026/08/Amb-Outlet.png',
                    'hamirpur' => '/uploads/2026/08/Hamirpur-Outlet.png',
                    'una' => '/uploads/2026/08/Nangal-Road-Una-Outlet.png',
                    'una-bus-stand' => '/uploads/2026/07/About-Outlet.png',
                    'palampur' => '/uploads/2026/09/palampoor-stor.png',
                ];

                if (isset($uploadCandidates[$slug]) && file_exists(public_path(ltrim($uploadCandidates[$slug], '/')))) {
                    return $uploadCandidates[$slug];
                }

                $contactCandidates = [
                    'amb' => '/images/contact/outlet-amb.jpg',
                    'hamirpur' => '/images/contact/outlet-hamirpur.jpg',
                    'una' => '/images/contact/outlet-una.jpg',
                    'una-bus-stand' => '/images/contact/outlet-una-bus-stand.jpg',
                    'palampur' => '/images/contact/outlet-palampur.jpg',
                ];

                if (isset($contactCandidates[$slug]) && file_exists(public_path(ltrim($contactCandidates[$slug], '/')))) {
                    return $contactCandidates[$slug];
                }

                return ! empty($image) ? (str_starts_with($image, '/') ? $image : '/' . ltrim($image, '/')) : null;
            }
        );
    }

    /**
     * Relationship: Outlet offers many Products.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'outlet_products', 'outlet_id', 'product_id')
            ->withPivot(['is_available', 'stock_qty'])
            ->withTimestamps();
    }

    /**
     * Relationship: Outlet has many Shipping Zones.
     */
    public function shippingZones(): HasMany
    {
        return $this->hasMany(ShippingZone::class, 'outlet_id')->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Relationship: Outlet has many Orders.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'outlet_id')->latest('id');
    }

    /**
     * Relationship: Outlet has many Dining Tables.
     */
    public function tables(): HasMany
    {
        return $this->hasMany(OutletTable::class, 'outlet_id')->orderBy('sort_order')->orderBy('id');
    }
}
