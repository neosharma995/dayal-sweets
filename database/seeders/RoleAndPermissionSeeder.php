<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserPermission;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create permissions
        foreach (UserPermission::values() as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        // 2. Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => UserRole::Admin->value, 'guard_name' => 'web']);
        $adminRole->syncPermissions(UserPermission::adminPermissions());

        $editorRole = Role::firstOrCreate(['name' => UserRole::Editor->value, 'guard_name' => 'web']);
        $editorRole->syncPermissions(UserPermission::editorPermissions());

        $customerRole = Role::firstOrCreate(['name' => UserRole::Customer->value, 'guard_name' => 'web']);
        $customerRole->syncPermissions(UserPermission::customerPermissions());

        // 3. Create default Admin user
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@dayalsweets.com'],
            [
                'name' => 'Dayal Sweets Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $adminUser->syncRoles([$adminRole]);

        // 4. Create default Editor user
        $editorUser = User::updateOrCreate(
            ['email' => 'editor@dayalsweets.com'],
            [
                'name' => 'Dayal Sweets Editor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $editorUser->syncRoles([$editorRole]);

        // 4. Create default Customer user
        $customerUser = User::updateOrCreate(
            ['email' => 'customer@dayalsweets.com'],
            [
                'name' => 'Rahul Sharma',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $customerUser->syncRoles([$customerRole]);
    }
}
