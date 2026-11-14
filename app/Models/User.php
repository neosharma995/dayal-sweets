<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin->value);
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(UserRole::Customer->value);
    }

    public function dashboardRoute(): string
    {
        return $this->isAdmin()
            ? UserRole::Admin->dashboardRoute()
            : UserRole::Customer->dashboardRoute();
    }

    public function accountRoute(): string
    {
        return $this->isAdmin()
            ? UserRole::Admin->accountRoute()
            : UserRole::Customer->accountRoute();
    }

    /**
     * Update the user's profile information and reset verification if email changed.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function updateProfile(array $attributes): void
    {
        $this->fill($attributes);

        if ($this->isDirty('email')) {
            $this->email_verified_at = null;
        }

        $this->save();
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(string $password): void
    {
        $this->update([
            'password' => Hash::make($password),
        ]);
    }
}
