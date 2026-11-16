import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { TagIcon, BoxIcon } from '@/Components/Icons';

/**
 * ProductVariationsManager
 *
 * Allows store admins to configure variations (weights, pack sizes, gift boxes)
 * directly inside the Product Create & Edit forms. Can generate variations
 * from global attributes or add custom ones.
 */
export default function ProductVariationsManager({
    attributes = [],
    variations = [],
    onChange,
    basePrice = '',
    baseSellingPrice = '',
    onSyncBasePrice,
    errors = {},
}) {
    const [selectedAttributeId, setSelectedAttributeId] = useState(
        attributes.length > 0 ? String(attributes[0].id) : ''
    );

    const activeAttribute = attributes.find(
        (a) => String(a.id) === String(selectedAttributeId)
    );

    // Helper to parse weight & unit from strings like "250g", "1kg", "500 gm"
    const parseWeightAndUnit = (str) => {
        if (!str) return { val: '', unit: 'g' };
        const clean = str.trim().toLowerCase();
        const match = clean.match(/^([\d.]+)\s*(kg|g|gm|gms|ml|l|pcs|pc|box)?$/);
        if (match) {
            let unit = match[2] || 'g';
            if (unit === 'gm' || unit === 'gms') unit = 'g';
            if (unit === 'pc') unit = 'pcs';
            return { val: match[1], unit };
        }
        return { val: '', unit: 'g' };
    };

    // Add a variation from an attribute value
    const addVariationFromValue = (valObj) => {
        // Prevent duplicate if already added for this attribute value
        const alreadyExists = variations.some(
            (v) => String(v.attribute_value_id) === String(valObj.id)
        );
        if (alreadyExists) return;

        const parsed = parseWeightAndUnit(valObj.value);
        const isFirst = variations.length === 0;

        const newVar = {
            id: null,
            attribute_value_id: valObj.id,
            variation_name: `${valObj.value} Pack`,
            price: basePrice || '',
            selling_price: baseSellingPrice || '',
            product_qty: 25,
            weight_value: parsed.val || '',
            weight_unit: parsed.unit || 'g',
            sku: `DS-${valObj.slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
            is_default: isFirst,
            _attribute_value_label: valObj.value,
        };

        onChange([...variations, newVar]);
    };

    // Add all values from active attribute
    const addAllValuesFromActiveAttribute = () => {
        if (!activeAttribute || !Array.isArray(activeAttribute.values)) return;

        const existingValIds = new Set(
            variations.map((v) => String(v.attribute_value_id)).filter(Boolean)
        );

        const newVars = [];
        let hasAnyDefault = variations.some((v) => v.is_default);

        activeAttribute.values.forEach((valObj) => {
            if (!existingValIds.has(String(valObj.id))) {
                const parsed = parseWeightAndUnit(valObj.value);
                const isDefault = !hasAnyDefault && newVars.length === 0;
                if (isDefault) hasAnyDefault = true;

                newVars.push({
                    id: null,
                    attribute_value_id: valObj.id,
                    variation_name: `${valObj.value} Pack`,
                    price: basePrice || '',
                    selling_price: baseSellingPrice || '',
                    product_qty: 25,
                    weight_value: parsed.val || '',
                    weight_unit: parsed.unit || 'g',
                    sku: `DS-${valObj.slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
                    is_default: isDefault,
                    _attribute_value_label: valObj.value,
                });
            }
        });

        if (newVars.length > 0) {
            onChange([...variations, ...newVars]);
        }
    };

    // Add empty custom variation row
    const addCustomVariation = () => {
        const isFirst = variations.length === 0;
        const newVar = {
            id: null,
            attribute_value_id: null,
            variation_name: `Custom Pack ${variations.length + 1}`,
            price: basePrice || '',
            selling_price: baseSellingPrice || '',
            product_qty: 20,
            weight_value: '',
            weight_unit: 'g',
            sku: `DS-CUST-${variations.length + 1}`,
            is_default: isFirst,
            _attribute_value_label: 'Custom',
        };

        onChange([...variations, newVar]);
    };

    // Update single variation field
    const handleFieldChange = (index, field, value) => {
        const updated = [...variations];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    // Set variation as default
    const setDefaultVariation = (index) => {
        const updated = variations.map((v, i) => ({
            ...v,
            is_default: i === index,
        }));
        onChange(updated);
    };

    // Remove single variation row
    const removeVariation = (index) => {
        const toRemoveWasDefault = variations[index]?.is_default;
        const remaining = variations.filter((_, i) => i !== index);

        // If the removed item was default and we still have variations left, make the first one default
        if (toRemoveWasDefault && remaining.length > 0) {
            remaining[0] = { ...remaining[0], is_default: true };
        }

        onChange(remaining);
    };

    // Sync base price with default variation
    const handleSyncToProductBase = () => {
        const defaultVar = variations.find((v) => v.is_default) || variations[0];
        if (defaultVar && onSyncBasePrice) {
            onSyncBasePrice(defaultVar.price, defaultVar.selling_price);
        }
    };

    return (
        <div style={{ background: '#141E33', border: '1px solid #1E293B', borderRadius: '0.75rem', padding: '1.25rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #1E293B', paddingBottom: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TagIcon width="18" height="18" style={{ color: '#B88E4B' }} />
                        <h4 style={{ margin: 0, color: '#F8FAFC', fontSize: '1.05rem', fontWeight: 700 }}>
                            Product Variations &amp; Pack Sizes
                        </h4>
                    </div>
                    <p style={{ margin: '0.25rem 0 0', color: '#94A3B8', fontSize: '0.8125rem' }}>
                        Configure pack sizes (250g, 500g, 1kg) with individual prices, inventory, and weights.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link
                        href={route('admin.attributes.index')}
                        target="_blank"
                        style={{
                            fontSize: '0.75rem',
                            color: '#F1D7B4',
                            textDecoration: 'none',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.375rem',
                            background: 'rgba(184, 142, 75, 0.12)',
                            border: '1px solid rgba(184, 142, 75, 0.35)',
                        }}
                    >
                        ⚙ Manage Attributes &rarr;
                    </Link>
                </div>
            </div>

            {/* Quick Generator Bar */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid #1E293B', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F1D7B4' }}>
                        Quick-Add from Attributes:
                    </span>

                    {attributes.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Select Attribute:</label>
                            <select
                                value={selectedAttributeId}
                                onChange={(e) => setSelectedAttributeId(e.target.value)}
                                style={{
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    background: '#0F172A',
                                    border: '1px solid #334155',
                                    color: '#F8FAFC',
                                    fontSize: '0.8125rem',
                                    outline: 'none',
                                }}
                            >
                                {attributes.map((attr) => (
                                    <option key={attr.id} value={attr.id}>
                                        {attr.name} ({attr.values ? attr.values.length : 0} values)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Values pills */}
                {activeAttribute && Array.isArray(activeAttribute.values) && activeAttribute.values.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginRight: '0.25rem' }}>Click to add:</span>
                        {activeAttribute.values.map((v) => {
                            const isAdded = variations.some(
                                (item) => String(item.attribute_value_id) === String(v.id)
                            );

                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => addVariationFromValue(v)}
                                    disabled={isAdded}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '999px',
                                        background: isAdded ? '#334155' : 'rgba(184, 142, 75, 0.15)',
                                        border: isAdded ? '1px solid #475569' : '1px solid rgba(184, 142, 75, 0.4)',
                                        color: isAdded ? '#94A3B8' : '#F1D7B4',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: isAdded ? 'not-allowed' : 'pointer',
                                        opacity: isAdded ? 0.6 : 1,
                                    }}
                                    title={isAdded ? 'Already added' : `Add ${v.value} variation`}
                                >
                                    <span>{isAdded ? '✓' : '+'}</span>
                                    <span>{v.value}</span>
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addAllValuesFromActiveAttribute}
                            style={{
                                padding: '0.35rem 0.85rem',
                                borderRadius: '999px',
                                background: '#0F172A',
                                border: '1px solid #B88E4B',
                                color: '#F1D7B4',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginLeft: 'auto',
                            }}
                        >
                            + Add All {activeAttribute.name} Values
                        </button>
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
                        No attribute values found. Create values under Product Attributes or add a custom variation row.
                    </div>
                )}
            </div>

            {/* Variations Repeater List / Table */}
            {variations.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '2.5rem 1.5rem',
                        border: '2px dashed #334155',
                        borderRadius: '0.5rem',
                        background: 'rgba(15, 23, 42, 0.5)',
                        marginBottom: '1rem',
                    }}
                >
                    <BoxIcon width="36" height="36" style={{ color: '#475569', margin: '0 auto 0.75rem' }} />
                    <h5 style={{ color: '#E2E8F0', fontSize: '0.95rem', margin: '0 0 0.35rem' }}>
                        No variations added yet
                    </h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.8125rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                        If you leave variations empty, customers will purchase this product as a single item using the Base Price above.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={addCustomVariation}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                background: 'transparent',
                                border: '1px solid #475569',
                                color: '#F8FAFC',
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                            }}
                        >
                            + Add Custom Variation Row
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ marginBottom: '1.25rem' }}>
                    {/* Active variations stats bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.8125rem', color: '#CBD5E1' }}>
                            <strong>{variations.length}</strong> variation{variations.length === 1 ? '' : 's'} configured
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {onSyncBasePrice && (
                                <button
                                    type="button"
                                    onClick={handleSyncToProductBase}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '0.375rem',
                                        background: 'rgba(184, 142, 75, 0.15)',
                                        border: '1px solid rgba(184, 142, 75, 0.4)',
                                        color: '#F1D7B4',
                                        cursor: 'pointer',
                                    }}
                                    title="Copy default variation price to base product price"
                                >
                                    ⚡ Sync Default Price to Base Product
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={addCustomVariation}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    background: '#1E293B',
                                    border: '1px solid #334155',
                                    color: '#E2E8F0',
                                    cursor: 'pointer',
                                }}
                            >
                                + Add Row
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div style={{ overflowX: 'auto', borderRadius: '0.5rem', border: '1px solid #1E293B' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', background: '#141E33' }}>
                            <thead>
                                <tr style={{ background: '#1E293B', color: '#94A3B8', textAlign: 'left', borderBottom: '1px solid #1E293B' }}>
                                    <th style={{ padding: '0.65rem 0.75rem', width: '50px', textAlign: 'center' }} title="Default variation">
                                        Default
                                    </th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '160px' }}>Variation Name *</th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '110px' }}>MRP (₹) *</th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '120px' }}>Selling Price (₹) *</th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '85px' }}>Stock Qty</th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '130px' }}>Weight &amp; Unit</th>
                                    <th style={{ padding: '0.65rem 0.75rem', minWidth: '110px' }}>SKU</th>
                                    <th style={{ padding: '0.65rem 0.75rem', width: '50px', textAlign: 'center' }}>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variations.map((v, index) => {
                                    const reg = Number(v.price) || 0;
                                    const sell = Number(v.selling_price) || 0;
                                    const discount = reg > sell && reg > 0 ? Math.round(((reg - sell) / reg) * 100) : 0;

                                    const nameErr = errors[`variations.${index}.variation_name`];
                                    const priceErr = errors[`variations.${index}.price`];
                                    const sellErr = errors[`variations.${index}.selling_price`];
                                    const qtyErr = errors[`variations.${index}.product_qty`];

                                    return (
                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom: '1px solid #1E293B',
                                                background: v.is_default ? 'rgba(184, 142, 75, 0.08)' : 'transparent',
                                            }}
                                        >
                                            {/* Default radio */}
                                            <td style={{ padding: '0.5rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                                <input
                                                    type="radio"
                                                    name="default_variation"
                                                    checked={Boolean(v.is_default)}
                                                    onChange={() => setDefaultVariation(index)}
                                                    title="Mark this as the primary / default variation"
                                                    style={{ accentColor: '#B88E4B', cursor: 'pointer', width: '16px', height: '16px' }}
                                                />
                                            </td>

                                            {/* Variation Name */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={v.variation_name}
                                                    onChange={(e) => handleFieldChange(index, 'variation_name', e.target.value)}
                                                    placeholder="e.g. 500g Pack"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.45rem 0.65rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#0F172A',
                                                        border: nameErr ? '1px solid #F87171' : '1px solid #1E293B',
                                                        color: '#F8FAFC',
                                                        fontSize: '0.8125rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                {v._attribute_value_label && (
                                                    <span style={{ fontSize: '0.65rem', color: '#B88E4B', marginTop: '2px', display: 'block' }}>
                                                        Attr: {v._attribute_value_label}
                                                    </span>
                                                )}
                                                {nameErr && <div style={{ color: '#F87171', fontSize: '0.7rem' }}>{nameErr}</div>}
                                            </td>

                                            {/* MRP Price */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={v.price}
                                                    onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                                                    placeholder="0.00"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.45rem 0.65rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#0F172A',
                                                        border: priceErr ? '1px solid #F87171' : '1px solid #1E293B',
                                                        color: '#CBD5E1',
                                                        fontSize: '0.8125rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                {priceErr && <div style={{ color: '#F87171', fontSize: '0.7rem' }}>{priceErr}</div>}
                                            </td>

                                            {/* Selling Price */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={v.selling_price}
                                                        onChange={(e) => handleFieldChange(index, 'selling_price', e.target.value)}
                                                        placeholder="0.00"
                                                        required
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.45rem 0.65rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#0F172A',
                                                            border: sellErr ? '1px solid #F87171' : '1px solid #1E293B',
                                                            color: '#F1D7B4',
                                                            fontWeight: 600,
                                                            fontSize: '0.8125rem',
                                                            outline: 'none',
                                                        }}
                                                    />
                                                </div>
                                                {discount > 0 && (
                                                    <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                                                        {discount}% OFF
                                                    </span>
                                                )}
                                                {sellErr && <div style={{ color: '#F87171', fontSize: '0.7rem' }}>{sellErr}</div>}
                                            </td>

                                            {/* Quantity */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={v.product_qty}
                                                    onChange={(e) => handleFieldChange(index, 'product_qty', e.target.value)}
                                                    placeholder="1"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.45rem 0.65rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#0F172A',
                                                        border: qtyErr ? '1px solid #F87171' : '1px solid #1E293B',
                                                        color: '#F8FAFC',
                                                        fontSize: '0.8125rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                {qtyErr && <div style={{ color: '#F87171', fontSize: '0.7rem' }}>{qtyErr}</div>}
                                            </td>

                                            {/* Weight & Unit */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={v.weight_value ?? ''}
                                                        onChange={(e) => handleFieldChange(index, 'weight_value', e.target.value)}
                                                        placeholder="500"
                                                        style={{
                                                            width: '65px',
                                                            padding: '0.45rem 0.4rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#0F172A',
                                                            border: '1px solid #1E293B',
                                                            color: '#F8FAFC',
                                                            fontSize: '0.8125rem',
                                                            outline: 'none',
                                                        }}
                                                    />
                                                    <select
                                                        value={v.weight_unit || 'g'}
                                                        onChange={(e) => handleFieldChange(index, 'weight_unit', e.target.value)}
                                                        style={{
                                                            padding: '0.45rem 0.4rem',
                                                            borderRadius: '0.375rem',
                                                            background: '#0F172A',
                                                            border: '1px solid #1E293B',
                                                            color: '#F8FAFC',
                                                            fontSize: '0.8125rem',
                                                            outline: 'none',
                                                        }}
                                                    >
                                                        <option value="g">g</option>
                                                        <option value="kg">kg</option>
                                                        <option value="pcs">pcs</option>
                                                        <option value="box">box</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* SKU */}
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={v.sku || ''}
                                                    onChange={(e) => handleFieldChange(index, 'sku', e.target.value)}
                                                    placeholder="SKU"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.45rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        background: '#0F172A',
                                                        border: '1px solid #1E293B',
                                                        color: '#CBD5E1',
                                                        fontSize: '0.75rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </td>

                                            {/* Delete Button */}
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariation(index)}
                                                    style={{
                                                        background: 'rgba(225, 29, 72, 0.1)',
                                                        border: '1px solid rgba(225, 29, 72, 0.25)',
                                                        color: '#FB7185',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        padding: '0.3rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontWeight: 700,
                                                    }}
                                                    title="Remove this variation"
                                                >
                                                    &times;
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
