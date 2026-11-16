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
     * Display the Customer WooCommerce-style e-commerce dashboard with real order data.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Fetch real orders from database for this customer with items
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->latest()
            ->get();

        $totalSpent = (float) $orders->sum('total_amount');
        $rewardPoints = max(50, (int) round($totalSpent * 0.10));
        $tier = $totalSpent > 5000 ? 'Platinum Sweet Connoisseur' : ($totalSpent > 1500 ? 'Gold Mithai Club Member' : 'Silver Member');

        // Extract all individual sweets/products purchased across all user orders
        $userCreatedProducts = collect();
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $image = $item->product_image;
                if (empty($image) && $item->product && !empty($item->product->product_image)) {
                    $image = $item->product->product_image;
                }
                if (empty($image)) {
                    $image = '/uploads/2026/07/kaaju-katli.png';
                }

                $userCreatedProducts->push([
                    'id' => $item->id,
                    'order_id' => $order->order_number,
                    'order_db_id' => $order->id,
                    'order_date' => $order->created_at ? $order->created_at->format('d M Y') : 'Recent',
                    'delivered_date' => $order->delivered_at ? $order->delivered_at->format('d M Y') : ($order->delivery_status === 'delivered' ? ($order->updated_at ? $order->updated_at->format('d M Y') : 'Recent') : null),
                    'delivery_status' => $order->delivery_status,
                    'payment_status' => $order->payment_status,
                    'product_id' => $item->product_id,
                    'name' => $item->product_name,
                    'variation_name' => $item->variation_name ?: 'Standard Box',
                    'unit_price' => (float) $item->unit_price,
                    'quantity' => (int) $item->quantity,
                    'total' => (float) $item->total,
                    'image' => $image,
                ]);
            }
        }

        $overview = [
            'sweet_rewards_points' => $rewardPoints,
            'points_cash_value' => '₹' . $rewardPoints . ' off on next order',
            'tier' => $tier,
            'total_orders_placed' => $orders->count(),
            'total_sweets_count' => $userCreatedProducts->sum('quantity'),
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
                $step = 2;
                $statusLabel = 'Pending';
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

        // Full orders list for WooCommerce Orders tab
        $allOrders = $orders->map(function ($order) {
            $itemsList = $order->items->pluck('product_name')->take(3)->join(', ');
            if ($order->items->count() > 3) {
                $itemsList .= ' +' . ($order->items->count() - 3) . ' more';
            }

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_id' => $order->order_number,
                'order_date' => $order->created_at ? $order->created_at->format('d M Y') : 'Recent',
                'created_at_formatted' => $order->created_at ? $order->created_at->format('d M Y, h:i A') : 'Recent',
                'items_summary' => $itemsList ?: 'Assorted Sweets',
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'shipping_method_title' => $order->shipping_method_title ?: 'Standard Delivery',
                'total_amount' => (float) $order->total_amount,
                'status' => ucfirst($order->delivery_status),
                'delivery_status' => $order->delivery_status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'items_count' => $order->items->count(),
                'shipping_address' => $order->shipping_address,
                'apartment' => $order->apartment,
                'city' => $order->city,
                'state' => $order->state,
                'pincode' => $order->pincode,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'order_notes' => $order->order_notes,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'variation_name' => $item->variation_name,
                        'unit_price' => (float) $item->unit_price,
                        'quantity' => (int) $item->quantity,
                        'total' => (float) $item->total,
                        'product_image' => $item->product_image ?: '/uploads/2026/07/kaaju-katli.png',
                    ];
                })->toArray(),
            ];
        })->toArray();

        // Saved Addresses from orders or defaults
        $latestOrder = $orders->first();
        $savedAddress = [
            'name' => $latestOrder?->customer_name ?: $user->name,
            'email' => $latestOrder?->customer_email ?: $user->email,
            'phone' => $latestOrder?->customer_phone ?: '+91 98765 43210',
            'address' => $latestOrder?->shipping_address ?: 'Civil Lines, Main Market',
            'apartment' => $latestOrder?->apartment ?: '',
            'city' => $latestOrder?->city ?: 'Una',
            'state' => $latestOrder?->state ?: 'Himachal Pradesh',
            'pincode' => $latestOrder?->pincode ?: '174303',
        ];

        return Inertia::render('Customer/Dashboard', [
            'overview' => $overview,
            'activeOrder' => $activeOrder,
            'recentPastOrders' => $allOrders,
            'allOrders' => $allOrders,
            'userCreatedProducts' => $userCreatedProducts->toArray(),
            'savedAddress' => $savedAddress,
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'member_since' => $user->created_at ? $user->created_at->format('M Y') : 'Nov 2026',
                'tier' => $tier,
            ],
        ]);
    }
}
