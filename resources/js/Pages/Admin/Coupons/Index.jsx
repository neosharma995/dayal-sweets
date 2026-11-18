import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CouponsIndex({ coupons, stats, outlets, filters }) {
    const { flash } = usePage().props || {};

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [outletFilter, setOutletFilter] = useState(filters.outlet_filter || 'all');
    const [type, setType] = useState(filters.type || 'all');

    // Selection for bulk actions
    const [selectedIds, setSelectedIds] = useState([]);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBulkGenModal, setShowBulkGenModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    // Form state for Create / Edit
    const initialFormState = {
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        max_discount_amount: '',
        is_global: true,
        outlet_ids: [],
        starts_at: '',
        expires_at: '',
        usage_limit: '',
        usage_limit_per_user: 1,
        is_active: true,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Bulk Generator Form State
    const [bulkGenData, setBulkGenData] = useState({
        prefix: 'FESTIVE',
        count: 10,
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 500,
        max_discount_amount: 150,
        is_global: true,
        outlet_id: '',
        expires_at: '',
        usage_limit: 1,
        usage_limit_per_user: 1,
    });

    // Handle Filter Submissions
    const applyFilters = (newOverrides = {}) => {
        router.get(
            route('admin.coupons.index'),
            {
                search,
                status,
                outlet_filter: outletFilter,
                type,
                ...newOverrides,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setOutletFilter('all');
        setType('all');
        router.get(route('admin.coupons.index'), {}, { preserveState: true });
    };

    // Row selection for bulk actions
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(coupons.data.map((c) => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Bulk actions
    const handleExecuteBulkAction = (action, targetOutletId = null) => {
        if (selectedIds.length === 0) return;
        if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} selected coupon(s)?`)) {
            return;
        }

        router.post(
            route('admin.coupons.bulk-action'),
            {
                action,
                coupon_ids: selectedIds,
                target_outlet_id: targetOutletId,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    // Toggle single status
    const handleToggleStatus = (coupon) => {
        router.patch(route('admin.coupons.toggle-status', coupon.id), {}, { preserveScroll: true });
    };

    // Delete single coupon
    const handleDeleteCoupon = (coupon) => {
        if (confirm(`Delete coupon '${coupon.code}'?`)) {
            router.delete(route('admin.coupons.destroy', coupon.id), { preserveScroll: true });
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            min_order_amount: coupon.min_order_amount || '',
            max_discount_amount: coupon.max_discount_amount || '',
            is_global: !!coupon.is_global,
            outlet_ids: coupon.outlets?.map((o) => o.id) || (coupon.outlet_id ? [coupon.outlet_id] : []),
            starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
            expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
            usage_limit: coupon.usage_limit || '',
            usage_limit_per_user: coupon.usage_limit_per_user || 1,
            is_active: !!coupon.is_active,
        });
        setFormErrors({});
        setShowEditModal(true);
    };

    // Submit Create or Edit Form
    const handleSaveCoupon = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        const payload = {
            ...formData,
            code: formData.code.toUpperCase().trim(),
            outlet_ids: formData.is_global ? [] : formData.outlet_ids,
            outlet_id: (!formData.is_global && formData.outlet_ids.length > 0) ? formData.outlet_ids[0] : null,
        };

        if (editingCoupon) {
            router.put(route('admin.coupons.update', editingCoupon.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditingCoupon(null);
                    setFormData(initialFormState);
                },
                onError: (errors) => setFormErrors(errors),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.coupons.store'), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    setFormData(initialFormState);
                },
                onError: (errors) => setFormErrors(errors),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    // Submit Bulk Generator
    const handleSaveBulkGenerator = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(route('admin.coupons.generate-bulk'), bulkGenData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowBulkGenModal(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Discount Coupons & Outlet Rules - Dayal Sweets Admin" />

            <div className="dayal-admin-content-container" style={{ padding: '1.5rem 2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Discount Coupons &amp; Outlet Rules
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Create and manage Global or Outlet-specific promotional coupons with automated rules and bulk generators.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setShowBulkGenModal(true)}
                            style={{
                                background: '#F1F5F9',
                                color: '#334155',
                                border: '1px solid #CBD5E1',
                                borderRadius: '0.5rem',
                                padding: '0.6rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span>⚡ Bulk Generator</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setEditingCoupon(null);
                                setFormData(initialFormState);
                                setFormErrors({});
                                setShowCreateModal(true);
                            }}
                            style={{
                                background: '#B88E4B',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '0.5rem',
                                padding: '0.6rem 1.25rem',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                            }}
                        >
                            <span>+ Create Coupon</span>
                        </button>
                    </div>
                </div>

                {/* Metric Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Coupons</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>{stats.total}</div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Now</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>{stats.active}</div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#2563EB', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Global (All Outlets)</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>{stats.global}</div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Outlet-Specific</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginTop: '0.35rem' }}>{stats.outlet_specific}</div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Redemptions</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>{stats.total_used}</div>
                    </div>
                </div>

                {/* Filter Controls Bar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                >
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search Input */}
                        <div style={{ flex: '1 1 220px', minWidth: '200px' }}>
                            <input
                                type="text"
                                placeholder="Search by Code or Description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#F8FAFC',
                                }}
                            />
                        </div>

                        {/* Outlet Filter */}
                        <div style={{ minWidth: '180px' }}>
                            <select
                                value={outletFilter}
                                onChange={(e) => {
                                    setOutletFilter(e.target.value);
                                    applyFilters({ outlet_filter: e.target.value });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Outlet Scopes</option>
                                <option value="global">Global (All Outlets)</option>
                                <option value="outlet_specific">Any Outlet-Specific</option>
                                <optgroup label="Specific Outlets">
                                    {outlets.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name} ({o.city})
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div style={{ minWidth: '140px' }}>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    applyFilters({ status: e.target.value });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Now</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div style={{ minWidth: '140px' }}>
                            <select
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    applyFilters({ type: e.target.value });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.875rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Types</option>
                                <option value="percentage">% Percentage</option>
                                <option value="fixed">₹ Fixed Amount</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            style={{
                                padding: '0.55rem 1rem',
                                background: '#0F172A',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Filter
                        </button>

                        {(search || status !== 'all' || outletFilter !== 'all' || type !== 'all') && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                style={{
                                    padding: '0.55rem 0.85rem',
                                    background: 'transparent',
                                    color: '#64748B',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* Bulk Actions Floating / Active Bar */}
                {selectedIds.length > 0 && (
                    <div
                        style={{
                            background: '#1E293B',
                            color: '#FFFFFF',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            ✓ {selectedIds.length} coupon(s) selected
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => handleExecuteBulkAction('activate')}
                                style={{ padding: '0.4rem 0.75rem', background: '#059669', color: '#FFF', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Activate
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteBulkAction('deactivate')}
                                style={{ padding: '0.4rem 0.75rem', background: '#475569', color: '#FFF', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Deactivate
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteBulkAction('make_global')}
                                style={{ padding: '0.4rem 0.75rem', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Make Global
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteBulkAction('delete')}
                                style={{ padding: '0.4rem 0.75rem', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                style={{ padding: '0.4rem 0.6rem', background: 'transparent', color: '#94A3B8', border: '1px solid #475569', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                Deselect
                            </button>
                        </div>
                    </div>
                )}

                {/* Coupons Table */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1rem', width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={coupons.data.length > 0 && selectedIds.length === coupons.data.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Coupon Code</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Discount &amp; Limits</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Outlet Scope</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Validity</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Usages</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                            <div style={{ fontWeight: 600, color: '#475569' }}>No coupons found matching your criteria.</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Create a new coupon or adjust your filters above.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    coupons.data.map((c) => {
                                        const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
                                        const isSelected = selectedIds.includes(c.id);

                                        return (
                                            <tr
                                                key={c.id}
                                                style={{
                                                    borderBottom: '1px solid #F1F5F9',
                                                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                                                    transition: 'background 0.15s ease',
                                                }}
                                            >
                                                {/* Checkbox */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleToggleSelectRow(c.id)}
                                                    />
                                                </td>

                                                {/* Code & Description */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span
                                                            style={{
                                                                fontFamily: 'monospace',
                                                                fontWeight: 800,
                                                                color: '#B88E4B',
                                                                background: '#FEF3C7',
                                                                padding: '0.2rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.875rem',
                                                                letterSpacing: '0.05em',
                                                            }}
                                                        >
                                                            {c.code}
                                                        </span>
                                                    </div>
                                                    {c.description && (
                                                        <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '0.25rem', maxWidth: '240px' }}>
                                                            {c.description}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Discount & Limits */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                                        {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                        {c.min_order_amount ? `Min Order: ₹${c.min_order_amount}` : 'No Min Order'}
                                                        {c.discount_type === 'percentage' && c.max_discount_amount && (
                                                            <span> • Max Cap: ₹{c.max_discount_amount}</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Outlet Scope */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    {c.is_global ? (
                                                        <span
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                background: '#EFF6FF',
                                                                color: '#1D4ED8',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                padding: '0.2rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                            }}
                                                        >
                                                            All Outlets (Global)
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <span
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    background: '#FEF3C7',
                                                                    color: '#B45309',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    padding: '0.2rem 0.5rem',
                                                                    borderRadius: '0.25rem',
                                                                }}
                                                            >
                                                                {c.outlets && c.outlets.length > 0
                                                                    ? c.outlets.map((o) => o.name).join(', ')
                                                                    : (c.outlet?.name || 'Specific Outlet')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Validity */}
                                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.785rem' }}>
                                                    {c.expires_at ? (
                                                        <div>
                                                            <div style={{ color: isExpired ? '#DC2626' : '#334155', fontWeight: 500 }}>
                                                                Exp: {new Date(c.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </div>
                                                            {isExpired && (
                                                                <span style={{ color: '#DC2626', fontSize: '0.7rem', fontWeight: 700 }}>
                                                                    EXPIRED
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#059669', fontWeight: 600 }}>Never Expires</span>
                                                    )}
                                                </td>

                                                {/* Usage Count */}
                                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                                                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{c.used_count || 0}</span>
                                                    {c.usage_limit && (
                                                        <span style={{ color: '#64748B' }}> / {c.usage_limit}</span>
                                                    )}
                                                    <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '0.15rem' }}>
                                                        Max {c.usage_limit_per_user || 1}/user
                                                    </div>
                                                </td>

                                                {/* Status Toggle */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(c)}
                                                        style={{
                                                            border: 'none',
                                                            background: c.is_active ? '#DCFCE7' : '#F1F5F9',
                                                            color: c.is_active ? '#15803D' : '#64748B',
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                        }}
                                                        title="Click to toggle active status"
                                                    >
                                                        {c.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEdit(c)}
                                                            style={{
                                                                background: '#F8FAFC',
                                                                border: '1px solid #CBD5E1',
                                                                color: '#334155',
                                                                borderRadius: '0.25rem',
                                                                padding: '0.3rem 0.55rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteCoupon(c)}
                                                            style={{
                                                                background: '#FEF2F2',
                                                                border: '1px solid #FECACA',
                                                                color: '#DC2626',
                                                                borderRadius: '0.25rem',
                                                                padding: '0.3rem 0.55rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {coupons.links && coupons.links.length > 3 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                            <div style={{ color: '#64748B' }}>
                                Showing {coupons.from || 0} to {coupons.to || 0} of {coupons.total} coupons
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {coupons.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '0.25rem',
                                            textDecoration: 'none',
                                            border: '1px solid',
                                            borderColor: link.active ? '#B88E4B' : '#E2E8F0',
                                            background: link.active ? '#B88E4B' : '#FFFFFF',
                                            color: link.active ? '#FFFFFF' : link.url ? '#334155' : '#94A3B8',
                                            pointerEvents: link.url ? 'auto' : 'none',
                                            fontWeight: link.active ? 700 : 500,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal: Create / Edit Coupon */}
                {(showCreateModal || showEditModal) && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem',
                        }}
                    >
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '0.75rem',
                                maxWidth: '600px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                padding: '1.75rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Discount Coupon'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setShowEditModal(false);
                                    }}
                                    style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveCoupon}>
                                {/* Code & Discount Type */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Coupon Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. DIWALI20"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            style={{
                                                width: '100%',
                                                padding: '0.55rem',
                                                border: formErrors.code ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                                borderRadius: '0.375rem',
                                                fontWeight: 700,
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                        {formErrors.code && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.code}</span>}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Discount Type *
                                        </label>
                                        <select
                                            value={formData.discount_type}
                                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        >
                                            <option value="percentage">Percentage Discount (%)</option>
                                            <option value="fixed">Fixed Cart Discount (₹)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Discount Value & Min Order */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={formData.discount_type === 'percentage' ? 100 : 99999}
                                            required
                                            placeholder={formData.discount_type === 'percentage' ? 'e.g. 15' : 'e.g. 50'}
                                            value={formData.discount_value}
                                            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: formErrors.discount_value ? '1px solid #DC2626' : '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        />
                                        {formErrors.discount_value && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.discount_value}</span>}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Min Order Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g. 500 (optional)"
                                            value={formData.min_order_amount}
                                            onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>

                                {formData.discount_type === 'percentage' && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Max Discount Cap (₹) (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g. 200 (Caps discount amount at ₹200 max)"
                                            value={formData.max_discount_amount}
                                            onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                )}

                                {/* Outlet Scope Selection */}
                                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                                        Outlet Scope (Where is this coupon valid?)
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                            <input
                                                type="radio"
                                                name="scope"
                                                checked={formData.is_global}
                                                onChange={() => setFormData({ ...formData, is_global: true, outlet_ids: [] })}
                                            />
                                            <span><strong>Global</strong> (All Outlets &amp; Website)</span>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                            <input
                                                type="radio"
                                                name="scope"
                                                checked={!formData.is_global}
                                                onChange={() => setFormData({ ...formData, is_global: false })}
                                            />
                                            <span><strong>Outlet-Specific</strong> (Select Outlets)</span>
                                        </label>
                                    </div>

                                    {!formData.is_global && (
                                        <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '0.75rem' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem', fontWeight: 600 }}>
                                                Select Outlets Applicable:
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                                                {outlets.map((outlet) => {
                                                    const checked = formData.outlet_ids.includes(outlet.id);
                                                    return (
                                                        <label
                                                            key={outlet.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem',
                                                                padding: '0.4rem 0.6rem',
                                                                background: checked ? '#EFF6FF' : '#FFFFFF',
                                                                border: checked ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData({ ...formData, outlet_ids: [...formData.outlet_ids, outlet.id] });
                                                                    } else {
                                                                        setFormData({ ...formData, outlet_ids: formData.outlet_ids.filter((id) => id !== outlet.id) });
                                                                    }
                                                                }}
                                                            />
                                                            <span>{outlet.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Start and Expiry Dates */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Starts At (Optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.starts_at}
                                            onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Expires At (Optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.expires_at}
                                            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Usage Limits */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Total Usage Limit
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Unlimited if empty"
                                            value={formData.usage_limit}
                                            onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Usage Limit Per Customer
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.usage_limit_per_user}
                                            onChange={(e) => setFormData({ ...formData, usage_limit_per_user: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Description / Public Note (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10% off for festival season"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                                    />
                                </div>

                                {/* Active Checkbox */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <span>Coupon is Active &amp; Ready to Use</span>
                                    </label>
                                </div>

                                {/* Form Submit Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setShowEditModal(false);
                                        }}
                                        style={{ padding: '0.6rem 1.25rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            padding: '0.6rem 1.5rem',
                                            background: '#B88E4B',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            fontWeight: 700,
                                            cursor: submitting ? 'wait' : 'pointer',
                                            boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                                        }}
                                    >
                                        {submitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal: Bulk Generator */}
                {showBulkGenModal && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem',
                        }}
                    >
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '0.75rem',
                                maxWidth: '560px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                padding: '1.75rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                        ⚡ Bulk Coupon Generator
                                    </h3>
                                    <p style={{ color: '#64748B', fontSize: '0.785rem', marginTop: '0.2rem' }}>
                                        Instantly generate a batch of unique, single-use or multi-use coupons.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowBulkGenModal(false)}
                                    style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSaveBulkGenerator}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Code Prefix *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={bulkGenData.prefix}
                                            onChange={(e) => setBulkGenData({ ...bulkGenData, prefix: e.target.value.toUpperCase() })}
                                            placeholder="e.g. DIWALI"
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontWeight: 700, fontFamily: 'monospace' }}
                                        />
                                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Produces: {bulkGenData.prefix || 'PREFIX'}-XXXXXX</span>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Quantity (1–50) *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            required
                                            value={bulkGenData.count}
                                            onChange={(e) => setBulkGenData({ ...bulkGenData, count: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Discount Type
                                        </label>
                                        <select
                                            value={bulkGenData.discount_type}
                                            onChange={(e) => setBulkGenData({ ...bulkGenData, discount_type: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem' }}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Discount Value *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            value={bulkGenData.discount_value}
                                            onChange={(e) => setBulkGenData({ ...bulkGenData, discount_value: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Min Order (₹)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={bulkGenData.min_order_amount}
                                            onChange={(e) => setBulkGenData({ ...bulkGenData, min_order_amount: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Scope
                                        </label>
                                        <select
                                            value={bulkGenData.is_global ? 'global' : (bulkGenData.outlet_id || 'global')}
                                            onChange={(e) => {
                                                if (e.target.value === 'global') {
                                                    setBulkGenData({ ...bulkGenData, is_global: true, outlet_id: '' });
                                                } else {
                                                    setBulkGenData({ ...bulkGenData, is_global: false, outlet_id: e.target.value });
                                                }
                                            }}
                                            style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem' }}
                                        >
                                            <option value="global">All Outlets (Global)</option>
                                            {outlets.map((o) => (
                                                <option key={o.id} value={o.id}>
                                                    {o.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkGenModal(false)}
                                        style={{ padding: '0.6rem 1.25rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            padding: '0.6rem 1.5rem',
                                            background: '#0F172A',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            fontWeight: 700,
                                            cursor: submitting ? 'wait' : 'pointer',
                                        }}
                                    >
                                        {submitting ? 'Generating...' : `Generate ${bulkGenData.count} Coupons`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
