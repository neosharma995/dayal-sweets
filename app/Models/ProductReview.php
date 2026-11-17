<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductReview extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_reviews';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'rating',
        'review',
        'is_verified_purchase',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'product_id' => 'integer',
            'user_id' => 'integer',
            'order_id' => 'integer',
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
        ];
    }

    /**
     * Relationship: Review belongs to a Product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Relationship: Review belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relationship: Review belongs to an Order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Recalculate average rating and rating_count for a product.
     */
    public static function recalculateForProduct(int $productId): void
    {
        $stats = self::where('product_id', $productId)
            ->where('status', 'approved')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total_count')
            ->first();

        $avgRating = ($stats && $stats->avg_rating !== null) ? round((float) $stats->avg_rating, 2) : 5.00;
        $count = $stats ? (int) $stats->total_count : 0;

        Product::where('id', $productId)->update([
            'rating' => $avgRating,
            'rating_count' => $count,
        ]);
    }
}
