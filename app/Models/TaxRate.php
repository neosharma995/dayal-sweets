<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxRate extends Model
{
    use HasFactory;

    protected $table = 'tax_rates';

    protected $fillable = [
        'name',
        'code',
        'rate',
        'type',
        'tax_class',
        'description',
        'is_active',
        'is_compound',
        'apply_to_shipping',
        'priority',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rate' => 'decimal:2',
            'is_active' => 'boolean',
            'is_compound' => 'boolean',
            'apply_to_shipping' => 'boolean',
            'priority' => 'integer',
        ];
    }

    /**
     * Relationship: Tax Rate has many Products.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'tax_rate_id');
    }

    /**
     * Calculate tax amount for a given base price.
     */
    public function calculateTax(float|int|string $amount): float
    {
        $amount = (float) $amount;
        if ($this->type === 'fixed') {
            return (float) $this->rate;
        }

        return round($amount * ((float) $this->rate / 100), 2);
    }
}
