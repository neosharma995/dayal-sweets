import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TruckIcon } from '@/Components/Icons';

export default function Edit({ zone }) {
    const [zoneName, setZoneName] = useState(zone.zone_name || '');
    const [zoneSlug, setZoneSlug] = useState(zone.zone_slug || '');
    const [selectedRegions, setSelectedRegions] = useState(
        Array.isArray(zone.zone_regions) ? zone.zone_regions : []
    );
    const [customRegionName, setCustomRegionName] = useState('');
    const [customPincode, setCustomPincode] = useState('');
    const [isActive, setIsActive] = useState(Boolean(zone.is_active));
    const [sortOrder, setSortOrder] = useState(zone.sort_order ?? 0);

    // Shipping Methods inside this zone
    const [methods, setMethods] = useState(
        Array.isArray(zone.methods) && zone.methods.length > 0
            ? zone.methods.map((m) => ({
                  id: m.id,
                  method_type: m.method_type || 'flat_rate',
                  title: m.title || '',
                  cost: m.cost || 0,
                  tax_status: m.tax_status || 'none',
                  min_order_amount: m.min_order_amount ?? '',
                  is_enabled: Boolean(m.is_enabled),
              }))
            : []
    );

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleAddMethod = (type = 'flat_rate') => {
        let title = 'Flat rate';
        let cost = 50;
        let min_order = '';

        if (type === 'free_shipping') {
            title = 'Free shipping';
            cost = 0;
            min_order = 499;
        } else if (type === 'local_pickup') {
            title = 'Local store pickup';
            cost = 0;
        }

        setMethods([
            ...methods,
            {
                method_type: type,
                title,
                cost,
                tax_status: 'none',
                min_order_amount: min_order,
                is_enabled: true,
            },
        ]);
    };

    const handleUpdateMethod = (index, field, value) => {
        const updated = [...methods];
        updated[index][field] = value;
        setMethods(updated);
    };

    const handleRemoveMethod = (index) => {
        setMethods(methods.filter((_, i) => i !== index));
    };

    const getRegionName = (r) => {
        if (!r) return '';
        if (typeof r === 'object' && r !== null) return r.name || '';
        const str = String(r);
        if (str.includes(' (PIN: ')) {
            return str.split(' (PIN: ')[0];
        }
        return str;
    };

    const getRegionPincode = (r) => {
        if (!r) return null;
        if (typeof r === 'object' && r !== null) return r.pincode || null;
        const str = typeof r === 'string' ? r : '';
        if (str.includes(' (PIN: ')) {
            const parts = str.split(' (PIN: ');
            return parts[1]?.replace(/\)$/, '') || null;
        }
        return null;
    };

    const removeRegion = (regionToRemove) => {
        const targetName = getRegionName(regionToRemove).toLowerCase();
        setSelectedRegions(selectedRegions.filter((r) => getRegionName(r).toLowerCase() !== targetName));
    };

    const handleAddCustomRegion = (e) => {
        if (e) e.preventDefault();
        const trimmedName = customRegionName.trim();
        const trimmedPin = customPincode.trim();

        if (!trimmedName) return;

        const alreadyExists = selectedRegions.some(
            (r) => getRegionName(r).toLowerCase() === trimmedName.toLowerCase()
        );

        if (!alreadyExists) {
            setSelectedRegions([
                ...selectedRegions,
                {
                    name: trimmedName,
                    pincode: trimmedPin || null,
                },
            ]);
            setCustomRegionName('');
            setCustomPincode('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const payload = {
            zone_name: zoneName,
            zone_slug: zoneSlug || null,
            description: null,
            zone_regions: selectedRegions,
            zone_postcodes: null,
            is_active: isActive,
            sort_order: Number(sortOrder) || 0,
            methods: methods.map((m) => ({
                id: m.id || null,
                method_type: m.method_type,
                title: m.title,
                cost: Number(m.cost) || 0,
                tax_status: m.tax_status || 'none',
                min_order_amount: m.min_order_amount ? Number(m.min_order_amount) : null,
                is_enabled: Boolean(m.is_enabled),
            })),
        };

        router.put(route('admin.shipping-zones.update', zone.id), payload, {
            onFinish: () => setProcessing(false),
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout header={`Edit Shipping Zone: ${zone.zone_name}`}>
            <Head title={`Edit ${zone.zone_name} - Dayal Sweets Admin`} />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <Link
                            href={route('admin.shipping-zones.index')}
                            style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}
                        >
                            Shipping Zones
                        </Link>
                        <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                        <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>
                            Edit Zone
                        </span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Edit Shipping Zone: {zone.zone_name}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Zone Details Card */}
                    <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                            1. Zone Information
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Zone name <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={zoneName}
                                    onChange={(e) => setZoneName(e.target.value)}
                                    placeholder="e.g. Delhi NCR or Punjab & Haryana"
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                />
                                {errors.zone_name && (
                                    <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.zone_name}</span>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Zone slug
                                </label>
                                <input
                                    type="text"
                                    value={zoneSlug}
                                    onChange={(e) => setZoneSlug(e.target.value)}
                                    placeholder="e.g. delhi-ncr"
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        </div>

                        {/* Zone Regions Selection */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                Zone regions &amp; PIN codes (Geographic coverage)
                            </label>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1rem' }}>
                                Create regions with their PIN codes below. Customers with shipping addresses in any matching region or PIN code will match this shipping zone.
                            </p>

                            {/* 1. Custom Region Name & Pincode Creator Form */}
                            <div
                                style={{
                                    background: '#F8FAFC',
                                    border: '1.5px solid #E2E8F0',
                                    borderRadius: '0.5rem',
                                    padding: '1.25rem',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
                                        Add Custom Region &amp; PIN Code
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                                        Type any state, city or zone name and its specific PIN code or range, then click <strong>Add Region</strong>.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.3fr) minmax(180px, 1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
                                    {/* Region Name Input */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                            Region / State / City Name <span style={{ color: '#E11D48' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customRegionName}
                                            onChange={(e) => setCustomRegionName(e.target.value)}
                                            placeholder="e.g. Delhi NCR, South Delhi, Jaipur"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddCustomRegion();
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.55rem 0.75rem',
                                                fontSize: '0.8125rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #CBD5E1',
                                                background: '#FFFFFF',
                                            }}
                                        />
                                    </div>

                                    {/* Pincode Input */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                                            PIN Code / Range <span style={{ color: '#64748B', fontWeight: 400 }}>(e.g. 110001 or 110001-110096)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customPincode}
                                            onChange={(e) => setCustomPincode(e.target.value)}
                                            placeholder="e.g. 110001, 110001-110096, 110*"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddCustomRegion();
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.55rem 0.75rem',
                                                fontSize: '0.8125rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #CBD5E1',
                                                background: '#FFFFFF',
                                            }}
                                        />
                                    </div>

                                    {/* Add Button */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleAddCustomRegion}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                padding: '0.55rem 1.25rem',
                                                fontSize: '0.8125rem',
                                                fontWeight: 700,
                                                borderRadius: '0.375rem',
                                                background: '#B88E4B',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 1px 2px rgba(184, 142, 75, 0.25)',
                                            }}
                                        >
                                            <span>+</span>
                                            <span>Add Region</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Active Selected Regions list with 'x' button */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                                        Configured Regions &amp; PIN Codes ({selectedRegions.length}):
                                    </span>
                                    {selectedRegions.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRegions([])}
                                            style={{ background: 'transparent', border: 'none', color: '#E11D48', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {selectedRegions.length === 0 ? (
                                    <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: '0.375rem', color: '#64748B', fontSize: '0.8125rem' }}>
                                        No regions added yet. Enter Region / State Name and PIN code above, then click <strong>+ Add Region</strong>.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }}>
                                        {selectedRegions.map((region, idx) => {
                                            const rName = getRegionName(region);
                                            const pin = getRegionPincode(region);
                                            return (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.45rem',
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#FFFFFF',
                                                        border: '1.5px solid #B88E4B',
                                                        color: '#8C6226',
                                                        fontSize: '0.8125rem',
                                                        fontWeight: 600,
                                                        boxShadow: '0 1px 2px rgba(184,142,75,0.08)',
                                                    }}
                                                >
                                                    <span style={{ color: '#0F172A', fontWeight: 700 }}>{rName}</span>
                                                    {pin && (
                                                        <span
                                                            style={{
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 600,
                                                                padding: '0.1rem 0.35rem',
                                                                borderRadius: '0.25rem',
                                                                background: '#FDF8F0',
                                                                border: '1px solid #E6D2B5',
                                                                color: '#8C6226',
                                                            }}
                                                        >
                                                            PIN: {pin}
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRegion(region)}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '18px',
                                                            height: '18px',
                                                            borderRadius: '50%',
                                                            background: '#FDF8F0',
                                                            border: '1px solid #E6D2B5',
                                                            color: '#8C6226',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 800,
                                                            lineHeight: 1,
                                                            padding: 0,
                                                            marginLeft: '0.2rem',
                                                        }}
                                                        title={`Remove ${rName}`}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active & Sort */}
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#0F172A', cursor: 'pointer', fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    style={{ accentColor: '#B88E4B' }}
                                />
                                Zone is active for customer checkout
                            </label>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8125rem', color: '#64748B' }}>Sort Priority:</label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    style={{ width: '80px', padding: '0.35rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Methods Inside Zone (WooCommerce Standard) */}
                    <div className="dayal-admin-table-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                    2. Shipping Methods within this Zone
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                                    The following shipping methods apply to customers in this zone. Click below to add flat rate, free shipping, or local pickup.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => handleAddMethod('flat_rate')}
                                    className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    + Flat Rate
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddMethod('free_shipping')}
                                    className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    + Free Shipping
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddMethod('local_pickup')}
                                    className="dayal-btn dayal-btn--secondary dayal-btn--sm"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    + Local Pickup
                                </button>
                            </div>
                        </div>

                        {methods.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '0.5rem', border: '1.5px dashed #CBD5E1' }}>
                                <TruckIcon width="32" height="32" style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
                                <p style={{ fontWeight: 600, color: '#0F172A', margin: '0 0 0.25rem 0' }}>No shipping methods added to this zone</p>
                                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                                    Add at least one method (e.g. Flat Rate) so customers in this region can choose shipping.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {methods.map((method, idx) => (
                                    <div
                                        key={method.id || `m-${idx}`}
                                        style={{
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            background: '#FFFFFF',
                                            display: 'grid',
                                            gridTemplateColumns: '160px minmax(180px, 1fr) 110px 140px auto',
                                            gap: '1rem',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Type
                                            </span>
                                            <select
                                                value={method.method_type}
                                                onChange={(e) => handleUpdateMethod(idx, 'method_type', e.target.value)}
                                                style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1' }}
                                            >
                                                <option value="flat_rate">Flat Rate</option>
                                                <option value="free_shipping">Free Shipping</option>
                                                <option value="local_pickup">Local Pickup</option>
                                            </select>
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Method Title
                                            </span>
                                            <input
                                                type="text"
                                                value={method.title}
                                                onChange={(e) => handleUpdateMethod(idx, 'title', e.target.value)}
                                                placeholder="Title shown to buyer"
                                                style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1' }}
                                            />
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Cost (₹)
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={method.cost}
                                                onChange={(e) => handleUpdateMethod(idx, 'cost', e.target.value)}
                                                placeholder="0.00"
                                                style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1' }}
                                            />
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                                                Min Order (₹)
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={method.min_order_amount ?? ''}
                                                onChange={(e) => handleUpdateMethod(idx, 'min_order_amount', e.target.value)}
                                                placeholder="Optional min"
                                                style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(method.is_enabled)}
                                                    onChange={(e) => handleUpdateMethod(idx, 'is_enabled', e.target.checked)}
                                                    style={{ accentColor: '#B88E4B' }}
                                                />
                                                Enabled
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMethod(idx)}
                                                style={{ background: 'transparent', border: 'none', color: '#E11D48', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                                                title="Remove Method"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                        <Link
                            href={route('admin.shipping-zones.index')}
                            className="dayal-admin-head-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="dayal-btn dayal-btn--primary"
                            style={{ padding: '0.65rem 1.75rem' }}
                        >
                            {processing ? 'Saving...' : 'Update Shipping Zone'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
