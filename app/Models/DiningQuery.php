<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiningQuery extends Model
{
    use HasFactory;

    protected $table = 'dining_queries';

    protected $fillable = [
        'name',
        'phone',
        'email',
        'guests',
        'message',
        'outlet_id',
        'status',
        'admin_notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'guests' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship to the assigned outlet (optional).
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'outlet_id');
    }

    /**
     * Scope a query to only include pending queries.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to search across fields.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        $term = '%' . trim($term) . '%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhere('phone', 'like', $term)
                ->orWhere('message', 'like', $term);
        });
    }
}
