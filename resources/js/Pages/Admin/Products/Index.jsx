import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, { adminPrimaryBtnStyle, adminTableActionStyles } from '@/Components/Admin/AdminDataTable';
import { BoxIcon, AlertIcon } from '@/Components/Icons';

function getUrlParam(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
        return new URLSearchParams(window.location.search).get(key) || fallback;
    } catch {
        return fallback;
    }
}

function setUrlParam(key, value) {
    if (typeof window === 'undefined') return;
    try {
        const url = new URL(window.location.href);
        if (!value || value === 'all') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
        url.searchParams.delete('page');
        window.history.replaceState(window.history.state, '', url.toString());
    } catch {
        // ignore
    }
}

export default function Index({ products = [], filters = {} }) {
    const { activeOutlet } = usePage().props || {};

    const [search, setSearch] = useState(filters.search || getUrlParam('search', ''));
    const [stockFilter, setStockFilter] = useState(() => getUrlParam('stock', 'all'));
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const stock = Number(p.total_stock ?? p.product_qty ?? 0);
            if (stockFilter === 'in_stock' && stock <= 0) return false;
            if (stockFilter === 'low_stock' && !(stock > 0 && stock <= 10)) return false;
            if (stockFilter === 'out_of_stock' && stock !== 0) return false;

            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                p.product_name?.toLowerCase().includes(q) ||
                p.product_description?.toLowerCase().includes(q) ||
                p.category?.category_name?.toLowerCase().includes(q) ||
                String(p.id).includes(q)
            );
        });
    }, [products, stockFilter, search]);

    const totalCount = products.length;
    const inStockCount = products.filter((p) => Number(p.total_stock ?? p.product_qty ?? 0) > 0).length;
    const lowStockCount = products.filter((p) => {
        const stock = Number(p.total_stock ?? p.product_qty ?? 0);
        return stock > 0 && stock <= 10;
    }).length;
    const outOfStockCount = products.filter((p) => Number(p.total_stock ?? p.product_qty ?? 0) === 0).length;

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        router.delete(route('admin.products.destroy', productToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setProductToDelete(null);
            },
        });
    };

    const handleStockTabChange = (nextTab) => {
        setStockFilter(nextTab);
        setUrlParam('stock', nextTab);
    };

    const summaryCards = [
        {
            label: 'Total Products',
            value: totalCount,
            subtext: 'Registered catalog items',
            badge: 'Active',
        },
        {
            label: 'In Stock',
            value: inStockCount,
            valueColor: '#059669',
            labelColor: '#059669',
            subtext: 'Ready for immediate dispatch',
            badge: 'Available',
            badgeStyle: { color: '#059669', background: '#ECFDF5' },
        },
        {
            label: 'Low Stock Alert',
            value: lowStockCount,
            valueColor: '#D97706',
            labelColor: '#D97706',
            subtext: '10 units or fewer remaining',
            badge: 'Reorder',
            badgeStyle: { color: '#D97706', background: '#FFFBEB' },
        },
        {
            label: 'Out of Stock',
            value: outOfStockCount,
            valueColor: '#DC2626',
            labelColor: '#DC2626',
            subtext: 'Requires kitchen replenishment',
            badge: 'Sold Out',
            badgeStyle: { color: '#DC2626', background: '#FEF2F2' },
        },
    ];

    const filterTabs = [
        { key: 'all', label: 'All Products' },
        { key: 'in_stock', label: 'In Stock' },
        { key: 'low_stock', label: 'Low Stock' },
        { key: 'out_of_stock', label: 'Out of Stock' },
    ];

    const columns = [
        {
            key: 'product',
            label: 'Product',
            render: (product) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '0.5rem',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {product.product_image_url || product.product_image ? (
                            <img
                                src={product.product_image_url || product.product_image}
                                alt={product.product_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ) : (
                            <BoxIcon width="18" height="18" style={{ color: '#7A1C1C' }} />
                        )}
                    </div>
                    <div>
                        <Link
                            href={route('admin.products.show', product.id)}
                            style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}
                        >
                            {product.product_name}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.product_description || 'No description provided'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (product) =>
                product.category ? (
                    <Link
                        href={route('admin.categories.show', product.category.id)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            background: '#FDF2F2',
                            border: '1px solid #FECACA',
                            color: '#7A1C1C',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        {product.category.category_name}
                    </Link>
                ) : (
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontStyle: 'italic' }}>Unassigned</span>
                ),
        },
        {
            key: 'outlets',
            label: 'Outlets',
            render: (product) =>
                Array.isArray(product.outlets) && product.outlets.length > 0 ? (
                    product.outlets.length >= 4 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '200px' }}>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    background: '#ECFDF5',
                                    color: '#065F46',
                                    border: '1px solid #A7F3D0',
                                    width: 'fit-content',
                                }}
                            >
                                All Outlets ({product.outlets.length})
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.3 }}>
                                {product.outlets.map((o) => o.name).join(', ')}
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '200px' }}>
                            {product.outlets.map((o) => (
                                <span
                                    key={o.id}
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: '#F8FAFC',
                                        color: '#334155',
                                        padding: '0.18rem 0.5rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {o.name}
                                </span>
                            ))}
                        </div>
                    )
                ) : (
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic' }}>Unassigned</span>
                ),
        },
        {
            key: 'regular_price',
            label: 'Regular Price',
            render: (product) => {
                const regularPrice = Number(product.product_price);
                const sellingPrice = Number(product.product_selling_price);
                return (
                    <span style={{ color: '#64748B', textDecoration: regularPrice > sellingPrice ? 'line-through' : 'none' }}>
                        ₹{regularPrice.toFixed(2)}
                    </span>
                );
            },
        },
        {
            key: 'selling_price',
            label: 'Selling Price',
            render: (product) => {
                const regularPrice = Number(product.product_price);
                const sellingPrice = Number(product.product_selling_price);
                const discount = regularPrice > sellingPrice
                    ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
                    : 0;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#0F172A', fontWeight: 700 }}>₹{sellingPrice.toFixed(2)}</span>
                        {discount > 0 && (
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontWeight: 700 }}>
                                {discount}% OFF
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'stock',
            label: 'Stock Qty',
            render: (product) => {
                const qty = Number(product.product_qty);
                return (
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            background: qty > 5 ? '#ECFDF5' : qty > 0 ? '#FFFBEB' : '#FEF2F2',
                            border: qty > 5 ? '1px solid #A7F3D0' : qty > 0 ? '1px solid #FDE68A' : '1px solid #FECACA',
                            color: qty > 5 ? '#059669' : qty > 0 ? '#D97706' : '#DC2626',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {product.product_qty} in stock
                    </span>
                );
            },
        },
        {
            key: 'variations',
            label: 'Variations',
            render: (product) => {
                const count = Array.isArray(product.variations) ? product.variations.length : 0;
                return (
                    <Link
                        href={route('admin.products.edit', product.id)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.375rem',
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {count} pack size{count === 1 ? '' : 's'}
                    </Link>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (product) => (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Link href={route('admin.products.show', product.id)} style={adminTableActionStyles.primary}>
                        View
                    </Link>
                    <Link href={route('admin.products.edit', product.id)} style={adminTableActionStyles.secondary}>
                        Edit
                    </Link>
                    <button type="button" onClick={() => handleDeleteClick(product)} style={adminTableActionStyles.danger}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout header="Products">
            <Head title="Products - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Products"
                title="Products"
                subtitle="Manage all sweet, namkeen, and bakery catalog items, pricing, outlet availability, and pack variations."
                headerActions={
                    <Link href={route('admin.products.create')} style={adminPrimaryBtnStyle}>
                        <span>+ Add Product</span>
                    </Link>
                }
                summaryCards={summaryCards}
                filterTabs={filterTabs}
                activeFilterTab={stockFilter}
                onFilterTabChange={handleStockTabChange}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by product name, description, category, or ID..."
                hasActiveFilters={Boolean(search.trim() || stockFilter !== 'all')}
                onResetFilters={() => {
                    setSearch('');
                    handleStockTabChange('all');
                }}
                columns={columns}
                rows={filteredProducts}
                itemLabel="products"
                emptyTitle={
                    activeOutlet
                        ? `No products found matching your criteria - ${activeOutlet.name}`
                        : 'No products found matching your criteria.'
                }
                emptySubtitle={
                    search
                        ? `No products matching "${search}".`
                        : activeOutlet
                            ? `No products are currently assigned to ${activeOutlet.name}.`
                            : 'Get started by creating your first product in Dayal Sweets.'
                }
                emptyAction={
                    <Link href={route('admin.products.create')} style={adminPrimaryBtnStyle}>
                        + Create Product
                    </Link>
                }
            />

            {deleteModalOpen && productToDelete && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ maxWidth: '440px', width: '100%', background: '#FFFFFF', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertIcon width="24" height="24" style={{ color: '#DC2626' }} />
                            <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Delete Product</h4>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Are you sure you want to permanently delete <strong>{productToDelete.product_name}</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="button" onClick={() => setDeleteModalOpen(false)} style={adminTableActionStyles.secondary}>
                                Cancel
                            </button>
                            <button type="button" onClick={confirmDelete} style={{ ...adminTableActionStyles.primary, background: '#DC2626' }}>
                                Yes, Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
