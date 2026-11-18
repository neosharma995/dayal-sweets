<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Outlet;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OutletController extends Controller
{
    /**
     * Switch active outlet context for the admin session.
     */
    public function switchContext(Request $request): RedirectResponse|JsonResponse
    {
        $outletId = $request->input('outlet_id');
        if ($outletId && Outlet::where('id', $outletId)->exists()) {
            $request->session()->put('active_outlet_id', (int) $outletId);
            $outlet = Outlet::find($outletId);
            $message = "Switched to {$outlet->name} outlet context.";
        } else {
            $request->session()->forget('active_outlet_id');
            $message = "Switched to all outlets view.";
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'active_outlet_id' => $request->session()->get('active_outlet_id'),
                'message' => $message,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Clear active outlet context.
     */
    public function clearContext(Request $request): RedirectResponse|JsonResponse
    {
        $request->session()->forget('active_outlet_id');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Active outlet filter cleared. Showing all outlets.',
            ]);
        }

        return redirect()->back()->with('success', 'Active outlet filter cleared. Showing all outlets.');
    }
    /**
     * Display a listing of all outlets.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = Outlet::query()->withCount(['products', 'shippingZones', 'orders', 'tables'])->orderBy('sort_order')->orderBy('id');

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = (string) $request->input('status');
            $query->where('status', $status);
        }

        $outlets = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Outlets retrieved successfully.',
                'count' => $outlets->count(),
                'data' => $outlets,
            ]);
        }

        return Inertia::render('Admin/Outlets/Index', [
            'outlets' => $outlets,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => Outlet::count(),
                'active' => Outlet::where('status', 'active')->where('is_active', true)->count(),
                'coming_soon' => Outlet::where('status', 'coming_soon')->orWhere('is_coming_soon', true)->count(),
                'inactive' => Outlet::where('status', 'inactive')->orWhere('is_active', false)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new outlet.
     */
    public function create(): Response
    {
        $nextSortOrder = (Outlet::max('sort_order') ?? 0) + 1;

        return Inertia::render('Admin/Outlets/Create', [
            'nextSortOrder' => $nextSortOrder,
        ]);
    }

    /**
     * Store a newly created outlet in storage.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:outlets,slug'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:50'],
            'phone_raw' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'whatsapp_raw' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'timings' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,svg', 'max:4096'],
            'map_url' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'string', 'in:active,coming_soon,inactive'],
            'is_active' => ['nullable', 'boolean'],
            'is_coming_soon' => ['nullable', 'boolean'],
            'expected_opening' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('outlets', 'public');
            $validated['image'] = $path;
        }

        unset($validated['image_file']);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
            // Check for collision
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Outlet::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $validated['is_active'] = $validated['status'] !== 'inactive';
        $validated['is_coming_soon'] = $validated['status'] === 'coming_soon';
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['state'] = $validated['state'] ?? 'Himachal Pradesh';

        $outlet = Outlet::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Outlet '{$outlet->name}' created successfully.",
                'data' => $outlet,
            ], 201);
        }

        return redirect()
            ->route('admin.outlets.index')
            ->with('success', "Outlet '{$outlet->name}' created successfully.");
    }

    /**
     * Display the specified outlet with dedicated tabs (Overview, Products, Orders, Delivery Zones).
     */
    public function show(Outlet $outlet): Response|JsonResponse
    {
        $outlet->loadCount(['products', 'shippingZones', 'orders', 'tables']);
        $outlet->load([
            'products' => function ($q) {
                $q->with(['category', 'variations'])->latest('products.id');
            },
            'shippingZones.methods',
            'tables' => function ($q) {
                $q->withCount('orders')->orderBy('sort_order')->orderBy('id');
            },
            'orders' => function ($q) {
                $q->with(['user', 'items', 'outletTable'])->latest('id')->take(50);
            },
        ]);

        // Get unassigned products for quick assigning in modal
        $assignedProductIds = $outlet->products->pluck('id')->all();
        $unassignedProducts = Product::select('id', 'product_name', 'product_price', 'product_selling_price', 'category_id', 'product_image')
            ->with('category:id,category_name')
            ->whereNotIn('id', $assignedProductIds)
            ->orderBy('product_name')
            ->get();

        $stats = [
            'total_products' => $outlet->products_count,
            'total_orders' => $outlet->orders_count,
            'total_revenue' => (float) $outlet->orders()->where('payment_status', 'paid')->sum('total_amount'),
            'pending_orders' => $outlet->orders()->where('delivery_status', 'pending')->count(),
            'shipping_zones' => $outlet->shipping_zones_count,
            'total_tables' => $outlet->tables_count,
            'total_seats' => (int) $outlet->tables->sum('capacity'),
        ];

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $outlet,
                'unassigned_products' => $unassignedProducts,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Outlets/Show', [
            'outlet' => $outlet,
            'unassignedProducts' => $unassignedProducts,
            'stats' => $stats,
        ]);
    }

    /**
     * Assign products to this outlet.
     */
    public function syncProducts(Request $request, Outlet $outlet): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'product_ids' => ['required', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'stock_qty' => ['nullable', 'integer', 'min:0'],
        ]);

        $productIds = $validated['product_ids'];
        $stockQty = (int) ($validated['stock_qty'] ?? 100);

        $syncData = [];
        foreach ($productIds as $pid) {
            $syncData[$pid] = [
                'stock_qty' => $stockQty,
                'is_available' => true,
            ];
        }

        $outlet->products()->syncWithoutDetaching($syncData);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Products assigned to outlet successfully.',
            ]);
        }

        return redirect()->back()->with('success', 'Products assigned to outlet successfully.');
    }

    /**
     * Remove a product from this outlet.
     */
    public function detachProduct(Outlet $outlet, Product $product): RedirectResponse|JsonResponse
    {
        $outlet->products()->detach($product->id);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Product '{$product->product_name}' removed from outlet.",
            ]);
        }

        return redirect()->back()->with('success', "Product '{$product->product_name}' removed from outlet.");
    }

    /**
     * Update stock or availability for an outlet product.
     */
    public function updateProductPivot(Request $request, Outlet $outlet, Product $product): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'stock_qty' => ['nullable', 'integer', 'min:0'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        $outlet->products()->updateExistingPivot($product->id, $validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Outlet product inventory updated.',
            ]);
        }

        return redirect()->back()->with('success', 'Outlet product inventory updated.');
    }

    /**
     * Show the form for editing the specified outlet.
     */
    public function edit(Outlet $outlet): Response
    {
        return Inertia::render('Admin/Outlets/Edit', [
            'outlet' => $outlet,
        ]);
    }

    /**
     * Update the specified outlet in storage.
     */
    public function update(Request $request, Outlet $outlet): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:outlets,slug,' . $outlet->id],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:50'],
            'phone_raw' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'whatsapp_raw' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'timings' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,svg', 'max:4096'],
            'map_url' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'string', 'in:active,coming_soon,inactive'],
            'is_active' => ['nullable', 'boolean'],
            'is_coming_soon' => ['nullable', 'boolean'],
            'expected_opening' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        if ($request->hasFile('image_file')) {
            // Delete old uploaded file if in public storage
            if ($outlet->image && !str_starts_with($outlet->image, '/') && !str_starts_with($outlet->image, 'http')) {
                Storage::disk('public')->delete($outlet->image);
            }
            $path = $request->file('image_file')->store('outlets', 'public');
            $validated['image'] = $path;
        }

        unset($validated['image_file']);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['is_active'] = $validated['status'] !== 'inactive';
        $validated['is_coming_soon'] = $validated['status'] === 'coming_soon';
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $outlet->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Outlet '{$outlet->name}' updated successfully.",
                'data' => $outlet,
            ]);
        }

        return redirect()
            ->route('admin.outlets.index')
            ->with('success', "Outlet '{$outlet->name}' updated successfully.");
    }

    /**
     * Toggle the active status of an outlet.
     */
    public function toggleActive(Outlet $outlet): RedirectResponse|JsonResponse
    {
        if ($outlet->status === 'inactive' || !$outlet->is_active) {
            $outlet->is_active = true;
            $outlet->status = $outlet->is_coming_soon ? 'coming_soon' : 'active';
        } else {
            $outlet->is_active = false;
            $outlet->status = 'inactive';
        }

        $outlet->save();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Outlet '{$outlet->name}' status updated to {$outlet->status}.",
                'data' => $outlet,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', "Outlet '{$outlet->name}' status updated to {$outlet->status}.");
    }

    /**
     * Remove the specified outlet from storage.
     */
    public function destroy(Outlet $outlet): RedirectResponse|JsonResponse
    {
        $name = $outlet->name;

        // Delete uploaded file if stored in storage disk
        if ($outlet->image && !str_starts_with($outlet->image, '/') && !str_starts_with($outlet->image, 'http')) {
            Storage::disk('public')->delete($outlet->image);
        }

        $outlet->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Outlet '{$name}' deleted successfully.",
            ]);
        }

        return redirect()
            ->route('admin.outlets.index')
            ->with('success', "Outlet '{$name}' deleted successfully.");
    }
}
