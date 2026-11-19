<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserPermission;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleController extends Controller
{
    /**
     * Display a listing of all roles and their permissions.
     */
    public function index(Request $request): Response|JsonResponse
    {
        // Ensure Spatie permissions cache is fresh and all enum permissions exist
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (UserPermission::values() as $permName) {
            Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
        }

        // Ensure Admin always has all admin permissions assigned, and Customer has no admin permissions
        $adminRole = Role::where('name', UserRole::Admin->value)->first();
        if ($adminRole) {
            $adminRole->syncPermissions(UserPermission::adminPermissions());
        }

        $customerRole = Role::where('name', UserRole::Customer->value)->first();
        if ($customerRole && $customerRole->permissions()->count() > 0) {
            $customerRole->syncPermissions([]);
        }

        $editorRole = Role::where('name', UserRole::Editor->value)->first();
        if ($editorRole && ! $editorRole->hasPermissionTo(UserPermission::ManageSeo->value)) {
            $editorRole->givePermissionTo(UserPermission::ManageSeo->value);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = Role::with('permissions')
            ->withCount('users')
            ->orderBy('id')
            ->get()
            ->sortBy(function (Role $role) {
                $priority = match ($role->name) {
                    UserRole::Admin->value => 0,
                    UserRole::Customer->value => 1,
                    default => 2,
                };

                return [$priority, $role->id];
            })
            ->values()
            ->map(function (Role $role) {
                $isLocked = in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value], true);

                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'users_count' => $role->users_count,
                    'is_system' => in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value, UserRole::Editor->value], true),
                    'is_locked' => $isLocked,
                    'permissions' => $role->permissions->pluck('name')->all(),
                    'created_at' => $role->created_at?->format('d M Y') ?? '—',
                ];
            });

        // Group all available administrative permissions for clear UI selection
        $groupedPermissions = [
            'Orders & Sales' => [
                ['name' => UserPermission::ManageOrders->value, 'label' => 'Orders & Deliveries', 'description' => 'View customer orders, update tracking status, and process deliveries.'],
                ['name' => UserPermission::ManageAnalytics->value, 'label' => 'Sales Analytics', 'description' => 'View website & dine-in sales analytics, outlet revenue breakdowns, and top-selling products.'],
            ],
            'Products & Catalog' => [
                ['name' => UserPermission::ManageProducts->value, 'label' => 'Products & Inventory', 'description' => 'Add, edit products, manage variations, categories, tags, and stock.'],
            ],
            'Customers & Shoppers' => [
                ['name' => UserPermission::ManageCustomers->value, 'label' => 'Registered Customers', 'description' => 'View registered customers directory, order history, and spending data.'],
            ],
            'Discounts & Promotions' => [
                ['name' => UserPermission::ManageCoupons->value, 'label' => 'Discount Coupons', 'description' => 'Create, edit, toggle coupons, generate bulk coupon batches, and outlet rules.'],
            ],
            'Outlets & Logistics' => [
                ['name' => UserPermission::ManageOutlets->value, 'label' => 'Outlets & Delivery Zones', 'description' => 'Manage physical store outlets, addresses, dining tables, QR scanners, and delivery shipping zones.'],
            ],
            'Taxes & Accounting' => [
                ['name' => UserPermission::ManageTaxes->value, 'label' => 'Taxes & GST Rates', 'description' => 'Configure standard GST rates, CGST/SGST, and tax classes.'],
            ],
            'Queries & Inquiries' => [
                ['name' => UserPermission::ManageQueries->value, 'label' => 'Contact & Dining Queries', 'description' => 'Review customer contact messages and table reservation requests.'],
            ],
            'Staff & Access Control' => [
                ['name' => UserPermission::ManageStaff->value, 'label' => 'Staff Team Members', 'description' => 'Create staff accounts, set passwords, and assign administrative roles.'],
                ['name' => UserPermission::ManageRoles->value, 'label' => 'Roles & Permissions', 'description' => 'Create custom roles and configure granular system permissions.'],
            ],
            'Website Pages & Content' => [
                ['name' => UserPermission::ManagePages->value, 'label' => 'Public Website Pages', 'description' => 'Edit content sections for Home, Shop, About Us, Contact Us, Photo Gallery, Gifting, Dining, Franchise, Testimonials, and Policies.'],
                ['name' => UserPermission::ManageSeo->value, 'label' => 'Pages SEO Information', 'description' => 'Configure Meta Title, Meta Description, Meta Keywords, Canonical URLs, Open Graph tags, and Robots indexing for all website pages.'],
                ['name' => UserPermission::ManageHeaderFooter->value, 'label' => 'Header & Footer Branding', 'description' => 'Customize site logo, top announcement bar, store contact details, and footer.'],
            ],
            'Store Administration' => [
                ['name' => UserPermission::ManageStoreSettings->value, 'label' => 'Store & Account Settings', 'description' => 'Access store configuration and administrative profile settings.'],
            ],
        ];

        $allPermissions = Permission::pluck('name')->all();

        if ($request->wantsJson()) {
            return response()->json([
                'roles' => $roles,
                'groupedPermissions' => $groupedPermissions,
                'allPermissions' => $allPermissions,
            ]);
        }

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'groupedPermissions' => $groupedPermissions,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Store a newly created custom role with permissions.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9_\-\s]+$/',
                Rule::unique('roles', 'name'),
            ],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        $roleName = strtolower(trim(str_replace(' ', '-', $validated['name'])));

        $role = Role::create([
            'name' => $roleName,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($validated['permissions']);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->back()->with('success', "Role '{$role->name}' created successfully with " . count($validated['permissions']) . " permissions.");
    }

    /**
     * Update an existing role's permissions and name.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        if (in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value], true)) {
            abort(403, "Role '{$role->name}' is locked and cannot be modified.");
        }

        $isSystem = in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value, UserRole::Editor->value], true);

        $rules = [
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['exists:permissions,name'],
        ];

        if (! $isSystem) {
            $rules['name'] = [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9_\-\s]+$/',
                Rule::unique('roles', 'name')->ignore($role->id),
            ];
        }

        $validated = $request->validate($rules);

        if (! $isSystem && isset($validated['name'])) {
            $role->name = strtolower(trim(str_replace(' ', '-', $validated['name'])));
            $role->save();
        }

        $role->syncPermissions($validated['permissions']);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->back()->with('success', "Permissions for role '{$role->name}' updated successfully.");
    }

    /**
     * Delete a custom role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value, UserRole::Editor->value], true)) {
            abort(403, "System role '{$role->name}' is protected and cannot be deleted.");
        }

        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', "Cannot delete role '{$role->name}' because it currently has {$role->users()->count()} assigned user(s). Reassign them first.");
        }

        $name = $role->name;
        $role->delete();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return redirect()->back()->with('success', "Role '{$name}' deleted successfully.");
    }
}
