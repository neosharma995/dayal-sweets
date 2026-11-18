<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class CustomerController extends Controller
{
    /**
     * Display a listing of registered customers (storefront users).
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $dateFilter = trim((string) $request->input('date', 'all'));
        $ordersFilter = trim((string) $request->input('orders', 'all'));
        $perPage = (int) $request->input('per_page', 15);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 15;
        }

        // Query customers: users with role 'customer' or without any staff role
        $query = User::with('roles')
            ->withCount('orders')
            ->withSum('orders', 'total_amount')
            ->where(function ($q) {
                $q->whereHas('roles', fn ($r) => $r->where('name', UserRole::Customer->value))
                    ->orWhereDoesntHave('roles');
            });

        // Search by name, email, or id
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('id', $search);
            });
        }

        // Date range filter
        if ($dateFilter === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($dateFilter === 'this_week') {
            $query->where('created_at', '>=', Carbon::now()->startOfWeek());
        } elseif ($dateFilter === 'this_month') {
            $query->where('created_at', '>=', Carbon::now()->startOfMonth());
        }

        // Orders filter
        if ($ordersFilter === 'with_orders') {
            $query->has('orders');
        } elseif ($ordersFilter === 'no_orders') {
            $query->doesntHave('orders');
        }

        // Latest registered users first
        $customers = $query->orderByDesc('id')->paginate($perPage)->withQueryString();

        $customers->through(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_verified' => $user->hasVerifiedEmail(),
                'orders_count' => $user->orders_count ?? 0,
                'orders_sum_total_amount' => (float) ($user->orders_sum_total_amount ?? 0),
                'created_at' => $user->created_at?->format('d M Y, h:i a') ?? '—',
                'created_at_human' => $user->created_at?->diffForHumans() ?? '—',
            ];
        });

        // Customer Metrics
        $totalCustomers = User::where(function ($q) {
            $q->whereHas('roles', fn ($r) => $r->where('name', UserRole::Customer->value))
                ->orWhereDoesntHave('roles');
        })->count();

        $newThisWeek = User::where(function ($q) {
            $q->whereHas('roles', fn ($r) => $r->where('name', UserRole::Customer->value))
                ->orWhereDoesntHave('roles');
        })->where('created_at', '>=', Carbon::now()->startOfWeek())->count();

        $withOrdersCount = User::where(function ($q) {
            $q->whereHas('roles', fn ($r) => $r->where('name', UserRole::Customer->value))
                ->orWhereDoesntHave('roles');
        })->has('orders')->count();

        $staffRoles = Role::where('name', '!=', UserRole::Customer->value)
            ->get()
            ->map(fn (Role $r) => [
                'value' => $r->name,
                'label' => match ($r->name) {
                    UserRole::Admin->value => 'Administrator',
                    UserRole::Editor->value => 'Content Editor',
                    default => ucfirst(str_replace('_', ' ', $r->name)),
                },
            ]);

        $stats = [
            'total_customers' => $totalCustomers,
            'new_this_week' => $newThisWeek,
            'with_orders' => $withOrdersCount,
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'customers' => $customers,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'stats' => $stats,
            'staffRoles' => $staffRoles,
            'filters' => [
                'search' => $search,
                'date' => $dateFilter,
                'orders' => $ordersFilter,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Search customers for autocomplete (e.g. promoting to staff).
     */
    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));
        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $users = User::where(function ($q) {
            $q->whereHas('roles', fn ($r) => $r->where('name', UserRole::Customer->value))
                ->orWhereDoesntHave('roles');
        })
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->orderByDesc('id')
            ->limit(10)
            ->get(['id', 'name', 'email']);

        return response()->json(['results' => $users]);
    }

    /**
     * Promote a registered customer to staff.
     */
    public function promote(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::notIn([UserRole::Customer->value])],
        ]);

        $roleName = $validated['role'];
        Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        $user->syncRoles([$roleName]);

        $readableRole = match ($roleName) {
            UserRole::Admin->value => 'Administrator',
            UserRole::Editor->value => 'Content Editor',
            default => ucfirst(str_replace('_', ' ', $roleName)),
        };

        return redirect()->back()->with(
            'success',
            "Customer '{$user->name}' has been promoted to {$readableRole}. They now appear in Staff Management."
        );
    }
}
