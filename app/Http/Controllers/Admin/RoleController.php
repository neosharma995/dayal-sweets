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
        // Ensure Spatie permissions cache is fresh
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = Role::with('permissions')
            ->withCount('users')
            ->get()
            ->map(function (Role $role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'users_count' => $role->users_count,
                    'is_system' => in_array($role->name, [UserRole::Admin->value, UserRole::Customer->value, UserRole::Editor->value], true),
                    'permissions' => $role->permissions->pluck('name')->all(),
                    'created_at' => $role->created_at?->format('d M Y') ?? '—',
                ];
            });

        // Group all available administrative permissions for clear UI selection
        $groupedPermissions = [
            'Orders & Sales' => [
                ['name' => UserPermission::ManageOrders->value, 'label' => 'Orders & Deliveries', 'description' => 'View customer orders, update tracking status, and process deliveries.'],
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
                ['name' => UserPermission::ManageOutlets->value, 'label' => 'Outlets & Delivery Zones', 'description' => 'Manage physical store outlets, addresses, and delivery shipping zones.'],
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
                ['name' => UserPermission::ManagePages->value, 'label' => 'Public Website Pages', 'description' => 'Edit content sections for About Us, Contact Us, and Photo Gallery.'],
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
            return redirect()->back()->with('error', "System role '{$role->name}' is protected and cannot be deleted.");
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
