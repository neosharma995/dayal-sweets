import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function TableOrder({
    table,
    outlet,
    products = [],
    categories = [],
    recentOrders: initialRecentOrders = [],
}) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVariations, setSelectedVariations] = useState({});
    const [tableCart, setTableCart] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Direct Order Form Fields
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [guestsCount, setGuestsCount] = useState(table?.capacity || 2);
    const [paymentMethod, setPaymentMethod] = useState('pay_at_counter');
    const [orderNotes, setOrderNotes] = useState('');

    // Submission & Order Status States
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [recentOrders, setRecentOrders] = useState(initialRecentOrders);

    const getActiveVariation = (product) => {
        if (!product.variations || product.variations.length === 0) return null;
        const chosenId = selectedVariations[product.id];
        if (chosenId) {
            return product.variations.find((v) => Number(v.id) === Number(chosenId)) || product.variations[0];
        }
        return product.variations[0];
    };

    const getCartKey = (productId, variationId) => `${productId}-${variationId || 'base'}`;

    const getCartItemQty = (product) => {
        const activeVar = getActiveVariation(product);
        const key = getCartKey(product.id, activeVar?.id);
        const found = tableCart.find((i) => i.key === key);
        return found ? found.quantity : 0;
    };

    const addItemToTableCart = (product, delta = 1) => {
        const activeVar = getActiveVariation(product);
        const key = getCartKey(product.id, activeVar?.id);
        const unitPrice = activeVar ? Number(activeVar.price) : Number(product.price);

        setTableCart((prev) => {
            const idx = prev.findIndex((item) => item.key === key);
            if (idx > -1) {
                const nextQty = prev[idx].quantity + delta;
                if (nextQty <= 0) {
                    return prev.filter((_, i) => i !== idx);
                }
                const copy = [...prev];
                copy[idx] = { ...copy[idx], quantity: nextQty };
                return copy;
            }
            if (delta <= 0) return prev;
            return [
                ...prev,
                {
                    key,
                    product_id: product.id,
                    variation_id: activeVar?.id || null,
                    name: product.name,
                    variation_label: activeVar?.label || null,
                    price: unitPrice,
                    image: product.image,
                    quantity: delta,
                },
            ];
        });
    };

    const updateCartKeyQty = (key, delta) => {
        setTableCart((prev) =>
            prev
                .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
                .filter((item) => item.quantity > 0)
        );
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCategory =
                selectedCategory === 'all' ||
                (p.categorySlug && p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()) ||
                (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

            const matchSearch =
                !searchQuery.trim() ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchCategory && matchSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const cartTotalCount = tableCart.reduce((acc, item) => acc + item.quantity, 0);
    const cartSubtotal = tableCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePlaceDirectOrder = async (e) => {
        e.preventDefault();
        if (tableCart.length === 0) return;

        setSubmitting(true);
        setErrorMsg(null);

        try {
            const response = await axios.post(`/scan/${table.qr_token}/order`, {
                customer_name: customerName,
                customer_phone: customerPhone,
                guests_count: Number(guestsCount) || table.capacity || 2,
                payment_method: paymentMethod,
                order_notes: orderNotes,
                items: tableCart.map((i) => ({
                    product_id: i.product_id,
                    variation_id: i.variation_id,
                    quantity: i.quantity,
                })),
            });

            if (response.data?.success) {
                const newOrder = response.data.order;
                setConfirmedOrder(newOrder);
                setRecentOrders((prev) => [newOrder, ...prev]);
                setTableCart([]);
                setOrderNotes('');
                setDrawerOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Unable to send order. Please try again or call our staff.';
            setErrorMsg(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FAF6F0', fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", paddingBottom: '100px' }}>
            <Head title={`Order at ${table.name} (${outlet.name}) - Dayal Sweets`} />

            {/* Top Heritage Dine-In Banner */}
            <header style={{ background: 'linear-gradient(135deg, #4A1212 0%, #6D1B1B 100%)', color: '#FFFFFF', padding: '1.15rem 1.25rem', borderBottom: '3px solid #D4AF37', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 4px 20px rgba(74, 18, 18, 0.22)' }}>
                <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#D4AF37', color: '#3E1C1A', fontWeight: 900, fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                DS
                            </div>
                        </Link>
                        <div>
                            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F3D88B', fontWeight: 700 }}>
                                {outlet.name} • Instant Table Ordering
                            </div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.1rem 0 0', color: '#FFFFFF' }}>
                                {table.name} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FDE68A' }}>({table.table_number})</span>
                            </h1>
                        </div>
                    </div>

                    {/* Table Meta Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(212,175,55,0.45)', fontSize: '0.78rem', fontWeight: 700 }}>
                            📍 {table.location}
                        </span>
                        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(212,175,55,0.45)', fontSize: '0.78rem', fontWeight: 700 }}>
                            👥 Capacity: {table.capacity} Guests
                        </span>
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            style={{ padding: '0.45rem 0.95rem', borderRadius: '999px', background: '#D4AF37', color: '#3E1C1A', border: 'none', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                            🛒 Table Bag ({cartTotalCount}) • ₹{cartSubtotal.toFixed(0)}
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.15rem' }}>
                {/* Live Order Confirmation Alert */}
                {confirmedOrder && (
                    <div style={{ background: '#ECFDF5', border: '2px solid #10B981', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', letterSpacing: '0.06em' }}>
                                ✓ Direct Table Order Received by Kitchen
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065F46', margin: '0.2rem 0' }}>
                                Order #{confirmedOrder.order_number} Confirmed for {table.name} ({table.location})
                            </h2>
                            <p style={{ fontSize: '0.86rem', color: '#047857', margin: 0 }}>
                                Our halwais and kitchen staff are preparing your fresh items and will serve them straight to <strong>{table.table_number}</strong>.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setConfirmedOrder(null)}
                            style={{ padding: '0.45rem 0.85rem', borderRadius: '0.5rem', background: '#FFFFFF', border: '1px solid #A7F3D0', color: '#065F46', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Order More Items
                        </button>
                    </div>
                )}

                {/* Active Orders Placed From This Table */}
                {recentOrders.length > 0 && (
                    <div style={{ background: '#FFFFFF', borderRadius: '0.9rem', border: '1px solid #E6D2B5', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#8C6226', marginBottom: '0.65rem' }}>
                            🔔 Active Kitchen Orders at {table.name}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                            {recentOrders.map((ord) => (
                                <div key={ord.id} style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', background: '#FDF8F0', border: '1px solid #E6D2B5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#3E1C1A', fontSize: '0.9rem' }}>
                                            #{ord.order_number}
                                        </div>
                                        <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                            {ord.items?.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: '#5A1E1E', fontSize: '0.92rem' }}>
                                            ₹{Number(ord.total_amount).toFixed(0)}
                                        </div>
                                        <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#FEF3C7', color: '#B45309', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {ord.delivery_status === 'pending' ? 'In Kitchen' : ord.delivery_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Layout: Menu Grid + Direct Order Panel */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {/* Search & Category Bar */}
                    <div style={{ background: '#FFFFFF', borderRadius: '0.9rem', padding: '1rem 1.25rem', border: '1px solid #E6D2B5', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                            <input
                                type="text"
                                placeholder={`Search fresh sweets, snacks & beverages at ${outlet.name}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ flex: 1, minWidth: '240px', padding: '0.65rem 1rem', borderRadius: '0.6rem', border: '1px solid #D6C7B2', fontSize: '0.9rem' }}
                            />
                            <div style={{ fontSize: '0.82rem', color: '#7A6355', fontWeight: 600 }}>
                                Showing {filteredProducts.length} fresh items available at <strong>{outlet.name}</strong>
                            </div>
                        </div>

                        {/* Category Filter Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                style={{
                                    padding: '0.45rem 1rem',
                                    borderRadius: '999px',
                                    border: selectedCategory === 'all' ? 'none' : '1px solid #D6C7B2',
                                    background: selectedCategory === 'all' ? '#5A1E1E' : '#FAF6F0',
                                    color: selectedCategory === 'all' ? '#FFFFFF' : '#3E1C1A',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                All Menu Items
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '999px',
                                        border: selectedCategory === cat.slug ? 'none' : '1px solid #D6C7B2',
                                        background: selectedCategory === cat.slug ? '#5A1E1E' : '#FAF6F0',
                                        color: selectedCategory === cat.slug ? '#FFFFFF' : '#3E1C1A',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.15rem' }}>
                        {filteredProducts.map((product) => {
                            const activeVar = getActiveVariation(product);
                            const displayPrice = activeVar ? Number(activeVar.price) : Number(product.price);
                            const currentQty = getCartItemQty(product);

                            return (
                                <div
                                    key={product.id}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '1rem',
                                        border: currentQty > 0 ? '2px solid #5A1E1E' : '1px solid #E6D2B5',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 14px rgba(62, 28, 26, 0.05)',
                                    }}
                                >
                                    <div>
                                        <div style={{ position: 'relative', height: '175px', background: '#F8F2E9', overflow: 'hidden' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(90, 30, 30, 0.9)', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {product.category}
                                            </span>
                                            {currentQty > 0 && (
                                                <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.22rem 0.65rem', borderRadius: '999px', background: '#047857', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800 }}>
                                                    {currentQty} in Table Order
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ padding: '1rem' }}>
                                            <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.02rem', fontWeight: 800, color: '#3E1C1A' }}>
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: '#7A6355', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Variations Selector */}
                                            {product.variations && product.variations.length > 0 && (
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8C6226', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                                        Select Portion / Weight:
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                        {product.variations.map((v) => {
                                                            const isSel = activeVar?.id === v.id;
                                                            return (
                                                                <button
                                                                    key={v.id}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedVariations((prev) => ({
                                                                            ...prev,
                                                                            [product.id]: v.id,
                                                                        }))
                                                                    }
                                                                    style={{
                                                                        padding: '0.25rem 0.55rem',
                                                                        borderRadius: '0.4rem',
                                                                        border: isSel ? '1.5px solid #5A1E1E' : '1px solid #D6C7B2',
                                                                        background: isSel ? '#FDF8F0' : '#FFFFFF',
                                                                        color: isSel ? '#5A1E1E' : '#64748B',
                                                                        fontSize: '0.73rem',
                                                                        fontWeight: 700,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    {v.label} (₹{Number(v.price).toFixed(0)})
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid #F3ECE1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#3E1C1A' }}>
                                                ₹{displayPrice.toFixed(2)}
                                            </span>
                                        </div>

                                        {currentQty === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => addItemToTableCart(product, 1)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    background: '#5A1E1E',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    fontWeight: 800,
                                                    fontSize: '0.82rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                + Add to Table
                                            </button>
                                        ) : (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FDF8F0', border: '1.5px solid #5A1E1E', borderRadius: '0.5rem', padding: '0.2rem 0.45rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => addItemToTableCart(product, -1)}
                                                    style={{ width: '26px', height: '26px', borderRadius: '0.35rem', border: 'none', background: '#5A1E1E', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                                                >
                                                    −
                                                </button>
                                                <span style={{ fontWeight: 800, color: '#3E1C1A', minWidth: '20px', textAlign: 'center' }}>
                                                    {currentQty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => addItemToTableCart(product, 1)}
                                                    style={{ width: '26px', height: '26px', borderRadius: '0.35rem', border: 'none', background: '#5A1E1E', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Bar when items are in Table Cart */}
            {cartTotalCount > 0 && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#3E1C1A', color: '#FFFFFF', padding: '0.9rem 1.25rem', zIndex: 45, boxShadow: '0 -6px 24px rgba(0,0,0,0.22)', borderTop: '2px solid #D4AF37' }}>
                    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.74rem', color: '#F3D88B', fontWeight: 700, textTransform: 'uppercase' }}>
                                {table.name} ({table.location}) • Direct Kitchen Order
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                {cartTotalCount} {cartTotalCount === 1 ? 'Item' : 'Items'} • ₹{cartSubtotal.toFixed(2)}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            style={{ padding: '0.7rem 1.4rem', borderRadius: '0.6rem', background: '#D4AF37', color: '#3E1C1A', border: 'none', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer' }}
                        >
                            Review &amp; Send Direct Order →
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-Over Table Cart & Direct Order Drawer */}
            {drawerOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}
                    onClick={() => !submitting && setDrawerOpen(false)}
                >
                    <div
                        style={{ width: '100%', maxWidth: '460px', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#4A1212', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.72rem', color: '#F3D88B', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Direct Table Service • {outlet.name}
                                </div>
                                <h2 style={{ margin: '0.15rem 0 0', fontSize: '1.15rem', fontWeight: 800 }}>
                                    {table.name} ({table.table_number}) — {table.location}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto' }}>
                            {errorMsg && (
                                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    {errorMsg}
                                </div>
                            )}

                            {tableCart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                                    <p style={{ fontWeight: 700, fontSize: '1rem', color: '#3E1C1A' }}>Your Table Order Bag is Empty</p>
                                    <p style={{ fontSize: '0.84rem' }}>Select items from the menu to send your order directly to the kitchen.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.6rem' }}>
                                            Selected Items ({cartTotalCount})
                                        </div>
                                        {tableCart.map((item) => (
                                            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #F1F5F9', gap: '0.75rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>{item.name}</div>
                                                    {item.variation_label && (
                                                        <div style={{ fontSize: '0.75rem', color: '#8C6226', fontWeight: 600 }}>{item.variation_label}</div>
                                                    )}
                                                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>₹{item.price.toFixed(2)} each</div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateCartKeyQty(item.key, -1)}
                                                        style={{ width: '26px', height: '26px', borderRadius: '0.35rem', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 800 }}
                                                    >
                                                        −
                                                    </button>
                                                    <span style={{ fontWeight: 800, minWidth: '20px', textAlign: 'center', fontSize: '0.88rem' }}>{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateCartKeyQty(item.key, 1)}
                                                        style={{ width: '26px', height: '26px', borderRadius: '0.35rem', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 800 }}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div style={{ fontWeight: 800, color: '#0F172A', minWidth: '68px', textAlign: 'right', fontSize: '0.9rem' }}>
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Direct Table Order Form */}
                                    <form id="direct-table-order-form" onSubmit={handlePlaceDirectOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        <div style={{ padding: '0.75rem', borderRadius: '0.6rem', background: '#FDF8F0', border: '1px solid #E6D2B5', fontSize: '0.8rem', color: '#5A1E1E', fontWeight: 600 }}>
                                            🍽️ Serving directly to <strong>{table.name} ({table.table_number})</strong> in <strong>{table.location}</strong>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                    Your Name (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Guest Name"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                    Mobile Number (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="10-digit mobile"
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                    Number of Guests Sitting
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={guestsCount}
                                                    onChange={(e) => setGuestsCount(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                    Payment Mode
                                                </label>
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                                >
                                                    <option value="pay_at_counter">Pay at Table / Counter</option>
                                                    <option value="upi">UPI at Table</option>
                                                    <option value="cash">Cash at Table</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                                Cooking / Serving Instructions (Optional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="e.g. Serve hot, less spicy, extra plates..."
                                                value={orderNotes}
                                                onChange={(e) => setOrderNotes(e.target.value)}
                                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                            />
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>

                        {tableCart.length > 0 && (
                            <div style={{ padding: '1.15rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Total Table Bill</span>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#3E1C1A' }}>₹{cartSubtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    form="direct-table-order-form"
                                    disabled={submitting}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem 1.25rem',
                                        borderRadius: '0.6rem',
                                        background: '#5A1E1E',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.96rem',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {submitting ? 'Sending Order to Kitchen...' : `Send Direct Order to Kitchen (₹${cartSubtotal.toFixed(2)}) →`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
