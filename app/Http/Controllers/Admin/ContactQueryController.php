<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactQueryController extends Controller
{
    /**
     * Display a paginated listing of customer contact queries in descending order.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $query = ContactQuery::query();

        if ($search !== '') {
            $query->search($search);
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        // Descending order (newest first)
        $queries = $query->latest('id')->paginate($perPage)->withQueryString();

        $counts = [
            'total' => ContactQuery::count(),
            'unread' => ContactQuery::where('status', 'unread')->count(),
            'read' => ContactQuery::where('status', 'read')->count(),
            'replied' => ContactQuery::where('status', 'replied')->count(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $queries,
                'counts' => $counts,
            ]);
        }

        return Inertia::render('Admin/ContactQueries/Index', [
            'queries' => $queries,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display details of a specific contact query and mark it as read.
     */
    public function show(ContactQuery $query): JsonResponse
    {
        if ($query->status === 'unread') {
            $query->update(['status' => 'read']);
        }

        return response()->json([
            'success' => true,
            'data' => $query->fresh(),
        ]);
    }

    /**
     * Update the status or notes of a contact query.
     */
    public function updateStatus(Request $request, ContactQuery $query): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:unread,read,replied'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $query->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $query->admin_notes,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully.',
                'data' => $query->fresh(),
            ]);
        }

        return back()->with('success', 'Contact query status updated successfully.');
    }

    /**
     * Remove a contact query from the database.
     */
    public function destroy(Request $request, ContactQuery $query): RedirectResponse|JsonResponse
    {
        $query->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Contact query deleted successfully.',
            ]);
        }

        return back()->with('success', 'Contact query deleted successfully.');
    }
}
