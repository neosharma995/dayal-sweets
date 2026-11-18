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
        $perPage = (int) $request->input('per_page', 15);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 15;
        }

        // Staff only: exclude users whose ONLY role is customer
        $query = User::with('roles')->whereHas('roles', function ($q) {
            $q->where('name', '!=', UserRole::Customer->value);
        });

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== 'all') {
            $query->role($roleFilter);
        }

        $users = $query->orderByDesc('id')->paginate($perPage)->withQueryString();

        // Transform to include primary role badge
        $users->through(function (User $user) {
            $primaryRole = $user->roles->where('name', '!=', UserRole::Customer->value)->first()
                ?? $user->roles->first();
            $roleName = $primaryRole?->name ?? 'staff';

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleName,
                'created_at' => $user->created_at?->format('d M Y, h:i a') ?? '—',
            ];
        });

        $availableRoles = Role::all()->map(fn (Role $r) => [
            'value' => $r->name,
            'label' => match ($r->name) {
                UserRole::Admin->value => 'Administrator',
                UserRole::Editor->value => 'Content Editor',
                UserRole::Customer->value => 'Demote to Customer (Revoke Staff)',
                default => ucfirst(str_replace('_', ' ', $r->name)),
            },
            'color' => match ($r->name) {
                UserRole::Admin->value => '#B88E4B',
                UserRole::Editor->value => '#2563EB',
                UserRole::Customer->value => '#DC2626',
                default => '#6B7280',
            },
        ]);

        $stats = [
            'total_staff' => User::whereHas('roles', fn ($q) => $q->where('name', '!=', UserRole::Customer->value))->count(),
            'admins' => User::role(UserRole::Admin->value)->count(),
            'editors' => User::role(UserRole::Editor->value)->count(),
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
            'role' => ['required', 'string', Rule::notIn([UserRole::Customer->value])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $role = Role::firstOrCreate(['name' => $validated['role'], 'guard_name' => 'web']);
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
        $validated = $request->validate([
            'role' => ['required', 'string'],
        ]);

        $newRole = $validated['role'];

        // Safety Guard: logged-in admin cannot demote themselves
        if ($request->user() && $request->user()->id === $user->id && $newRole !== UserRole::Admin->value) {
            return redirect()->back()->with('error', 'You cannot change or demote your own administrator role.');
        }

        // Ensure Spatie role exists
        Role::firstOrCreate(['name' => $newRole, 'guard_name' => 'web']);

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
        // Safety guard: cannot delete yourself
        if ($request->user() && $request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own staff account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Staff member '{$name}' has been deleted.");
    }
}
