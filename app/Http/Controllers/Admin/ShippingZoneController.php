<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use App\Models\ShippingZone;
use App\Models\ShippingZoneMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ShippingZoneController extends Controller
{
    /**
     * Default list of Indian states, union territories, and their standard PIN code ranges.
     */
    public const DEFAULT_REGIONS = [
        ['name' => 'Delhi NCR', 'pincode' => '110001 - 110096', 'code' => 'DELHI_NCR'],
        ['name' => 'Delhi', 'pincode' => '110001 - 110096', 'code' => 'DL'],
        ['name' => 'Uttar Pradesh', 'pincode' => '201001 - 285223', 'code' => 'UP'],
        ['name' => 'Haryana', 'pincode' => '121001 - 136135', 'code' => 'HR'],
        ['name' => 'Punjab', 'pincode' => '140001 - 160071', 'code' => 'PB'],
        ['name' => 'Rajasthan', 'pincode' => '301001 - 345034', 'code' => 'RJ'],
        ['name' => 'Himachal Pradesh', 'pincode' => '171001 - 177601', 'code' => 'HP'],
        ['name' => 'Chandigarh', 'pincode' => '160001 - 160102', 'code' => 'CH'],
        ['name' => 'Uttarakhand', 'pincode' => '244712 - 263680', 'code' => 'UK'],
        ['name' => 'Maharashtra', 'pincode' => '400001 - 445402', 'code' => 'MH'],
        ['name' => 'Gujarat', 'pincode' => '360001 - 396590', 'code' => 'GJ'],
        ['name' => 'Madhya Pradesh', 'pincode' => '450001 - 488448', 'code' => 'MP'],
        ['name' => 'Karnataka', 'pincode' => '560001 - 591346', 'code' => 'KA'],
        ['name' => 'Tamil Nadu', 'pincode' => '600001 - 643253', 'code' => 'TN'],
        ['name' => 'Telangana', 'pincode' => '500001 - 509412', 'code' => 'TG'],
        ['name' => 'West Bengal', 'pincode' => '700001 - 743711', 'code' => 'WB'],
        ['name' => 'Bihar', 'pincode' => '800001 - 855117', 'code' => 'BR'],
        ['name' => 'Odisha', 'pincode' => '751001 - 770076', 'code' => 'OD'],
        ['name' => 'Kerala', 'pincode' => '670001 - 695615', 'code' => 'KL'],
        ['name' => 'Andhra Pradesh', 'pincode' => '515001 - 535591', 'code' => 'AP'],
        ['name' => 'Assam', 'pincode' => '781001 - 788832', 'code' => 'AS'],
        ['name' => 'Jharkhand', 'pincode' => '814101 - 835325', 'code' => 'JH'],
        ['name' => 'Goa', 'pincode' => '403001 - 403806', 'code' => 'GA'],
        ['name' => 'Jammu & Kashmir', 'pincode' => '180001 - 194404', 'code' => 'JK'],
        ['name' => 'Rest of India', 'pincode' => 'All Other Pincodes', 'code' => 'REST_OF_INDIA'],
    ];

    /**
     * Resolve the target outlet from route parameter or query string.
     */
    protected function resolveOutlet(Request $request, Outlet|int|string|null $outlet = null): ?Outlet
    {
        if ($outlet instanceof Outlet) {
            return $outlet;
        }

        if (! empty($outlet)) {
            return Outlet::where('id', $outlet)->orWhere('slug', $outlet)->first();
        }

        $routeParam = $request->route('outlet');
        if ($routeParam instanceof Outlet) {
            return $routeParam;
        }

        if (! empty($routeParam)) {
            return Outlet::where('id', $routeParam)->orWhere('slug', $routeParam)->first();
        }

        if ($request->filled('outlet_id')) {
            return Outlet::find($request->input('outlet_id'));
        }

        return Outlet::orderBy('sort_order')->orderBy('id')->first();
    }

    /**
     * Display a listing of shipping zones for an outlet.
     */
    public function index(Request $request, Outlet|int|string|null $outlet = null): Response|JsonResponse
    {
        $outletModel = $this->resolveOutlet($request, $outlet);

        $query = ShippingZone::query()->with(['methods', 'outlet'])->orderBy('sort_order')->orderBy('id');

        // Only filter by outlet if explicitly provided in route or query
        if ($request->route('outlet') || $request->filled('outlet_id')) {
            if ($outletModel) {
                $query->where('outlet_id', $outletModel->id);
            }
        }

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('zone_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $zones = $query->get();
        $allOutlets = Outlet::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug', 'city', 'status', 'is_active']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Shipping zones retrieved successfully.',
                'outlet' => $outletModel,
                'count' => $zones->count(),
                'data' => $zones,
            ]);
        }

        return Inertia::render('Admin/ShippingZones/Index', [
            'zones' => $zones,
            'outlet' => $outletModel,
            'outlets' => $allOutlets,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new shipping zone for an outlet.
     */
    public function create(Request $request, Outlet|int|string|null $outlet = null): Response
    {
        $outletModel = $this->resolveOutlet($request, $outlet);
        $allOutlets = Outlet::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/ShippingZones/Create', [
            'outlet' => $outletModel,
            'outlets' => $allOutlets,
            'availableRegions' => self::DEFAULT_REGIONS,
        ]);
    }

    /**
     * Store a newly created shipping zone in an outlet.
     */
    public function store(Request $request, Outlet|int|string|null $outlet = null): RedirectResponse|JsonResponse
    {
        $outletModel = $this->resolveOutlet($request, $outlet);

        $validated = $request->validate([
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'zone_name' => ['required', 'string', 'max:255'],
            'zone_slug' => ['nullable', 'string', 'max:255'],
            'zone_regions' => ['nullable', 'array'],
            'zone_regions.*' => ['nullable'],
            'zone_postcodes' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'methods' => ['nullable', 'array'],
            'methods.*.method_type' => ['required_with:methods', 'string', 'in:flat_rate,free_shipping,local_pickup'],
            'methods.*.title' => ['required_with:methods', 'string', 'max:255'],
            'methods.*.cost' => ['nullable', 'numeric', 'min:0'],
            'methods.*.tax_status' => ['nullable', 'string', 'in:taxable,none'],
            'methods.*.min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'methods.*.is_enabled' => ['nullable', 'boolean'],
        ]);

        $createdZone = DB::transaction(function () use ($validated, $outletModel) {
            $methods = $validated['methods'] ?? [];
            unset($validated['methods']);

            $validated['outlet_id'] = $validated['outlet_id'] ?? $outletModel?->id;

            if (empty($validated['zone_slug'])) {
                $baseSlug = Str::slug($validated['zone_name']);
                $slug = $baseSlug;
                $counter = 1;
                $query = ShippingZone::where('zone_slug', $slug);
                if ($validated['outlet_id']) {
                    $query->where('outlet_id', $validated['outlet_id']);
                }
                while ($query->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                    $query = ShippingZone::where('zone_slug', $slug);
                    if ($validated['outlet_id']) {
                        $query->where('outlet_id', $validated['outlet_id']);
                    }
                }
                $validated['zone_slug'] = $slug;
            }

            if (isset($validated['zone_regions']) && is_array($validated['zone_regions'])) {
                $validated['zone_regions'] = array_values(array_map(function ($item) {
                    if (is_array($item)) {
                        return [
                            'name' => trim((string) ($item['name'] ?? '')),
                            'pincode' => ! empty($item['pincode']) ? trim((string) $item['pincode']) : null,
                        ];
                    }
                    return trim((string) $item);
                }, $validated['zone_regions']));
            }

            $validated['is_active'] = $validated['is_active'] ?? true;
            $validated['sort_order'] = $validated['sort_order'] ?? 0;

            $zone = ShippingZone::create($validated);

            if (! empty($methods)) {
                foreach ($methods as $methodData) {
                    $zone->methods()->create([
                        'method_type' => $methodData['method_type'],
                        'title' => $methodData['title'],
                        'cost' => $methodData['cost'] ?? 0,
                        'tax_status' => $methodData['tax_status'] ?? 'none',
                        'min_order_amount' => $methodData['min_order_amount'] ?? null,
                        'is_enabled' => $methodData['is_enabled'] ?? true,
                    ]);
                }
            }

            return $zone->load(['methods', 'outlet']);
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Shipping zone created successfully.',
                'data' => $createdZone,
            ], 201);
        }

        $targetOutletId = $createdZone->outlet_id;
        if ($targetOutletId && ($request->route('outlet') || $request->filled('outlet_id'))) {
            return redirect()
                ->route('admin.outlets.shipping-zones.index', $targetOutletId)
                ->with('success', "Shipping zone '{$createdZone->zone_name}' created successfully for {$createdZone->outlet?->name}.");
        }

        return redirect()
            ->route('admin.shipping-zones.index')
            ->with('success', "Shipping zone '{$createdZone->zone_name}' created successfully.");
    }

    /**
     * Display a single shipping zone by ID.
     */
    public function show(Request $request, ShippingZone|int|string $shippingZone, Outlet|int|string|null $outlet = null): Response|JsonResponse
    {
        $zoneModel = $shippingZone instanceof ShippingZone ? $shippingZone : ShippingZone::findOrFail($shippingZone);
        $zoneModel->load(['methods', 'outlet']);

        $outletModel = $zoneModel->outlet ?? $this->resolveOutlet($request, $outlet);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Shipping zone retrieved successfully.',
                'data' => $zoneModel,
            ]);
        }

        return Inertia::render('Admin/ShippingZones/Show', [
            'zone' => $zoneModel,
            'outlet' => $outletModel,
        ]);
    }

    /**
     * Show the form for editing an existing shipping zone.
     */
    public function edit(Request $request, ShippingZone|int|string $shippingZone, Outlet|int|string|null $outlet = null): Response
    {
        $zoneModel = $shippingZone instanceof ShippingZone ? $shippingZone : ShippingZone::findOrFail($shippingZone);
        $zoneModel->load(['methods', 'outlet']);

        $outletModel = $zoneModel->outlet ?? $this->resolveOutlet($request, $outlet);
        $allOutlets = Outlet::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/ShippingZones/Edit', [
            'zone' => $zoneModel,
            'outlet' => $outletModel,
            'outlets' => $allOutlets,
            'availableRegions' => self::DEFAULT_REGIONS,
        ]);
    }

    /**
     * Update an existing shipping zone.
     */
    public function update(Request $request, ShippingZone|int|string $shippingZone, Outlet|int|string|null $outlet = null): RedirectResponse|JsonResponse
    {
        $zoneModel = $shippingZone instanceof ShippingZone ? $shippingZone : ShippingZone::findOrFail($shippingZone);

        $validated = $request->validate([
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'zone_name' => ['required', 'string', 'max:255'],
            'zone_slug' => ['nullable', 'string', 'max:255'],
            'zone_regions' => ['nullable', 'array'],
            'zone_regions.*' => ['nullable'],
            'zone_postcodes' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'methods' => ['nullable', 'array'],
            'methods.*.id' => ['nullable'],
            'methods.*.method_type' => ['required_with:methods', 'string', 'in:flat_rate,free_shipping,local_pickup'],
            'methods.*.title' => ['required_with:methods', 'string', 'max:255'],
            'methods.*.cost' => ['nullable', 'numeric', 'min:0'],
            'methods.*.tax_status' => ['nullable', 'string', 'in:taxable,none'],
            'methods.*.min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'methods.*.is_enabled' => ['nullable', 'boolean'],
        ]);

        $updatedZone = DB::transaction(function () use ($zoneModel, $validated) {
            $methods = $validated['methods'] ?? null;
            unset($validated['methods']);

            if (isset($validated['zone_regions']) && is_array($validated['zone_regions'])) {
                $validated['zone_regions'] = array_values(array_map(function ($item) {
                    if (is_array($item)) {
                        return [
                            'name' => trim((string) ($item['name'] ?? '')),
                            'pincode' => ! empty($item['pincode']) ? trim((string) $item['pincode']) : null,
                        ];
                    }
                    return trim((string) $item);
                }, $validated['zone_regions']));
            }

            $zoneModel->update($validated);

            if (is_array($methods)) {
                $keptMethodIds = [];
                foreach ($methods as $m) {
                    $methodAttrs = [
                        'method_type' => $m['method_type'],
                        'title' => $m['title'],
                        'cost' => $m['cost'] ?? 0,
                        'tax_status' => $m['tax_status'] ?? 'none',
                        'min_order_amount' => $m['min_order_amount'] ?? null,
                        'is_enabled' => $m['is_enabled'] ?? true,
                    ];

                    if (! empty($m['id'])) {
                        $existing = ShippingZoneMethod::where('shipping_zone_id', $zoneModel->id)->find($m['id']);
                        if ($existing) {
                            $existing->update($methodAttrs);
                            $keptMethodIds[] = $existing->id;
                            continue;
                        }
                    }

                    $newMethod = $zoneModel->methods()->create($methodAttrs);
                    $keptMethodIds[] = $newMethod->id;
                }

                // Delete methods that were removed
                $zoneModel->methods()->whereNotIn('id', $keptMethodIds)->delete();
            }

            return $zoneModel->load(['methods', 'outlet'])->fresh();
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Shipping zone updated successfully.',
                'data' => $updatedZone,
            ]);
        }

        $targetOutletId = $updatedZone->outlet_id;
        if ($targetOutletId && ($request->route('outlet') || $request->filled('outlet_id'))) {
            return redirect()
                ->route('admin.outlets.shipping-zones.index', $targetOutletId)
                ->with('success', "Shipping zone '{$zoneModel->zone_name}' updated successfully.");
        }

        return redirect()->route('admin.shipping-zones.index')->with('success', "Shipping zone '{$zoneModel->zone_name}' updated successfully.");
    }

    /**
     * Remove the specified shipping zone from storage.
     */
    public function destroy(Request $request, ShippingZone|int|string $shippingZone, Outlet|int|string|null $outlet = null): RedirectResponse|JsonResponse
    {
        $zoneModel = $shippingZone instanceof ShippingZone ? $shippingZone : ShippingZone::findOrFail($shippingZone);
        $name = $zoneModel->zone_name;
        $outletId = $zoneModel->outlet_id;
        $zoneModel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Shipping zone '{$name}' deleted successfully.",
            ]);
        }

        if ($outletId && ($request->route('outlet') || $request->filled('outlet_id'))) {
            return redirect()
                ->route('admin.outlets.shipping-zones.index', $outletId)
                ->with('success', "Shipping zone '{$name}' deleted successfully.");
        }

        return redirect()->route('admin.shipping-zones.index')->with('success', "Shipping zone '{$name}' deleted successfully.");
    }

    /**
     * Fast toggle zone active status.
     */
    public function toggleActive(ShippingZone $shippingZone): JsonResponse|RedirectResponse
    {
        $shippingZone->update(['is_active' => ! $shippingZone->is_active]);

        return request()->wantsJson()
            ? response()->json(['success' => true, 'is_active' => $shippingZone->is_active])
            : back()->with('success', "Zone '{$shippingZone->zone_name}' status updated.");
    }
}
