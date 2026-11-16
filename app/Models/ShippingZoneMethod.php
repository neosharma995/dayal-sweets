<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingZoneMethod extends Model
{
    use HasFactory;

    protected $table = 'shipping_zone_methods';

    protected $fillable = [
        'shipping_zone_id',
        'method_type',
        'title',
        'cost',
        'tax_status',
        'min_order_amount',
        'requirements',
        'is_enabled',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'shipping_zone_id' => 'integer',
            'cost' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'requirements' => 'array',
            'is_enabled' => 'boolean',
        ];
    }

    /**
     * Relationship: Shipping method belongs to a Shipping Zone.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(ShippingZone::class, 'shipping_zone_id');
    }
}
