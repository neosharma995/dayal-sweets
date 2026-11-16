<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

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
     * Redirect authenticated users to their role-specific account page.
     */
    public function redirect(Request $request): RedirectResponse
    {
        return redirect()->route($request->user()->accountRoute());
    }

    /**
     * Display Customer profile, saved addresses, and order history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $savedAddresses = [
            [
                'id' => 1,
                'title' => 'Home',
                'is_default' => true,
                'recipient_name' => $user->name,
                'phone' => '+91 98765 43210',
                'address_line' => 'Flat 402, Royal Residency, Sector 14',
                'landmark' => 'Near Central Park',
                'city' => 'New Delhi',
                'pincode' => '110001',
            ],
            [
                'id' => 2,
                'title' => 'Office / Corporate',
                'is_default' => false,
                'recipient_name' => $user->name,
                'phone' => '+91 98765 43210',
                'address_line' => 'Tower B, 6th Floor, Cyber Heights',
                'landmark' => 'Opposite Metro Station',
                'city' => 'Gurugram',
                'pincode' => '122002',
            ],
        ];

        $userOrders = $user->orders()->with('items')->latest()->get();

        $orderHistory = $userOrders->map(function ($order) {
            $itemsList = $order->items->pluck('product_name')->take(3)->join(', ');
            if ($order->items->count() > 3) {
                $itemsList .= ' +' . ($order->items->count() - 3) . ' more';
            }

            return [
                'order_id' => $order->order_number,
                'date' => $order->created_at ? $order->created_at->format('d M Y') : 'Recent',
                'status' => ucfirst($order->delivery_status),
                'delivery_status' => $order->delivery_status,
                'total' => (float) $order->total_amount,
                'items' => $itemsList ?: 'Assorted Sweets',
                'payment' => strtoupper($order->payment_method) . ' (' . ucfirst($order->payment_status) . ')',
            ];
        })->toArray();

        return Inertia::render('Customer/Account', [
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'member_since' => $user->created_at ? $user->created_at->format('M Y') : 'Nov 2026',
                'tier' => 'Gold Mithai Club',
            ],
            'savedAddresses' => $savedAddresses,
            'orderHistory' => $orderHistory,
        ]);
    }

    /**
     * Update customer personal details.
     */
    public function updateProfile(UpdateProfileRequest $request): RedirectResponse
    {
        $request->user()->updateProfile($request->validated());

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update customer security password.
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $request->user()->updatePassword($request->validated('password'));

        return back()->with('success', 'Password updated successfully.');
    }
}
