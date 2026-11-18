<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdatePasswordRequest;
use App\Http\Requests\Account\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Display the Admin account settings page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Account', [
            'adminUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?: 'Administrator',
                'created_at_formatted' => $user->created_at ? $user->created_at->format('d M Y') : 'Active',
            ],
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
