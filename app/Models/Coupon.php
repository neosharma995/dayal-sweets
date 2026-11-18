<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $table = 'coupons';

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_discount_amount',
        'is_global',
        'outlet_id',
        'starts_at',
        'expires_at',
        'usage_limit',
        'usage_limit_per_user',
        'used_count',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'float',
        'min_order_amount' => 'float',
        'max_discount_amount' => 'float',
        'is_global' => 'boolean',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'used_count' => 'integer',
    ];

    /**
     * Primary outlet relation (if single outlet assigned).
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'outlet_id');
    }

    /**
     * Multiple outlets relation via pivot table.
     */
    public function outlets(): BelongsToMany
    {
        return $this->belongsToMany(Outlet::class, 'coupon_outlets', 'coupon_id', 'outlet_id')
            ->withTimestamps();
    }

    /**
     * Coupon usages.
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class, 'coupon_id');
    }

    /**
     * Scope for active coupons.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            });
    }

    /**
     * Scope for coupons applicable to a given outlet (or global).
     */
    public function scopeForOutlet(Builder $query, ?int $outletId = null): Builder
    {
        if ($outletId === null) {
            return $query->where('is_global', true);
        }

        return $query->where(function ($q) use ($outletId) {
            $q->where('is_global', true)
                ->orWhere('outlet_id', $outletId)
                ->orWhereHas('outlets', function ($sub) use ($outletId) {
                    $sub->where('outlets.id', $outletId);
                });
        });
    }

    /**
     * Check if coupon is valid for a specific outlet.
     */
    public function isValidForOutlet(?int $outletId = null): bool
    {
        if ($this->is_global) {
            return true;
        }

        if ($outletId === null) {
            return false;
        }

        if ($this->outlet_id === $outletId) {
            return true;
        }

        if ($this->relationLoaded('outlets')) {
            return $this->outlets->contains('id', $outletId);
        }

        return $this->outlets()->where('outlets.id', $outletId)->exists();
    }

    /**
     * Validate whether this coupon can be applied.
     * Returns array ['valid' => bool, 'message' => string].
     */
    public function validateForCart(float $subtotal, ?int $outletId = null, ?int $userId = null, ?string $email = null): array
    {
        if (! $this->is_active) {
            return ['valid' => false, 'message' => 'This coupon is currently inactive.'];
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return ['valid' => false, 'message' => 'This coupon has not started yet.'];
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return ['valid' => false, 'message' => 'This coupon has expired.'];
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return ['valid' => false, 'message' => 'This coupon has reached its total usage limit.'];
        }

        if (! $this->isValidForOutlet($outletId)) {
            $outletName = $this->outlet?->name;
            if (! $outletName && $this->outlets()->count() > 0) {
                $outletName = $this->outlets()->pluck('name')->join(', ');
            }
            $target = $outletName ? "only valid for {$outletName}" : 'not valid for the selected outlet';
            return ['valid' => false, 'message' => "This coupon is {$target}."];
        }

        if ($this->min_order_amount !== null && $subtotal < $this->min_order_amount) {
            return [
                'valid' => false,
                'message' => "Minimum order amount of ₹" . number_format($this->min_order_amount, 2) . " required for this coupon.",
            ];
        }

        if ($this->usage_limit_per_user !== null) {
            $userUsageQuery = $this->usages();
            if ($userId) {
                $userUsageQuery->where('user_id', $userId);
            } elseif ($email) {
                $userUsageQuery->where('customer_email', strtolower(trim($email)));
            }

            if (($userId || $email) && $userUsageQuery->count() >= $this->usage_limit_per_user) {
                return [
                    'valid' => false,
                    'message' => "You have already used this coupon the maximum allowed times.",
                ];
            }
        }

        return ['valid' => true, 'message' => 'Coupon applied successfully!'];
    }

    /**
     * Calculate discount amount on a given subtotal.
     */
    public function calculateDiscount(float $subtotal): float
    {
        if ($this->discount_type === 'percentage') {
            $discount = ($subtotal * $this->discount_value) / 100;
            if ($this->max_discount_amount !== null && $this->max_discount_amount > 0) {
                $discount = min($discount, $this->max_discount_amount);
            }
        } else {
            $discount = min($this->discount_value, $subtotal);
        }

        return round(max(0, $discount), 2);
    }
}
