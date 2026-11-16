import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [rate, setRate] = useState('');
    const [type, setType] = useState('percent');
    const [taxClass, setTaxClass] = useState('standard');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isCompound, setIsCompound] = useState(false);
    const [applyToShipping, setApplyToShipping] = useState(false);
    const [priority, setPriority] = useState(1);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const payload = {
            name,
            code,
            rate: Number(rate) || 0,
            type,
            tax_class: taxClass,
            description,
            is_active: isActive,
            is_compound: isCompound,
            apply_to_shipping: applyToShipping,
            priority: Number(priority) || 1,
        };

        router.post(route('admin.taxes.store'), payload, {
            onFinish: () => setProcessing(false),
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout header="Add Tax Rate">
            <Head title="Add Tax Rate - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <Link
                            href={route('admin.taxes.index')}
                            style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}
                        >
                            Taxes &amp; GST Rates
                        </Link>
                        <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                        <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>
                            Add Rate
                        </span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        Add New Tax Rate
                    </h1>
                </div>

                <form onSubmit={handleSubmit} style={{ maxWidth: '780px' }}>
                    <div className="dayal-admin-table-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Tax Name <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. GST 5% (Mithai & Traditional Sweets)"
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                />
                                {errors.name && (
                                    <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.name}</span>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Tax Code <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. GST-5 or GST-12"
                                    required
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                />
                                {errors.code && (
                                    <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.code}</span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Rate % <span style={{ color: '#E11D48' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        placeholder="5.00"
                                        required
                                        style={{ width: '100%', padding: '0.55rem 1.8rem 0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                                    />
                                    <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 700 }}>
                                        %
                                    </span>
                                </div>
                                {errors.rate && (
                                    <span style={{ color: '#E11D48', fontSize: '0.75rem', fontWeight: 600 }}>{errors.rate}</span>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Rate Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', background: '#FFFFFF' }}
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                    Tax Class
                                </label>
                                <select
                                    value={taxClass}
                                    onChange={(e) => setTaxClass(e.target.value)}
                                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', background: '#FFFFFF' }}
                                >
                                    <option value="standard">Standard Rate</option>
                                    <option value="reduced_rate">Reduced Rate</option>
                                    <option value="zero_rate">Zero Rate</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                Description / Notes
                            </label>
                            <textarea
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Applicable to all pure desi ghee sweets according to GST council guidelines."
                                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1' }}
                            />
                        </div>

                        {/* Options checkboxes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', marginBottom: '1.25rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#0F172A', cursor: 'pointer', fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    style={{ accentColor: '#B88E4B' }}
                                />
                                Tax rate is active and available for product selection
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={applyToShipping}
                                    onChange={(e) => setApplyToShipping(e.target.checked)}
                                    style={{ accentColor: '#B88E4B' }}
                                />
                                Apply this tax rate to shipping fees as well
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isCompound}
                                    onChange={(e) => setIsCompound(e.target.checked)}
                                    style={{ accentColor: '#B88E4B' }}
                                />
                                Compound tax (calculated on top of other taxes)
                            </label>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                            <Link
                                href={route('admin.taxes.index')}
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
                                {processing ? 'Saving...' : 'Save Tax Rate'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
