<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'apartment',
        'city',
        'state',
        'pincode',
        'shipping_method_title',
        'shipping_cost',
        'subtotal',
        'tax_amount',
        'total_amount',
        'currency',
        'payment_method',
        'payment_status',
        'delivery_status',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'order_notes',
        'paid_at',
        'shipped_at',
        'delivered_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'shipping_cost' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            if (empty($order->order_number)) {
                $order->order_number = 'DS-' . date('Ymd') . '-' . strtoupper(Str::random(5));
            }
        });
    }

    /**
     * Relationship: Order belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Order has many Order Items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    /**
     * Scope: Filter by delivery status.
     */
    public function scopeDeliveryStatus($query, string $status)
    {
        return $query->where('delivery_status', $status);
    }

    /**
     * Scope: Filter by payment status.
     */
    public function scopePaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }
}
