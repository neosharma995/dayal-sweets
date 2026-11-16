<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
     * Display the Customer e-commerce dashboard with real order data.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Fetch real orders from database for this customer
        $orders = Order::where('user_id', $user->id)
            ->with('items')
            ->latest()
            ->get();

        $totalSpent = $orders->sum('total_amount');
        $rewardPoints = max(50, (int) round($totalSpent * 0.10));

        $overview = [
            'sweet_rewards_points' => $rewardPoints,
            'points_cash_value' => '₹' . $rewardPoints . ' off on next order',
            'tier' => $totalSpent > 5000 ? 'Platinum Sweet Connoisseur' : ($totalSpent > 1500 ? 'Gold Mithai Club Member' : 'Silver Member'),
            'total_orders_placed' => $orders->count(),
            'wishlist_count' => 4,
            'saved_addresses_count' => 1,
        ];

        // Identify active in-flight order (pending or shipping), or latest order if placed recently
        $activeOrderModel = $orders->first(function ($order) {
            return in_array($order->delivery_status, ['pending', 'shipping'], true);
        }) ?? $orders->first();

        $activeOrder = null;
        if ($activeOrderModel) {
            $step = 1;
            $statusLabel = 'Order Confirmed';

            if ($activeOrderModel->delivery_status === 'delivered') {
                $step = 4;
                $statusLabel = 'Delivered';
            } elseif ($activeOrderModel->delivery_status === 'shipping') {
                $step = 3;
                $statusLabel = 'Out for Delivery / In Transit';
            } elseif ($activeOrderModel->delivery_status === 'pending') {
                if ($activeOrderModel->payment_status === 'paid') {
                    $step = 2;
                    $statusLabel = 'Kitchen Preparation & Packaging';
                } else {
                    $step = 1;
                    $statusLabel = 'Order Placed (Pending Payment Confirmation)';
                }
            } elseif ($activeOrderModel->delivery_status === 'cancelled') {
                $step = 0;
                $statusLabel = 'Cancelled';
            }

            $activeOrder = [
                'order_id' => $activeOrderModel->order_number,
                'order_date' => $activeOrderModel->created_at ? $activeOrderModel->created_at->format('d M Y, h:i A') : 'Today',
                'estimated_delivery' => $activeOrderModel->delivery_status === 'delivered'
                    ? 'Delivered on ' . ($activeOrderModel->delivered_at ? $activeOrderModel->delivered_at->format('d M Y') : 'Date unavailable')
                    : 'Dispatch in 24-48 Hours (Fresh Desi Ghee Batch)',
                'status' => $statusLabel,
                'delivery_status' => $activeOrderModel->delivery_status,
                'payment_status' => $activeOrderModel->payment_status,
                'current_step' => $step,
                'total_amount' => (float) $activeOrderModel->total_amount,
                'payment_mode' => strtoupper($activeOrderModel->payment_method) . ' (' . ucfirst($activeOrderModel->payment_status) . ')',
                'items' => $activeOrderModel->items->map(function ($item) {
                    return [
                        'name' => $item->product_name,
                        'weight' => $item->variation_name ?: 'Standard Box',
                        'qty' => $item->quantity,
                        'price' => (float) $item->total,
                    ];
                })->toArray(),
                'delivery_address' => $activeOrderModel->shipping_address . ', ' . $activeOrderModel->city . ', ' . $activeOrderModel->state . ' - ' . $activeOrderModel->pincode,
            ];
        }

        $recentPastOrders = $orders->map(function ($order) {
            $itemsList = $order->items->pluck('product_name')->take(3)->join(', ');
            if ($order->items->count() > 3) {
                $itemsList .= ' +' . ($order->items->count() - 3) . ' more';
            }

            return [
                'order_id' => $order->order_number,
                'order_date' => $order->created_at ? $order->created_at->format('d M Y') : 'Recent',
                'items_summary' => $itemsList ?: 'Assorted Sweets',
                'total_amount' => (float) $order->total_amount,
                'status' => ucfirst($order->delivery_status),
                'delivery_status' => $order->delivery_status,
                'payment_status' => $order->payment_status,
                'items_count' => $order->items->count(),
            ];
        })->toArray();

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
