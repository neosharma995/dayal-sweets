<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of staff members (excludes regular customers).
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $roleFilter = trim((string) $request->input('role', 'all'));
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $excludedRoles = [UserRole::Admin->value, UserRole::Customer->value];

        // Staff only: exclude Administrator and Customer users
        $query = User::with('roles')
            ->whereHas('roles', function ($q) use ($excludedRoles) {
                $q->whereNotIn('name', $excludedRoles);
            })
            ->whereDoesntHave('roles', function ($q) {
                $q->where('name', UserRole::Admin->value);
            });

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== 'all' && ! in_array($roleFilter, $excludedRoles, true)) {
            $query->role($roleFilter);
        } else {
            $roleFilter = 'all';
        }

        $users = $query->orderByDesc('id')->paginate($perPage)->withQueryString();

        // Transform to include primary role badge
        $users->through(function (User $user) use ($excludedRoles) {
            $primaryRole = $user->roles->whereNotIn('name', $excludedRoles)->first()
                ?? $user->roles->first();
            $roleName = $primaryRole?->name ?? 'staff';

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleName,
                'is_locked' => $user->hasRole(UserRole::Admin->value),
                'created_at' => $user->created_at?->format('d M Y, h:i a') ?? '—',
            ];
        });

        // Only assignable staff roles (exclude admin and customer)
        $availableRoles = Role::whereNotIn('name', $excludedRoles)
            ->orderBy('id')
            ->get()
            ->map(fn (Role $r) => [
                'value' => $r->name,
                'label' => match ($r->name) {
                    UserRole::Editor->value => 'Content Editor',
                    default => ucfirst(str_replace('_', ' ', $r->name)),
                },
                'color' => match ($r->name) {
                    UserRole::Editor->value => '#2563EB',
                    default => '#6B7280',
                },
            ])
            ->values();

        $totalStaff = User::whereHas('roles', fn ($q) => $q->whereNotIn('name', $excludedRoles))
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', UserRole::Admin->value))
            ->count();
        $editorsCount = User::role(UserRole::Editor->value)
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', UserRole::Admin->value))
            ->count();

        $stats = [
            'total_staff' => $totalStaff,
            'editors' => $editorsCount,
            'other_staff' => max(0, $totalStaff - $editorsCount),
            'total_customers' => User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Customer->value))->count(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'users' => $users,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $availableRoles,
            'stats' => $stats,
            'currentAdminId' => $request->user()?->id,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created staff member with email, password, and assigned role.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name', Rule::notIn([UserRole::Admin->value, UserRole::Customer->value])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $role = Role::where('name', $validated['role'])->where('guard_name', 'web')->firstOrFail();
        $user->assignRole($role);

        $readableRole = match ($validated['role']) {
            UserRole::Admin->value => 'Administrator',
            UserRole::Editor->value => 'Content Editor',
            default => ucfirst(str_replace('_', ' ', $validated['role'])),
        };

        return redirect()->back()->with(
            'success',
            "New staff member '{$user->name}' created successfully with role '{$readableRole}'."
        );
    }

    /**
     * Update a user's role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        // Permanently locked: no one can modify or demote an Administrator account
        if ($user->hasRole(UserRole::Admin->value)) {
            abort(403, 'Administrator accounts are permanently locked and cannot be modified.');
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'exists:roles,name', Rule::notIn([UserRole::Admin->value, UserRole::Customer->value])],
        ]);

        $newRole = $validated['role'];

        // Safety Guard: logged-in staff cannot demote themselves
        if ($request->user() && $request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot change or demote your own role.');
        }

        Role::where('name', $newRole)->where('guard_name', 'web')->firstOrFail();

        $user->syncRoles([$newRole]);

        $readableRole = match ($newRole) {
            UserRole::Admin->value => 'Administrator',
            UserRole::Editor->value => 'Content Editor',
            UserRole::Customer->value => 'Customer (Staff Revoked)',
            default => ucfirst(str_replace('_', ' ', $newRole)),
        };

        return redirect()->back()->with('success', "Role for '{$user->name}' updated to '{$readableRole}'.");
    }

    /**
     * Delete a staff member.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Permanently locked: no one can delete an Administrator account
        if ($user->hasRole(UserRole::Admin->value)) {
            abort(403, 'Administrator accounts are permanently locked and cannot be deleted.');
        }

        // Safety guard: cannot delete yourself
        if ($request->user() && $request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own staff account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Staff member '{$name}' has been deleted.");
    }
}
