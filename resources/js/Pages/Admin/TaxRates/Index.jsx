import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { AlertIcon } from '@/Components/Icons';

export default function Index({ taxRates = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rateToDelete, setRateToDelete] = useState(null);

    const filteredRates = taxRates.filter((r) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            r.name?.toLowerCase().includes(q) ||
            r.code?.toLowerCase().includes(q) ||
            r.tax_class?.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
        );
    });

    const activeCount = taxRates.filter((r) => r.is_active).length;
    const totalProductsWithTax = taxRates.reduce((sum, r) => sum + (Number(r.products_count) || 0), 0);

    const handleDeleteClick = (rate) => {
        setRateToDelete(rate);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!rateToDelete) return;
        router.delete(route('admin.taxes.destroy', rateToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setRateToDelete(null);
            },
        });
    };

    const toggleRateActive = (rateId) => {
        router.patch(route('admin.taxes.toggle', rateId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout header="Taxes & GST Rates">
            <Head title="Taxes & GST Rates - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* View Header */}
                <div className="dayal-admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <div>
                        <h1>Taxes &amp; GST Rates</h1>
                        <p>Configure Indian Goods &amp; Services Tax (GST) rates (5%, 12%, 18%, 0%) to calculate final sweet prices and invoice totals.</p>
                    </div>

                    <Link
                        href={route('admin.taxes.create')}
                        className="dayal-btn dayal-btn--primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Tax Rate</span>
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Total Tax Rates</span>
                            <span className="dayal-stat-badge">WooCommerce</span>
                        </div>
                        <div className="dayal-stat-value">{taxRates.length}</div>
                        <div className="dayal-stat-subtext">Registered GST tiers</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Active Rates</span>
                            <span className="dayal-stat-badge" style={{ color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>Live</span>
                        </div>
                        <div className="dayal-stat-value">{activeCount}</div>
                        <div className="dayal-stat-subtext">Applied to product catalog</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Assigned Products</span>
                            <span className="dayal-stat-badge" style={{ color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>Catalog</span>
                        </div>
                        <div className="dayal-stat-value">{totalProductsWithTax}</div>
                        <div className="dayal-stat-subtext">Items with calculated GST</div>
                    </div>

                    <div className="dayal-admin-stat-card">
                        <div className="dayal-stat-top">
                            <span className="dayal-stat-label">Standard Mithai Rate</span>
                            <span className="dayal-stat-badge" style={{ color: '#B88E4B', background: '#FDFBF7', border: '1px solid #E6D2B5' }}>FSSAI / GST</span>
                        </div>
                        <div className="dayal-stat-value">5% GST</div>
                        <div className="dayal-stat-subtext">Desi Ghee Sweets &amp; Mithai</div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="dayal-admin-table-card" style={{ width: '100%' }}>
                    <div className="dayal-admin-table-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3>Configured Tax &amp; GST Rates</h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Rates can be selected when creating or editing a product to calculate final customer pricing automatically.
                            </span>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', minWidth: '280px' }}>
                            <input
                                type="text"
                                placeholder="Search by name, code or class..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                                    borderRadius: '0.5rem',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    color: '#0F172A',
                                    outline: 'none',
                                }}
                            />
                            <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="#64748B"
                                viewBox="0 0 24 24"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="dayal-admin-table-responsive">
                        <table className="dayal-admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Tax Name &amp; Description</th>
                                    <th style={{ width: '15%' }}>Code</th>
                                    <th style={{ width: '12%' }}>Rate</th>
                                    <th style={{ width: '15%' }}>Class</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Products</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                                    <th style={{ width: '13%', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRates.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                                            <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>No Tax Rates Found</p>
                                            <p style={{ fontSize: '0.8125rem' }}>Configure GST rates to apply taxes to sweet products.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRates.map((rate) => (
                                        <tr key={rate.id}>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <Link
                                                        href={route('admin.taxes.edit', rate.id)}
                                                        style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', fontSize: '0.875rem' }}
                                                    >
                                                        {rate.name}
                                                    </Link>
                                                    {rate.description && (
                                                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                            {rate.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', background: '#F1F5F9', padding: '0.2rem 0.45rem', borderRadius: '0.25rem' }}>
                                                    {rate.code}
                                                </span>
                                            </td>

                                            <td>
                                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#B88E4B' }}>
                                                    {Number(rate.rate).toFixed(rate.rate % 1 === 0 ? 0 : 2)}%
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>
                                                    {rate.type === 'fixed' ? 'Fixed Fee' : 'Percentage'}
                                                </span>
                                            </td>

                                            <td>
                                                <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: '#334155', fontWeight: 600 }}>
                                                    {rate.tax_class.replace('_', ' ')}
                                                </span>
                                                {rate.apply_to_shipping && (
                                                    <span style={{ fontSize: '0.65rem', color: '#2563EB', display: 'block' }}>
                                                        + Shipping freight
                                                    </span>
                                                )}
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid #E2E8F0' }}>
                                                    {rate.products_count ?? 0}
                                                </span>
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRateActive(rate.id)}
                                                    style={{
                                                        padding: '0.25rem 0.65rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        background: rate.is_active ? '#ECFDF5' : '#F1F5F9',
                                                        color: rate.is_active ? '#059669' : '#64748B',
                                                        border: rate.is_active ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                                                    }}
                                                >
                                                    {rate.is_active ? 'Active' : 'Disabled'}
                                                </button>
                                            </td>

                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <Link
                                                        href={route('admin.taxes.edit', rate.id)}
                                                        className="dayal-admin-action-btn"
                                                        title="Edit Rate"
                                                    >
                                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(rate)}
                                                        className="dayal-admin-action-btn delete"
                                                        title="Delete Rate"
                                                    >
                                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div className="dayal-admin-modal-content">
                    <div className="modal-header-row">
                        <div className="modal-icon-badge">
                            <AlertIcon width="24" height="24" />
                        </div>
                        <div className="modal-title-text">
                            <h3>Delete Tax Rate?</h3>
                            <span>Permanent Catalog Action</span>
                        </div>
                    </div>

                    <p className="modal-desc-text">
                        Are you sure you want to delete <strong>&ldquo;{rateToDelete?.name}&rdquo;</strong>? Products currently using this tax rate will be unassigned and marked tax-exempt until updated.
                    </p>

                    <div className="modal-actions-row">
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(false)}
                            className="dayal-admin-head-btn modal-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="modal-confirm-btn"
                        >
                            Delete Tax Rate
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
