<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class OutletTable extends Model
{
    use HasFactory;

    protected $table = 'outlet_tables';

    protected $fillable = [
        'outlet_id',
        'table_number',
        'name',
        'capacity',
        'location',
        'qr_token',
        'status',
        'is_active',
        'notes',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'outlet_id' => 'integer',
            'capacity' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected $appends = [
        'scanner_url',
        'scanner_path',
    ];

    protected static function booted(): void
    {
        static::creating(function (OutletTable $table): void {
            if (empty($table->qr_token)) {
                $table->qr_token = self::generateUniqueToken($table->outlet_id, $table->table_number);
            }
            if (empty($table->name) && ! empty($table->table_number)) {
                $table->name = 'Table ' . $table->table_number;
            }
            if ($table->status === 'inactive') {
                $table->is_active = false;
            }
        });

        static::updating(function (OutletTable $table): void {
            if ($table->isDirty('status')) {
                $table->is_active = $table->status !== 'inactive';
            }
        });
    }

    /**
     * Generate a clean, URL-safe unique QR token for the table.
     */
    public static function generateUniqueToken(int|string|null $outletId, ?string $tableNumber = null): string
    {
        $prefix = 'tbl-' . ($outletId ?: 'ds') . '-' . Str::slug((string) ($tableNumber ?: 't'));
        do {
            $token = $prefix . '-' . strtolower(Str::random(6));
        } while (self::where('qr_token', $token)->exists());

        return $token;
    }

    /**
     * Accessor for relative scanner path.
     */
    protected function scannerPath(): Attribute
    {
        return Attribute::make(
            get: fn (): string => '/scan/' . $this->qr_token
        );
    }

    /**
     * Accessor for full scanner URL.
     */
    protected function scannerUrl(): Attribute
    {
        return Attribute::make(
            get: fn (): string => url('/scan/' . $this->qr_token)
        );
    }

    /**
     * Relationship: Table belongs to an Outlet.
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'outlet_id');
    }

    /**
     * Relationship: Table has many Dine-In Orders.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'outlet_table_id')->latest('id');
    }
}
