<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiningQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiningQueryController extends Controller
{
    /**
     * Display a paginated listing of dining queries/reservations in descending order.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));
        $outletId = $request->input('outlet_id') ?? $request->session()->get('active_outlet_id');
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $query = DiningQuery::with('outlet');

        if ($outletId && $outletId !== 'all') {
            $query->where('outlet_id', (int) $outletId);
        }

        if ($search !== '') {
            $query->search($search);
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        // Descending order (newest first)
        $queries = $query->latest('id')->paginate($perPage)->withQueryString();

        // Compute counts with outlet scope if filtered
        $countsQuery = DiningQuery::query();
        if ($outletId && $outletId !== 'all') {
            $countsQuery->where('outlet_id', (int) $outletId);
        }

        $counts = [
            'total' => (clone $countsQuery)->count(),
            'pending' => (clone $countsQuery)->where('status', 'pending')->count(),
            'confirmed' => (clone $countsQuery)->where('status', 'confirmed')->count(),
            'completed' => (clone $countsQuery)->where('status', 'completed')->count(),
            'cancelled' => (clone $countsQuery)->where('status', 'cancelled')->count(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $queries,
                'counts' => $counts,
            ]);
        }

        return Inertia::render('Admin/DiningQueries/Index', [
            'queries' => $queries,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'outlet_id' => $outletId,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display details of a specific dining query.
     */
    public function show(DiningQuery $query): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $query->load('outlet'),
        ]);
    }

    /**
     * Update the status or admin notes of a dining query.
     */
    public function updateStatus(Request $request, DiningQuery $query): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,completed,cancelled'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $query->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $query->admin_notes,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation status updated successfully.',
                'data' => $query->fresh(['outlet']),
            ]);
        }

        return back()->with('success', 'Dining reservation status updated successfully.');
    }

    /**
     * Remove a dining query from the database.
     */
    public function destroy(Request $request, DiningQuery $query): RedirectResponse|JsonResponse
    {
        $query->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Dining query deleted successfully.',
            ]);
        }

        return back()->with('success', 'Dining query deleted successfully.');
    }
}
