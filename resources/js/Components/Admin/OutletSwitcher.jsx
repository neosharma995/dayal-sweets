import React, { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { MapPinIcon } from '@/Components/Icons';

export default function OutletSwitcher() {
    const { outlets = [], activeOutletId, activeOutlet } = usePage().props;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectOutlet = (id) => {
        setOpen(false);
        router.post(
            route('admin.outlets.switch-context'),
            { outlet_id: id },
            { preserveScroll: true }
        );
    };

    const handleClearOutlet = (e) => {
        e.stopPropagation();
        setOpen(false);
        router.post(
            route('admin.outlets.clear-context'),
            {},
            { preserveScroll: true }
        );
    };

    // If no outlets configured in database, don't show switcher
    if (!outlets || outlets.length === 0) {
        return null;
    }

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Switcher Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: activeOutlet ? '1px solid #B88E4B' : '1px solid #CBD5E1',
                    background: activeOutlet ? '#FDF8F0' : '#FFFFFF',
                    color: activeOutlet ? '#8C6226' : '#334155',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease',
                }}
                title={activeOutlet ? `Filtered to: ${activeOutlet.name}` : 'Filter admin by specific outlet'}
            >
                {activeOutlet ? (
                    <MapPinIcon width="14" height="14" style={{ color: '#B88E4B' }} />
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                )}

                <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeOutlet ? activeOutlet.name : 'All Outlets'}
                </span>

                {activeOutlet ? (
                    <span
                        onClick={handleClearOutlet}
                        title="Clear outlet filter (Show all)"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#E6D2B5',
                            color: '#8C6226',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            lineHeight: 1,
                            marginLeft: '0.2rem',
                            cursor: 'pointer',
                        }}
                    >
                        &times;
                    </span>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.6 }}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                )}
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        width: '270px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                        zIndex: 999,
                        padding: '0.5rem 0',
                    }}
                >
                    <div style={{ padding: '0.4rem 0.85rem 0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
                            Outlet Context Filter
                        </div>

                    </div>

                    {/* All Outlets Option */}
                    <button
                        type="button"
                        onClick={() => handleSelectOutlet(null)}
                        style={{
                            width: '100%',
                            padding: '0.55rem 0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: 'none',
                            background: !activeOutlet ? '#F8FAFC' : 'transparent',
                            color: !activeOutlet ? '#B88E4B' : '#0F172A',
                            fontWeight: !activeOutlet ? 700 : 500,
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = !activeOutlet ? '#F8FAFC' : 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                            </svg>
                            <span>All Outlets</span>
                        </div>
                        {!activeOutlet && (
                            <span style={{ fontSize: '0.75rem', color: '#B88E4B', fontWeight: 700 }}>✓</span>
                        )}
                    </button>

                    <div style={{ height: '1px', background: '#F1F5F9', margin: '0.35rem 0' }} />

                    {/* Outlets List */}
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {outlets.map((outlet) => {
                            const isSelected = activeOutletId && Number(activeOutletId) === Number(outlet.id);
                            return (
                                <button
                                    key={outlet.id}
                                    type="button"
                                    onClick={() => handleSelectOutlet(outlet.id)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: 'none',
                                        background: isSelected ? '#FDF8F0' : 'transparent',
                                        color: isSelected ? '#8C6226' : '#1E293B',
                                        fontWeight: isSelected ? 700 : 500,
                                        fontSize: '0.8125rem',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.12s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? '#FDF8F0' : 'transparent')}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPinIcon width="14" height="14" style={{ color: isSelected ? '#B88E4B' : '#94A3B8' }} />
                                        <div>
                                            <div style={{ lineHeight: 1.2 }}>{outlet.name}</div>
                                            {outlet.city && (
                                                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>
                                                    {outlet.city}{outlet.is_flagship ? ' • Flagship' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <span style={{ fontSize: '0.75rem', color: '#B88E4B', fontWeight: 700 }}>✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
