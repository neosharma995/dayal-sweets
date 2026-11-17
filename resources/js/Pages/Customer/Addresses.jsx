import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import Modal from '@/Components/Modal';
import { MapPin, CheckCircle2 } from 'lucide-react';

export default function CustomerAddresses({
    savedAddress = {},
    tier = 'Gold Mithai Club Member',
    ordersCount = 0,
    sweetsCount = 0,
}) {
    const { auth } = usePage().props || {};
    const user = auth?.user || {};

    const [shippingData, setShippingData] = useState({
        name: savedAddress.name || user?.name || '',
        phone: savedAddress.phone || '+91 98765 43210',
        address: savedAddress.address || 'Civil Lines, Main Market',
        apartment: savedAddress.apartment || '',
        city: savedAddress.city || 'Una',
        state: savedAddress.state || 'Himachal Pradesh',
        pincode: savedAddress.pincode || '174303',
    });

    const [billingData, setBillingData] = useState({
        name: user?.name || savedAddress.name || '',
        email: user?.email || savedAddress.email || '',
        phone: savedAddress.phone || '+91 98765 43210',
        address: savedAddress.address || 'Civil Lines, Main Market',
        apartment: savedAddress.apartment || '',
        city: savedAddress.city || 'Una',
        state: savedAddress.state || 'Himachal Pradesh',
        pincode: savedAddress.pincode || '174303',
    });

    const [editModalType, setEditModalType] = useState(null); // 'shipping' | 'billing' | null
    const [toastMessage, setToastMessage] = useState('');

    const handleSaveAddress = (e) => {
        e.preventDefault();
        const type = editModalType;
        setEditModalType(null);
        setToastMessage(
            type === 'billing'
                ? 'Billing address updated successfully!'
                : 'Shipping address updated successfully!'
        );
        setTimeout(() => setToastMessage(''), 4500);
    };

    return (
        <CustomerPortalLayout
            title="Saved Addresses - Dayal Sweets"
            breadcrumbTitle="Addresses"
            heroTitle="My Addresses"
            heroSubtitle="Manage your default delivery destination and billing information."
            activeNav="addresses"
            tier={tier}
            ordersCount={ordersCount}
            sweetsCount={sweetsCount}
        >
            {/* Toast feedback */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#631826',
                        color: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                >
                    <CheckCircle2 size={18} color="#D4AF37" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#631826', margin: '0 0 4px 0' }}>
                        Delivery Addresses
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                        The following addresses will be pre-filled on the checkout page by default.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Left Card: Shipping Address */}
                    <div
                        style={{
                            border: '1px solid #EBE4D8',
                            borderRadius: '8px',
                            padding: '24px',
                            background: '#FAF7F2',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={16} color="#631826" />
                                    <span>Shipping Address</span>
                                </h3>
                                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                                    Default
                                </span>
                            </div>

                            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                    {shippingData.name}
                                </div>
                                <div>{shippingData.address}</div>
                                {shippingData.apartment && <div>{shippingData.apartment}</div>}
                                <div>
                                    {shippingData.city}, {shippingData.state} - <strong>{shippingData.pincode}</strong>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    📞 {shippingData.phone}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #EBE4D8' }}>
                            <button
                                type="button"
                                onClick={() => setEditModalType('shipping')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#631826',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline',
                                }}
                            >
                                Edit Address
                            </button>
                        </div>
                    </div>

                    {/* Right Card: Billing Address */}
                    <div
                        style={{
                            border: '1px solid #EBE4D8',
                            borderRadius: '8px',
                            padding: '24px',
                            background: '#FAF7F2',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                                    Billing Address
                                </h3>
                                <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                                    Same as Shipping
                                </span>
                            </div>

                            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                    {billingData.name}
                                </div>
                                {billingData.email && <div>✉️ {billingData.email}</div>}
                                <div>{billingData.address}</div>
                                <div>
                                    {billingData.city}, {billingData.state} - <strong>{billingData.pincode}</strong>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    🇮🇳 India
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #EBE4D8' }}>
                            <button
                                type="button"
                                onClick={() => setEditModalType('billing')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#631826',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline',
                                }}
                            >
                                Edit Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT ADDRESS MODAL */}
            <Modal show={Boolean(editModalType)} onClose={() => setEditModalType(null)}>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #EBE4D8', paddingBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#0F172A' }}>
                            {editModalType === 'billing' ? 'Edit Billing Address' : 'Edit Shipping Address'}
                        </h3>
                        <button
                            type="button"
                            onClick={() => setEditModalType(null)}
                            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSaveAddress}>
                        {editModalType === 'billing' ? (
                            <>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={billingData.name}
                                        onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={billingData.email}
                                        onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Billing Address
                                    </label>
                                    <input
                                        type="text"
                                        value={billingData.address}
                                        onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={billingData.city}
                                            onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                            PIN Code
                                        </label>
                                        <input
                                            type="text"
                                            value={billingData.pincode}
                                            onChange={(e) => setBillingData({ ...billingData, pincode: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Recipient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.name}
                                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.phone}
                                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Street Address / House No.
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingData.address}
                                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingData.city}
                                            onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                            PIN Code
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingData.pincode}
                                            onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button
                                type="button"
                                onClick={() => setEditModalType(null)}
                                className="dayal-btn dayal-btn--outline dayal-btn--sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="dayal-btn dayal-btn--primary dayal-btn--sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </CustomerPortalLayout>
    );
}
