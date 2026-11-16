<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Account\UpdatePasswordRequest;
use App\Http\Requests\Account\UpdateProfileRequest;

class AccountController extends Controller
{
    /**
     * Display the Admin account and store configuration page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $storeInfo = [
            'store_name' => 'Dayal Sweets & Confectionery',
            'legal_entity' => 'Dayal Sweets Pvt. Ltd.',
            'gstin' => '07AAAAA0000A1Z5',
            'fssai_license' => '10019011000123',
            'support_email' => 'care@dayalsweets.com',
            'support_phone' => '+91 11 4567 8900',
            'flagship_store' => 'Main Market, Chandni Chowk, Delhi - 110006',
            'operating_hours' => '08:00 AM - 10:30 PM (7 Days a week)',
        ];

        $adminTeam = [
            ['name' => $user->name, 'email' => $user->email, 'role' => 'Super Administrator', 'status' => 'Active'],
            ['name' => 'Store Operations Lead', 'email' => 'ops@dayalsweets.com', 'role' => 'Inventory Manager', 'status' => 'Active'],
            ['name' => 'Dispatch Desk', 'email' => 'dispatch@dayalsweets.com', 'role' => 'Order Dispatcher', 'status' => 'Active'],
        ];

        return Inertia::render('Admin/Account', [
            'adminUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
            'storeInfo' => $storeInfo,
            'adminTeam' => $adminTeam,
        ]);
    }

    /**
     * Update admin profile details.
     */
    public function updateProfile(UpdateProfileRequest $request): RedirectResponse
    {
        $request->user()->updateProfile($request->validated());

        return back()->with('success', 'Admin profile updated successfully.');
    }

    /**
     * Update admin security password.
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $request->user()->updatePassword($request->validated('password'));

        return back()->with('success', 'Security credentials updated successfully.');
    }
}
