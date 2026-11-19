<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use App\Models\OutletTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OutletTableController extends Controller
{
    public const DEFAULT_LOCATIONS = [
        'Main Dining Hall',
        'Ground Floor',
        'First Floor (AC Hall)',
        'Family Cabin / VIP Lounge',
        'Outdoor / Rooftop Terrace',
        'Quick Bite Counter Area',
    ];

    /**
     * Display all dining tables across outlets (or filtered by active outlet / location).
     */
    public function index(Request $request): Response|JsonResponse
    {
        if ($request->filled('outlet_id')) {
            $reqOutlet = $request->input('outlet_id');
            if ($reqOutlet === 'all') {
                $request->session()->forget('active_outlet_id');
                $outletId = 'all';
            } else {
                $outletId = (int) $reqOutlet;
                $request->session()->put('active_outlet_id', $outletId);
            }
        } else {
            $outletId = $request->session()->get('active_outlet_id', 'all');
        }
        $location = $request->input('location', 'all');
        $status = $request->input('status', 'all');
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 1 || $perPage > 100) {
            $perPage = 10;
        }

        $query = OutletTable::query()
            ->with(['outlet:id,name,slug,city,pincode'])
            ->withCount('orders')
            ->orderBy('outlet_id')
            ->orderBy('sort_order')
            ->orderBy('id');

        if ($outletId && $outletId !== 'all') {
            $query->where('outlet_id', (int) $outletId);
        }

        if ($location && $location !== 'all') {
            $query->where('location', $location);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('table_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        $tables = $query->paginate($perPage)->withQueryString();

        // Stats scoped to outlet filter if active
        $statsQuery = OutletTable::query();
        if ($outletId && $outletId !== 'all') {
            $statsQuery->where('outlet_id', (int) $outletId);
        }

        $stats = [
            'total_tables' => (clone $statsQuery)->count(),
            'total_capacity' => (int) (clone $statsQuery)->sum('capacity'),
            'available' => (clone $statsQuery)->where('status', 'available')->count(),
            'occupied' => (clone $statsQuery)->where('status', 'occupied')->count(),
            'reserved' => (clone $statsQuery)->where('status', 'reserved')->count(),
            'inactive' => (clone $statsQuery)->where('status', 'inactive')->count(),
        ];

        $dbLocations = OutletTable::query()
            ->select('location')
            ->distinct()
            ->pluck('location')
            ->filter()
            ->values()
            ->all();

        $locations = array_values(array_unique(array_merge(self::DEFAULT_LOCATIONS, $dbLocations)));
        $outlets = Outlet::withCount('tables')->orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug', 'city', 'status']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $tables,
                'stats' => $stats,
                'locations' => $locations,
            ]);
        }

        return Inertia::render('Admin/Tables/Index', [
            'tables' => $tables,
            'outlets' => $outlets,
            'locations' => $locations,
            'stats' => $stats,
            'filters' => [
                'outlet_id' => $outletId ?: 'all',
                'location' => $location,
                'status' => $status,
                'search' => $search,
                'per_page' => $perPage,
                'page' => (int) $request->input('page', 1),
            ],
        ]);
    }

    /**
     * Show the form for creating a new dining table.
     */
    public function create(Request $request): Response
    {
        $defaultOutletId = $request->input('outlet_id') ?? $request->session()->get('active_outlet_id');
        $outlets = Outlet::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug', 'city', 'status']);

        $dbLocations = OutletTable::query()
            ->select('location')
            ->distinct()
            ->pluck('location')
            ->filter()
            ->values()
            ->all();
        $locations = array_values(array_unique(array_merge(self::DEFAULT_LOCATIONS, $dbLocations)));

        return Inertia::render('Admin/Tables/Create', [
            'outlets' => $outlets,
            'locations' => $locations,
            'defaultOutletId' => $defaultOutletId ? (int) $defaultOutletId : ($outlets->first()?->id ?? null),
        ]);
    }

    /**
     * Store a newly created dining table in storage.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'outlet_id' => ['required', 'integer', 'exists:outlets,id'],
            'table_number' => ['required', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:120'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'location' => ['required', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'in:available,occupied,reserved,inactive'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $outletId = (int) $validated['outlet_id'];
        $tableNumber = trim($validated['table_number']);
        $name = ! empty($validated['name']) ? trim($validated['name']) : "Table {$tableNumber}";
        $status = $validated['status'] ?? 'available';

        $table = OutletTable::create([
            'outlet_id' => $outletId,
            'table_number' => $tableNumber,
            'name' => $name,
            'capacity' => (int) $validated['capacity'],
            'location' => trim($validated['location']),
            'qr_token' => OutletTable::generateUniqueToken($outletId, $tableNumber),
            'status' => $status,
            'is_active' => $status !== 'inactive',
            'notes' => $validated['notes'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? ((OutletTable::where('outlet_id', $outletId)->max('sort_order') ?? 0) + 1)),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Dining table '{$table->name}' created with QR scanner.",
                'data' => $table->load('outlet'),
            ], 201);
        }

        if ($request->boolean('return_back')) {
            return redirect()->back()->with('success', "Dining table '{$table->name}' created with QR scanner.");
        }

        return redirect()
            ->route('admin.tables.index')
            ->with('success', "Dining table '{$table->name}' ({$table->capacity} seats • {$table->location}) created with QR scanner.");
    }

    /**
     * Show the form for editing a dining table.
     */
    public function edit(OutletTable $table): Response
    {
        $table->load('outlet:id,name,slug,city');
        $outlets = Outlet::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug', 'city', 'status']);

        $dbLocations = OutletTable::query()
            ->select('location')
            ->distinct()
            ->pluck('location')
            ->filter()
            ->values()
            ->all();
        $locations = array_values(array_unique(array_merge(self::DEFAULT_LOCATIONS, $dbLocations)));

        return Inertia::render('Admin/Tables/Edit', [
            'table' => $table,
            'outlets' => $outlets,
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified dining table in storage.
     */
    public function update(Request $request, OutletTable $table): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'outlet_id' => ['required', 'integer', 'exists:outlets,id'],
            'table_number' => ['required', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:120'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'location' => ['required', 'string', 'max:120'],
            'status' => ['required', 'string', 'in:available,occupied,reserved,inactive'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $tableNumber = trim($validated['table_number']);
        $name = ! empty($validated['name']) ? trim($validated['name']) : "Table {$tableNumber}";

        $table->update([
            'outlet_id' => (int) $validated['outlet_id'],
            'table_number' => $tableNumber,
            'name' => $name,
            'capacity' => (int) $validated['capacity'],
            'location' => trim($validated['location']),
            'status' => $validated['status'],
            'is_active' => $validated['status'] !== 'inactive',
            'notes' => $validated['notes'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? $table->sort_order),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Table '{$table->name}' updated successfully.",
                'data' => $table->fresh('outlet'),
            ]);
        }

        if ($request->boolean('return_back')) {
            return redirect()->back()->with('success', "Table '{$table->name}' updated successfully.");
        }

        return redirect()
            ->route('admin.tables.index')
            ->with('success', "Table '{$table->name}' updated successfully.");
    }

    /**
     * Quick toggle table status (available / occupied / reserved / inactive).
     */
    public function updateStatus(Request $request, OutletTable $table): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:available,occupied,reserved,inactive'],
        ]);

        $table->update([
            'status' => $validated['status'],
            'is_active' => $validated['status'] !== 'inactive',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Table '{$table->name}' marked as {$validated['status']}.",
                'data' => $table,
            ]);
        }

        return redirect()->back()->with('success', "Table '{$table->name}' status updated to " . ucfirst($validated['status']) . '.');
    }

    /**
     * Regenerate a fresh QR scanner token for the table.
     */
    public function regenerateQr(Request $request, OutletTable $table): RedirectResponse|JsonResponse
    {
        $table->update([
            'qr_token' => OutletTable::generateUniqueToken($table->outlet_id, $table->table_number),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "New QR scanner generated for '{$table->name}'.",
                'data' => $table->fresh(),
            ]);
        }

        return redirect()->back()->with('success', "New QR scanner generated for '{$table->name}'.");
    }

    /**
     * Remove the specified dining table.
     */
    public function destroy(Request $request, OutletTable $table): RedirectResponse|JsonResponse
    {
        $name = $table->name;
        $table->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Table '{$name}' deleted successfully.",
            ]);
        }

        return redirect()->back()->with('success', "Table '{$name}' deleted successfully.");
    }

    /**
     * Display the QR Scanners & Printable Standees hub for all tables.
     */
    public function scanners(Request $request): Response
    {
        if ($request->filled('outlet_id')) {
            $reqOutlet = $request->input('outlet_id');
            if ($reqOutlet === 'all') {
                $request->session()->forget('active_outlet_id');
                $outletId = 'all';
            } else {
                $outletId = (int) $reqOutlet;
                $request->session()->put('active_outlet_id', $outletId);
            }
        } else {
            $outletId = $request->session()->get('active_outlet_id', 'all');
        }
        $location = $request->input('location', 'all');

        $query = OutletTable::query()
            ->with(['outlet:id,name,slug,city,pincode,phone'])
            ->where('is_active', true)
            ->orderBy('outlet_id')
            ->orderBy('sort_order')
            ->orderBy('id');

        if ($outletId && $outletId !== 'all') {
            $query->where('outlet_id', (int) $outletId);
        }

        if ($location && $location !== 'all') {
            $query->where('location', $location);
        }

        $tables = $query->get();
        $outlets = Outlet::withCount('tables')->orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'slug', 'city']);
        $dbLocations = OutletTable::query()->select('location')->distinct()->pluck('location')->filter()->values()->all();
        $locations = array_values(array_unique(array_merge(self::DEFAULT_LOCATIONS, $dbLocations)));

        return Inertia::render('Admin/Tables/Scanners', [
            'tables' => $tables,
            'outlets' => $outlets,
            'locations' => $locations,
            'filters' => [
                'outlet_id' => $outletId ?: 'all',
                'location' => $location,
            ],
        ]);
    }
}
