<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxRateController extends Controller
{
    /**
     * Display a listing of all tax rates (get_all).
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = TaxRate::query()->withCount('products')->orderBy('priority')->orderBy('rate');

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('tax_class', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $taxRates = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tax rates retrieved successfully.',
                'count' => $taxRates->count(),
                'data' => $taxRates,
            ]);
        }

        return Inertia::render('Admin/TaxRates/Index', [
            'taxRates' => $taxRates,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new tax rate.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/TaxRates/Create');
    }

    /**
     * Store a newly created tax rate (create).
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:tax_rates,code'],
            'rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'type' => ['nullable', 'string', 'in:percent,fixed'],
            'tax_class' => ['nullable', 'string', 'in:standard,reduced_rate,zero_rate'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'is_compound' => ['nullable', 'boolean'],
            'apply_to_shipping' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:1'],
        ]);

        $validated['type'] = $validated['type'] ?? 'percent';
        $validated['tax_class'] = $validated['tax_class'] ?? 'standard';
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['is_compound'] = $validated['is_compound'] ?? false;
        $validated['apply_to_shipping'] = $validated['apply_to_shipping'] ?? false;
        $validated['priority'] = $validated['priority'] ?? 1;

        $taxRate = TaxRate::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tax rate created successfully.',
                'data' => $taxRate->fresh(),
            ], 201);
        }

        return redirect()->route('admin.taxes.index')->with('success', "Tax rate '{$taxRate->name}' ({$taxRate->rate}%) created successfully.");
    }

    /**
     * Display a single tax rate by ID (getbyid).
     */
    public function show(Request $request, TaxRate|int|string $tax): Response|JsonResponse
    {
        $taxRateModel = $tax instanceof TaxRate ? $tax : TaxRate::findOrFail($tax);
        $taxRateModel->loadCount('products');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tax rate retrieved successfully.',
                'data' => $taxRateModel,
            ]);
        }

        return Inertia::render('Admin/TaxRates/Show', [
            'taxRate' => $taxRateModel,
        ]);
    }

    /**
     * Show the form for editing an existing tax rate.
     */
    public function edit(TaxRate|int|string $tax): Response
    {
        $taxRateModel = $tax instanceof TaxRate ? $tax : TaxRate::findOrFail($tax);
        $taxRateModel->loadCount('products');

        return Inertia::render('Admin/TaxRates/Edit', [
            'taxRate' => $taxRateModel,
        ]);
    }

    /**
     * Update an existing tax rate (update).
     */
    public function update(Request $request, TaxRate|int|string $tax): RedirectResponse|JsonResponse
    {
        $taxRateModel = $tax instanceof TaxRate ? $tax : TaxRate::findOrFail($tax);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:tax_rates,code,' . $taxRateModel->id],
            'rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'type' => ['nullable', 'string', 'in:percent,fixed'],
            'tax_class' => ['nullable', 'string', 'in:standard,reduced_rate,zero_rate'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'is_compound' => ['nullable', 'boolean'],
            'apply_to_shipping' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:1'],
        ]);

        $validated['type'] = $validated['type'] ?? 'percent';
        $validated['tax_class'] = $validated['tax_class'] ?? 'standard';
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['is_compound'] = $validated['is_compound'] ?? false;
        $validated['apply_to_shipping'] = $validated['apply_to_shipping'] ?? false;
        $validated['priority'] = $validated['priority'] ?? 1;

        $taxRateModel->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tax rate updated successfully.',
                'data' => $taxRateModel->fresh(),
            ]);
        }

        return redirect()->route('admin.taxes.index')->with('success', "Tax rate '{$taxRateModel->name}' updated successfully.");
    }

    /**
     * Remove the specified tax rate from storage (delete).
     */
    public function destroy(Request $request, TaxRate|int|string $tax): RedirectResponse|JsonResponse
    {
        $taxRateModel = $tax instanceof TaxRate ? $tax : TaxRate::findOrFail($tax);
        $name = $taxRateModel->name;
        $taxRateModel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Tax rate '{$name}' deleted successfully.",
            ]);
        }

        return redirect()->route('admin.taxes.index')->with('success', "Tax rate '{$name}' deleted successfully.");
    }

    /**
     * Fast toggle tax rate active status.
     */
    public function toggleActive(TaxRate $tax): JsonResponse|RedirectResponse
    {
        $tax->update(['is_active' => ! $tax->is_active]);

        return request()->wantsJson()
            ? response()->json(['success' => true, 'is_active' => $tax->is_active])
            : back()->with('success', "Tax '{$tax->name}' status updated.");
    }
}
