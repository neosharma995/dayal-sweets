<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Outlet;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SalesAnalyticsController extends Controller
{
    /**
     * Display unified Website & Dine-In Sales Analytics.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $channel = (string) $request->input('channel', 'all');
        if (! in_array($channel, ['all', 'website', 'dine_in'], true)) {
            $channel = 'all';
        }

        $range = (string) $request->input('range', '30d');
        if (! in_array($range, ['7d', '30d', '90d', 'all', 'custom'], true)) {
            $range = '30d';
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $search = trim((string) $request->input('search', ''));
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $outletParam = $request->input('outlet_id');
        $sessionOutletId = $request->session()->get('active_outlet_id');
        $outletId = ($outletParam !== null && $outletParam !== '')
            ? ($outletParam === 'all' ? null : (int) $outletParam)
            : ($sessionOutletId ? (int) $sessionOutletId : null);

        // Date window calculation
        $fromDate = null;
        $toDate = null;
        if ($range === '7d') {
            $fromDate = now()->subDays(6)->startOfDay();
            $toDate = now()->endOfDay();
        } elseif ($range === '30d') {
            $fromDate = now()->subDays(29)->startOfDay();
            $toDate = now()->endOfDay();
        } elseif ($range === '90d') {
            $fromDate = now()->subDays(89)->startOfDay();
            $toDate = now()->endOfDay();
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $fromDate = Carbon::parse($startDate)->startOfDay();
            $toDate = Carbon::parse($endDate)->endOfDay();
        }

        // Base query (outlet + date range, BEFORE channel filter so channel KPIs compare Website vs Dine-In)
        $baseQuery = Order::query();
        if ($outletId) {
            $baseQuery->where('outlet_id', $outletId);
        }
        if ($fromDate && $toDate) {
            $baseQuery->whereBetween('created_at', [$fromDate, $toDate]);
        }

        $applyChannel = function (Builder $query) use ($channel): Builder {
            if ($channel === 'website') {
                return $query->where(function (Builder $q) {
                    $q->whereNull('order_type')->orWhere('order_type', '!=', 'dine_in');
                });
            }
            if ($channel === 'dine_in') {
                return $query->where('order_type', 'dine_in');
            }

            return $query;
        };

        // 1. Summary KPIs
        $nonCancelledBase = (clone $baseQuery)->where('delivery_status', '!=', 'cancelled');

        $websiteQuery = (clone $nonCancelledBase)->where(function (Builder $q) {
            $q->whereNull('order_type')->orWhere('order_type', '!=', 'dine_in');
        });
        $dineInQuery = (clone $nonCancelledBase)->where('order_type', 'dine_in');

        $websiteRevenue = (float) (clone $websiteQuery)->sum('total_amount');
        $websiteOrders = (int) (clone $websiteQuery)->count();
        $dineInRevenue = (float) (clone $dineInQuery)->sum('total_amount');
        $dineInOrders = (int) (clone $dineInQuery)->count();

        $filteredNonCancelled = $applyChannel(clone $nonCancelledBase);
        $totalRevenue = (float) (clone $filteredNonCancelled)->sum('total_amount');
        $paidRevenue = (float) (clone $filteredNonCancelled)->where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = (int) (clone $filteredNonCancelled)->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0.0;

        $filteredAll = $applyChannel(clone $baseQuery);
        $pendingOrders = (int) (clone $filteredAll)->where('delivery_status', 'pending')->count();
        $cancelledOrders = (int) (clone $filteredAll)->where('delivery_status', 'cancelled')->count();

        $summary = [
            'total_revenue' => round($totalRevenue, 2),
            'paid_revenue' => round($paidRevenue, 2),
            'total_orders' => $totalOrders,
            'avg_order_value' => $avgOrderValue,
            'website_revenue' => round($websiteRevenue, 2),
            'website_orders' => $websiteOrders,
            'dine_in_revenue' => round($dineInRevenue, 2),
            'dine_in_orders' => $dineInOrders,
            'pending_orders' => $pendingOrders,
            'cancelled_orders' => $cancelledOrders,
        ];

        // 2. Daily Website vs Dine-In Trend
        $trendOrders = $applyChannel(clone $nonCancelledBase)
            ->select(['id', 'order_type', 'total_amount', 'created_at'])
            ->orderBy('created_at')
            ->get();

        $dailyGrouped = [];
        foreach ($trendOrders as $ord) {
            $dayKey = $ord->created_at ? $ord->created_at->format('Y-m-d') : now()->format('Y-m-d');
            if (! isset($dailyGrouped[$dayKey])) {
                $dailyGrouped[$dayKey] = [
                    'date' => $dayKey,
                    'label' => $ord->created_at ? $ord->created_at->format('d M') : $dayKey,
                    'website_revenue' => 0.0,
                    'website_orders' => 0,
                    'dine_in_revenue' => 0.0,
                    'dine_in_orders' => 0,
                    'total_revenue' => 0.0,
                ];
            }
            $amt = (float) $ord->total_amount;
            if ($ord->order_type === 'dine_in') {
                $dailyGrouped[$dayKey]['dine_in_revenue'] += $amt;
                $dailyGrouped[$dayKey]['dine_in_orders']++;
            } else {
                $dailyGrouped[$dayKey]['website_revenue'] += $amt;
                $dailyGrouped[$dayKey]['website_orders']++;
            }
            $dailyGrouped[$dayKey]['total_revenue'] += $amt;
        }
        $dailySeries = array_values(array_slice($dailyGrouped, -30));

        // 3. Outlet-Wise Breakdown
        $outlets = Outlet::orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'city']);
        $outletMap = $outlets->keyBy('id');

        $outletStatsRaw = $applyChannel(clone $nonCancelledBase)
            ->select([
                'outlet_id',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_revenue'),
                DB::raw("SUM(CASE WHEN order_type = 'dine_in' THEN total_amount ELSE 0 END) as dine_in_revenue"),
                DB::raw("SUM(CASE WHEN order_type = 'dine_in' THEN 1 ELSE 0 END) as dine_in_orders"),
                DB::raw("SUM(CASE WHEN order_type IS NULL OR order_type != 'dine_in' THEN total_amount ELSE 0 END) as website_revenue"),
                DB::raw("SUM(CASE WHEN order_type IS NULL OR order_type != 'dine_in' THEN 1 ELSE 0 END) as website_orders"),
            ])
            ->groupBy('outlet_id')
            ->orderByDesc('total_revenue')
            ->get();

        $outletBreakdown = $outletStatsRaw->map(function ($row) use ($outletMap) {
            $outletObj = $row->outlet_id ? $outletMap->get((int) $row->outlet_id) : null;

            return [
                'outlet_id' => $row->outlet_id,
                'outlet_name' => $outletObj ? $outletObj->name : 'General / Unassigned',
                'city' => $outletObj?->city,
                'orders_count' => (int) $row->orders_count,
                'total_revenue' => round((float) $row->total_revenue, 2),
                'website_revenue' => round((float) $row->website_revenue, 2),
                'website_orders' => (int) $row->website_orders,
                'dine_in_revenue' => round((float) $row->dine_in_revenue, 2),
                'dine_in_orders' => (int) $row->dine_in_orders,
            ];
        })->values();

        // 4. Payment Method Breakdown
        $paymentBreakdown = $applyChannel(clone $nonCancelledBase)
            ->select([
                'payment_method',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_revenue'),
            ])
            ->groupBy('payment_method')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(fn ($r) => [
                'method' => strtoupper((string) ($r->payment_method ?: 'cod')),
                'orders_count' => (int) $r->orders_count,
                'total_revenue' => round((float) $r->total_revenue, 2),
            ])
            ->values();

        // 5. Top Selling Products
        $filteredOrderIds = (clone $filteredNonCancelled)->pluck('id');
        $topProducts = [];
        if ($filteredOrderIds->isNotEmpty()) {
            $topProducts = OrderItem::whereIn('order_id', $filteredOrderIds)
                ->select([
                    'product_name',
                    DB::raw('SUM(quantity) as units_sold'),
                    DB::raw('SUM(total) as total_revenue'),
                    DB::raw('COUNT(DISTINCT order_id) as order_appearances'),
                ])
                ->groupBy('product_name')
                ->orderByDesc('total_revenue')
                ->limit(10)
                ->get()
                ->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'units_sold' => (int) $item->units_sold,
                    'total_revenue' => round((float) $item->total_revenue, 2),
                    'orders_count' => (int) $item->order_appearances,
                ])
                ->values();
        }

        // 6. Paginated Sales Ledger
        $ledgerQuery = $applyChannel(clone $baseQuery)->with('outlet:id,name');
        if ($search !== '') {
            $ledgerQuery->where(function (Builder $q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('table_number', 'like', "%{$search}%");
            });
        }

        $orders = $ledgerQuery->latest('id')->paginate($perPage)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'summary' => $summary,
                'daily_series' => $dailySeries,
                'outlet_breakdown' => $outletBreakdown,
                'payment_breakdown' => $paymentBreakdown,
                'top_products' => $topProducts,
                'orders' => $orders,
            ]);
        }

        return Inertia::render('Admin/Analytics/Index', [
            'summary' => $summary,
            'dailySeries' => $dailySeries,
            'outletBreakdown' => $outletBreakdown,
            'paymentBreakdown' => $paymentBreakdown,
            'topProducts' => $topProducts,
            'orders' => $orders,
            'outlets' => $outlets,
            'filters' => [
                'channel' => $channel,
                'range' => $range,
                'start_date' => $startDate ?: '',
                'end_date' => $endDate ?: '',
                'outlet_id' => $outletId ? (string) $outletId : 'all',
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }
}
