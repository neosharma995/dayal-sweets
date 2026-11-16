<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the Admin e-commerce dashboard.
     */
    public function index(Request $request): Response
    {
        // Sample real-world e-commerce metrics for Dayal Sweets store
        $metrics = [
            'today_sales' => 48250,
            'month_sales' => 1245000,
            'total_orders' => 184,
            'pending_orders' => 12,
            'total_customers' => 1420,
            'low_stock_items' => 3,
        ];

        $recentOrders = [
            [
                'order_number' => 'DS-8921',
                'customer_name' => 'Amit Verma',
                'customer_phone' => '+91 98765 43210',
                'items' => 'Kaju Katli (1kg), Special Gulab Jamun (1kg)',
                'total' => 1650,
                'payment_status' => 'Paid (UPI)',
                'status' => 'Processing',
                'placed_at' => '15 mins ago',
            ],
            [
                'order_number' => 'DS-8920',
                'customer_name' => 'Pooja Sharma',
                'customer_phone' => '+91 98111 22334',
                'items' => 'Motichoor Laddu (500g), Rasgulla Tin (1kg)',
                'total' => 780,
                'payment_status' => 'Paid (Card)',
                'status' => 'Out for Delivery',
                'placed_at' => '1 hour ago',
            ],
            [
                'order_number' => 'DS-8919',
                'customer_name' => 'Suresh Gupta',
                'customer_phone' => '+91 97234 56789',
                'items' => 'Desi Ghee Besan Laddu (1kg), Khoya Barfi (500g)',
                'total' => 1120,
                'payment_status' => 'Cash on Delivery',
                'status' => 'Pending Confirmation',
                'placed_at' => '2 hours ago',
            ],
            [
                'order_number' => 'DS-8918',
                'customer_name' => 'Neha Agarwal',
                'customer_phone' => '+91 98990 11223',
                'items' => 'Assorted Festive Mithai Box (2kg)',
                'total' => 2400,
                'payment_status' => 'Paid (NetBanking)',
                'status' => 'Delivered',
                'placed_at' => '4 hours ago',
            ],
        ];

        $topProducts = [
            ['name' => 'Royal Kaju Katli', 'category' => 'Dry Fruit Sweets', 'sold_qty' => '142 kg', 'revenue' => '₹1,56,200', 'stock_status' => 'In Stock'],
            ['name' => 'Desi Ghee Motichoor Laddu', 'category' => 'Traditional Sweets', 'sold_qty' => '118 kg', 'revenue' => '₹70,800', 'stock_status' => 'In Stock'],
            ['name' => 'Kesar Rasmalai', 'category' => 'Bengali Sweets', 'sold_qty' => '85 boxes', 'revenue' => '₹42,500', 'stock_status' => 'Low Stock (8 left)'],
            ['name' => 'Gulab Jamun (Desi Ghee)', 'category' => 'Traditional Sweets', 'sold_qty' => '95 kg', 'revenue' => '₹47,500', 'stock_status' => 'In Stock'],
            ['name' => 'Special Dry Fruit Barfi', 'category' => 'Sugar Free & Premium', 'sold_qty' => '64 kg', 'revenue' => '₹76,800', 'stock_status' => 'Low Stock (5 left)'],
        ];

        $inventoryAlerts = [
            ['item' => 'Pista Badam Roll', 'stock' => '4 kg remaining', 'level' => 'critical'],
            ['item' => 'Kesar Rasmalai', 'stock' => '8 boxes remaining', 'level' => 'warning'],
            ['item' => 'Silver Vark Packing Boxes', 'stock' => '25 pcs remaining', 'level' => 'warning'],
        ];

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'inventoryAlerts' => $inventoryAlerts,
        ]);
    }
}
