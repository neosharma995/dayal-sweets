<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'rating',
        'content',
        'avatar',
        'avatar_bg',
        'status',
    ];

    /**
     * Get the user that authored the testimonial.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
