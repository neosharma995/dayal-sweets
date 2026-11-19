<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Outlet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    /**
     * Display a paginated listing of coupons with outlet & rule filtering.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));
        $outletFilter = $request->input('outlet_filter', 'all');
        $sessionOutletId = $request->session()->get('active_outlet_id');
        $type = trim((string) $request->input('type', 'all'));
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $query = Coupon::with(['outlet', 'outlets']);

        // Search by code or description
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        $now = now();
        if ($status === 'active') {
            $query->where('is_active', true)
                ->where(function ($q) use ($now) {
                    $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>=', $now);
                });
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'expired') {
            $query->whereNotNull('expires_at')->where('expires_at', '<', $now);
        }

        // Outlet scope filter: all, global, or specific outlet
        if ($outletFilter === 'global') {
            $query->where('is_global', true);
        } elseif ($outletFilter === 'outlet_specific') {
            $query->where('is_global', false);
        } elseif (is_numeric($outletFilter) && (int) $outletFilter > 0) {
            $id = (int) $outletFilter;
            $query->where(function ($q) use ($id) {
                $q->where('outlet_id', $id)
                    ->orWhereHas('outlets', function ($sub) use ($id) {
                        $sub->where('outlets.id', $id);
                    });
            });
        } elseif ($sessionOutletId && ! $request->has('outlet_filter')) {
            // Respect active outlet switcher if no explicit filter is selected
            $id = (int) $sessionOutletId;
            $query->where(function ($q) use ($id) {
                $q->where('is_global', true)
                    ->orWhere('outlet_id', $id)
                    ->orWhereHas('outlets', function ($sub) use ($id) {
                        $sub->where('outlets.id', $id);
                    });
            });
        }

        // Discount type filter
        if ($type === 'percentage' || $type === 'fixed') {
            $query->where('discount_type', $type);
        }

        $coupons = $query->orderByDesc('id')->paginate($perPage)->withQueryString();

        // High-level statistics
        $stats = [
            'total' => Coupon::count(),
            'active' => Coupon::active()->count(),
            'global' => Coupon::where('is_global', true)->count(),
            'outlet_specific' => Coupon::where('is_global', false)->count(),
            'total_used' => (int) Coupon::sum('used_count'),
        ];

        // Active outlets for assignment
        $outlets = Outlet::where('is_active', true)->select('id', 'name', 'city')->orderBy('name')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'coupons' => $coupons,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'stats' => $stats,
            'outlets' => $outlets,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'outlet_filter' => $outletFilter,
                'type' => $type,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created coupon in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:coupons,code'],
            'description' => ['nullable', 'string', 'max:255'],
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('discount_type') === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'is_global' => ['required', 'boolean'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'outlet_ids' => ['nullable', 'array'],
            'outlet_ids.*' => ['exists:outlets,id'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $outletIds = $validated['outlet_ids'] ?? [];
        unset($validated['outlet_ids']);

        // If marked global, clear outlet relations
        if ($validated['is_global']) {
            $validated['outlet_id'] = null;
        } elseif (! empty($outletIds) && empty($validated['outlet_id'])) {
            $validated['outlet_id'] = $outletIds[0];
        }

        $coupon = Coupon::create($validated);

        if (! $coupon->is_global && ! empty($outletIds)) {
            $coupon->outlets()->sync($outletIds);
        } elseif (! $coupon->is_global && $coupon->outlet_id) {
            $coupon->outlets()->sync([$coupon->outlet_id]);
        }

        return redirect()->back()->with('success', "Coupon '{$coupon->code}' created successfully.");
    }

    /**
     * Update the specified coupon in storage.
     */
    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($coupon->id)],
            'description' => ['nullable', 'string', 'max:255'],
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('discount_type') === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'is_global' => ['required', 'boolean'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'outlet_ids' => ['nullable', 'array'],
            'outlet_ids.*' => ['exists:outlets,id'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $outletIds = $validated['outlet_ids'] ?? [];
        unset($validated['outlet_ids']);

        if ($validated['is_global']) {
            $validated['outlet_id'] = null;
            $coupon->outlets()->detach();
        } else {
            if (! empty($outletIds) && empty($validated['outlet_id'])) {
                $validated['outlet_id'] = $outletIds[0];
            }
            $syncList = ! empty($outletIds) ? $outletIds : ($validated['outlet_id'] ? [$validated['outlet_id']] : []);
            $coupon->outlets()->sync($syncList);
        }

        $coupon->update($validated);

        return redirect()->back()->with('success', "Coupon '{$coupon->code}' updated successfully.");
    }

    /**
     * Remove the specified coupon from storage.
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        $code = $coupon->code;
        $coupon->delete();

        return redirect()->back()->with('success', "Coupon '{$code}' deleted successfully.");
    }

    /**
     * Toggle the active status of a coupon.
     */
    public function toggleStatus(Coupon $coupon): RedirectResponse
    {
        $coupon->update(['is_active' => ! $coupon->is_active]);
        $status = $coupon->is_active ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "Coupon '{$coupon->code}' has been {$status}.");
    }

    /**
     * Bulk actions on multiple selected coupons (Activate, Deactivate, Delete, Assign Outlet, Make Global).
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete', 'assign_outlet', 'make_global'])],
            'coupon_ids' => ['required', 'array', 'min:1'],
            'coupon_ids.*' => ['exists:coupons,id'],
            'target_outlet_id' => ['nullable', 'exists:outlets,id'],
        ]);

        $ids = $validated['coupon_ids'];
        $action = $validated['action'];
        $count = count($ids);

        if ($action === 'activate') {
            Coupon::whereIn('id', $ids)->update(['is_active' => true]);
            $msg = "{$count} coupon(s) activated successfully.";
        } elseif ($action === 'deactivate') {
            Coupon::whereIn('id', $ids)->update(['is_active' => false]);
            $msg = "{$count} coupon(s) deactivated successfully.";
        } elseif ($action === 'delete') {
            Coupon::whereIn('id', $ids)->delete();
            $msg = "{$count} coupon(s) permanently deleted.";
        } elseif ($action === 'make_global') {
            Coupon::whereIn('id', $ids)->update([
                'is_global' => true,
                'outlet_id' => null,
            ]);
            // Detach pivot
            foreach (Coupon::whereIn('id', $ids)->get() as $c) {
                $c->outlets()->detach();
            }
            $msg = "{$count} coupon(s) converted to Global (all outlets).";
        } elseif ($action === 'assign_outlet') {
            $outletId = $validated['target_outlet_id'] ?? null;
            if (! $outletId) {
                return redirect()->back()->with('error', 'Please select an outlet for bulk assignment.');
            }
            $outlet = Outlet::find($outletId);
            Coupon::whereIn('id', $ids)->update([
                'is_global' => false,
                'outlet_id' => $outletId,
            ]);
            foreach (Coupon::whereIn('id', $ids)->get() as $c) {
                $c->outlets()->sync([$outletId]);
            }
            $outletName = $outlet?->name ?? 'Outlet';
            $msg = "{$count} coupon(s) assigned to {$outletName}.";
        } else {
            $msg = 'Action completed.';
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Bulk rule generator: generates multiple unique coupon codes under a batch rule.
     */
    public function generateBulk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prefix' => ['required', 'string', 'max:20', 'regex:/^[A-Z0-9_-]+$/i'],
            'count' => ['required', 'integer', 'min:1', 'max:50'],
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'is_global' => ['required', 'boolean'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
        ]);

        $prefix = strtoupper(trim($validated['prefix']));
        $count = (int) $validated['count'];
        $created = 0;

        for ($i = 0; $i < $count; $i++) {
            $uniqueCode = $prefix . '-' . strtoupper(Str::random(6));
            while (Coupon::where('code', $uniqueCode)->exists()) {
                $uniqueCode = $prefix . '-' . strtoupper(Str::random(6));
            }

            $coupon = Coupon::create([
                'code' => $uniqueCode,
                'description' => "Bulk Batch: {$prefix}",
                'discount_type' => $validated['discount_type'],
                'discount_value' => $validated['discount_value'],
                'min_order_amount' => $validated['min_order_amount'] ?? null,
                'max_discount_amount' => $validated['max_discount_amount'] ?? null,
                'is_global' => $validated['is_global'],
                'outlet_id' => $validated['is_global'] ? null : ($validated['outlet_id'] ?? null),
                'starts_at' => now(),
                'expires_at' => $validated['expires_at'] ?? null,
                'usage_limit' => $validated['usage_limit'] ?? 1,
                'usage_limit_per_user' => $validated['usage_limit_per_user'] ?? 1,
                'is_active' => true,
            ]);

            if (! $coupon->is_global && $coupon->outlet_id) {
                $coupon->outlets()->sync([$coupon->outlet_id]);
            }

            $created++;
        }

        return redirect()->back()->with('success', "Successfully generated {$created} unique coupons with prefix '{$prefix}'.");
    }
}
