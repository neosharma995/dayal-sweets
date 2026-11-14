<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirect authenticated users to their role-specific dashboard.
     */
    public function redirect(Request $request): RedirectResponse
    {
        return redirect()->route($request->user()->dashboardRoute());
    }

    /**
     * Display the Customer e-commerce dashboard.
     */
    public function index(Request $request): Response
    {
        // Sample e-commerce user state for Dayal Sweets customer
        $overview = [
            'sweet_rewards_points' => 380,
            'points_cash_value' => '₹380 off on next order',
            'tier' => 'Gold Mithai Club Member',
            'total_orders_placed' => 7,
            'wishlist_count' => 4,
            'saved_addresses_count' => 2,
        ];

        $activeOrder = [
            'order_id' => 'DS-8921',
            'order_date' => 'Today at 11:15 AM',
            'estimated_delivery' => 'Today by 01:30 PM (Fresh Batch dispatch)',
            'status' => 'Being Freshly Packed',
            'current_step' => 2, // 1: Confirmed, 2: Fresh Preparation/Packaging, 3: Out for Delivery, 4: Delivered
            'total_amount' => 1250,
            'payment_mode' => 'Prepaid (UPI)',
            'items' => [
                ['name' => 'Kaju Katli (Pure Vark)', 'weight' => '1 kg box', 'qty' => 1, 'price' => 950],
                ['name' => 'Mini Rasgulla (Earthen Matka)', 'weight' => '500 gm', 'qty' => 1, 'price' => 300],
            ],
            'delivery_address' => 'Flat 402, Royal Residency, Connaught Place, New Delhi',
        ];

        $recentPastOrders = [
            [
                'order_id' => 'DS-8412',
                'order_date' => '02 Nov 2026',
                'items_summary' => 'Desi Ghee Besan Laddu (1kg), Gulab Jamun (1kg)',
                'total_amount' => 1100,
                'status' => 'Delivered',
                'items_count' => 2,
            ],
            [
                'order_id' => 'DS-7994',
                'order_date' => '24 Oct 2026 (Diwali Festival Special)',
                'items_summary' => 'Royal Celebration Dry Fruit Hamper (2kg)',
                'total_amount' => 2800,
                'status' => 'Delivered',
                'items_count' => 1,
            ],
        ];

        $recommendedSweets = [
            [
                'id' => 101,
                'name' => 'Special Motichoor Laddu (Desi Ghee)',
                'weight' => '500g / 1kg',
                'price' => 340,
                'rating' => 4.9,
                'tag' => 'Bestseller',
                'description' => 'Melt-in-mouth tiny boondi pearls fried in pure churned desi ghee, scented with green cardamom.',
            ],
            [
                'id' => 102,
                'name' => 'Pista Badam Lauj (Dry Fruit Barfi)',
                'weight' => '500g',
                'price' => 680,
                'rating' => 4.8,
                'tag' => 'Chef Special',
                'description' => 'Made from 100% California almonds and Iranian pistachio, without any refined flour or adulterants.',
            ],
            [
                'id' => 103,
                'name' => 'Fresh Kesar Jalebi (Ready to Warm)',
                'weight' => '500g',
                'price' => 240,
                'rating' => 4.9,
                'tag' => 'Crisp & Juicy',
                'description' => 'Crispy saffron-soaked spirals prepared in pure ghee. Packed in airtight insulated box.',
            ],
        ];

        return Inertia::render('Customer/Dashboard', [
            'overview' => $overview,
            'activeOrder' => $activeOrder,
            'recentPastOrders' => $recentPastOrders,
            'recommendedSweets' => $recommendedSweets,
        ]);
    }
}
