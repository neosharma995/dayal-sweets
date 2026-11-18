<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a paginated list of store orders with filter tabs.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $deliveryStatus = $request->input('delivery_status', 'all');
        $paymentStatus = $request->input('payment_status', 'all');
        $outletId = $request->input('outlet_id') ?? $request->session()->get('active_outlet_id');

        $query = Order::with(['items', 'user', 'outlet', 'outletTable'])->latest();

        // Filter by outlet if specified
        if ($outletId && $outletId !== 'all') {
            $query->where('outlet_id', (int) $outletId);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('table_number', 'like', "%{$search}%")
                    ->orWhere('table_location', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($deliveryStatus !== 'all' && in_array($deliveryStatus, ['pending', 'shipping', 'delivered', 'cancelled'], true)) {
            $query->where('delivery_status', $deliveryStatus);
        }

        if ($paymentStatus !== 'all' && in_array($paymentStatus, ['paid', 'pending', 'failed', 'refunded'], true)) {
            $query->where('payment_status', $paymentStatus);
        }

        $perPage = (int) env('PAGINATION_LIMIT', 20);
        $orders = $query->paginate($perPage)->withQueryString();

        // Calculate statistics for top metric cards
        $statsQuery = Order::query();
        if ($outletId && $outletId !== 'all') {
            $statsQuery->where('outlet_id', (int) $outletId);
        }

        $counts = [
            'total' => (clone $statsQuery)->count(),
            'pending' => (clone $statsQuery)->where('delivery_status', 'pending')->count(),
            'shipping' => (clone $statsQuery)->where('delivery_status', 'shipping')->count(),
            'out_for_delivery' => (clone $statsQuery)->where('delivery_status', 'out_for_delivery')->count(),
            'delivered' => (clone $statsQuery)->where('delivery_status', 'delivered')->count(),
            'cancelled' => (clone $statsQuery)->where('delivery_status', 'cancelled')->count(),
            'total_revenue' => (float) (clone $statsQuery)->where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'delivery_status' => $deliveryStatus,
                'payment_status' => $paymentStatus,
                'outlet_id' => $outletId,
            ],
        ]);
    }

    /**
     * Show order creation form for admin.
     */
    public function create(): Response
    {
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $products = Product::select('id', 'product_name', 'product_price', 'product_selling_price', 'product_image')
            ->orderBy('product_name')
            ->get();

        return Inertia::render('Admin/Orders/Create', [
            'users' => $users,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created order from Admin.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:25'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'apartment' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'pincode' => ['required', 'string', 'max:20'],
            'shipping_method_title' => ['nullable', 'string', 'max:100'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'in:razorpay,cod,bank_transfer,cash'],
            'payment_status' => ['required', 'string', 'in:pending,paid,failed,refunded'],
            'delivery_status' => ['required', 'string', 'in:pending,shipping,out_for_delivery,delivered,cancelled'],
            'order_notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'exists:products,id'],
            'items.*.product_name' => ['required', 'string', 'max:255'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $shippingCost = (float) ($validated['shipping_cost'] ?? 0);

        DB::transaction(function () use ($validated, $shippingCost, &$createdOrder) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += ((float) $item['unit_price']) * ((int) $item['quantity']);
            }
            $taxAmount = 0;
            $totalAmount = $subtotal + $shippingCost + $taxAmount;

            $paidAt = $validated['payment_status'] === 'paid' ? now() : null;
            $shippedAt = in_array($validated['delivery_status'], ['shipping', 'out_for_delivery'], true) ? now() : null;
            $deliveredAt = $validated['delivery_status'] === 'delivered' ? now() : null;

            $createdOrder = Order::create([
                'user_id' => $validated['user_id'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'apartment' => $validated['apartment'] ?? null,
                'city' => $validated['city'],
                'state' => $validated['state'],
                'pincode' => $validated['pincode'],
                'shipping_method_title' => $validated['shipping_method_title'] ?? 'Standard Delivery',
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'currency' => 'INR',
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'delivery_status' => $validated['delivery_status'],
                'order_notes' => $validated['order_notes'] ?? null,
                'paid_at' => $paidAt,
                'shipped_at' => $shippedAt,
                'delivered_at' => $deliveredAt,
            ]);

            foreach ($validated['items'] as $item) {
                $unitPrice = (float) $item['unit_price'];
                $qty = (int) $item['quantity'];
                $itemTotal = $unitPrice * $qty;

                OrderItem::create([
                    'order_id' => $createdOrder->id,
                    'product_id' => $item['product_id'] ?? null,
                    'product_name' => $item['product_name'],
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'tax_rate_percent' => 0,
                    'tax_amount' => 0,
                    'subtotal' => $itemTotal,
                    'total' => $itemTotal,
                ]);
            }
        });

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order #' . $createdOrder->order_number . ' created successfully.');
    }

    /**
     * Display a specific order with items and full tracking timeline.
     */
    public function show(Order $order): Response
    {
        $order->load(['items.product', 'user']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Quick status update for order (pending -> shipping -> delivered, or payment status).
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'delivery_status' => ['nullable', 'string', 'in:pending,shipping,out_for_delivery,delivered,cancelled'],
            'payment_status' => ['nullable', 'string', 'in:pending,paid,failed,refunded'],
        ]);

        $updates = [];

        if (!empty($validated['delivery_status'])) {
            $updates['delivery_status'] = $validated['delivery_status'];

            if (in_array($validated['delivery_status'], ['shipping', 'out_for_delivery'], true) && $order->shipped_at === null) {
                $updates['shipped_at'] = now();
            }

            if ($validated['delivery_status'] === 'delivered' && $order->delivered_at === null) {
                $updates['delivered_at'] = now();
                if ($order->shipped_at === null) {
                    $updates['shipped_at'] = now();
                }
            }
        }

        if (!empty($validated['payment_status'])) {
            $updates['payment_status'] = $validated['payment_status'];

            if ($validated['payment_status'] === 'paid' && $order->paid_at === null) {
                $updates['paid_at'] = now();
            }
        }

        $order->update($updates);

        return back()->with('success', "Order #{$order->order_number} status updated successfully.");
    }

    /**
     * Delete an order.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $orderNumber = $order->order_number;
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', "Order #{$orderNumber} deleted successfully.");
    }
}
