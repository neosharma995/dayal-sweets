<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Outlet;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Admin e-commerce dashboard.
     */
    public function index(Request $request): Response
    {
        $outletId = $request->input('outlet_id') ?? $request->session()->get('active_outlet_id');
        $activeOutlet = null;

        if ($outletId && $outletId !== 'all') {
            $activeOutlet = Outlet::find((int) $outletId);
        }

        // 1. Outlets Count
        $totalOutlets = Outlet::count();
        $activeOutletsCount = Outlet::where('is_active', true)->count();

        // 2. Orders Query
        $ordersQuery = Order::query()->with(['items', 'outlet'])->latest('id');
        $statsOrdersQuery = Order::query();

        if ($activeOutlet) {
            $ordersQuery->where('outlet_id', $activeOutlet->id);
            $statsOrdersQuery->where('outlet_id', $activeOutlet->id);
        }

        $totalOrders = (clone $statsOrdersQuery)->count();
        $pendingOrders = (clone $statsOrdersQuery)->whereIn('delivery_status', ['pending', 'processing', 'shipping', 'out_for_delivery'])->count();
        $deliveredOrders = (clone $statsOrdersQuery)->where('delivery_status', 'delivered')->count();
        $totalRevenue = (float) (clone $statsOrdersQuery)->where('payment_status', 'paid')->sum('total_amount');

        // Recent Orders list (latest 8)
        $recentOrders = $ordersQuery->limit(8)->get()->map(function (Order $order) {
            $itemsSummary = $order->items->map(function ($item) {
                return ($item->product_name ?? 'Item') . ' (' . ($item->quantity ?? 1) . ')';
            })->implode(', ');

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'city' => $order->city,
                'items' => $itemsSummary ?: 'Standard Order Items',
                'items_count' => $order->items->count(),
                'total' => (float) $order->total_amount,
                'payment_status' => $order->payment_status ?: 'pending',
                'delivery_status' => $order->delivery_status ?: 'pending',
                'placed_at' => $order->created_at ? $order->created_at->diffForHumans() : 'Recently',
                'created_at_formatted' => $order->created_at ? $order->created_at->format('d M Y, h:i A') : 'N/A',
                'outlet_name' => $order->outlet?->name,
                'outlet_id' => $order->outlet_id,
            ];
        });

        // 3. Products Query
        $productsQuery = Product::query()->with(['category', 'outlets'])->latest('id');

        if ($activeOutlet) {
            $productsQuery->whereHas('outlets', function ($q) use ($activeOutlet) {
                $q->where('outlets.id', $activeOutlet->id);
            });
        }

        $totalProducts = (clone $productsQuery)->count();

        // Recent Products list (latest 8)
        $recentProducts = $productsQuery->limit(8)->get()->map(function (Product $product) {
            return [
                'id' => $product->id,
                'name' => $product->product_name,
                'price' => (float) ($product->product_selling_price ?: $product->product_price ?: 0),
                'regular_price' => (float) ($product->product_price ?: 0),
                'stock_quantity' => (int) ($product->product_qty ?? 0),
                'category_name' => $product->category?->category_name ?? 'General',
                'image' => $product->product_image,
                'outlets_count' => $product->outlets->count(),
                'outlets_names' => $product->outlets->pluck('name')->all(),
            ];
        });

        $metrics = [
            'total_outlets' => $totalOutlets,
            'active_outlets' => $activeOutletsCount,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'delivered_orders' => $deliveredOrders,
            'total_revenue' => $totalRevenue,
            'today_sales' => (float) (clone $statsOrdersQuery)->whereDate('created_at', today())->where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
            'recentOrders' => $recentOrders,
            'recentProducts' => $recentProducts,
            'activeOutlet' => $activeOutlet ? [
                'id' => $activeOutlet->id,
                'name' => $activeOutlet->name,
                'city' => $activeOutlet->city,
                'state' => $activeOutlet->state,
            ] : null,
        ]);
    }
}
