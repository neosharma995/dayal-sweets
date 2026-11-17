import React from 'react';
import { useCart } from '@/Context/CartContext';

export default function CartToaster() {
    const { toast, isToastExiting, dismissToast, openCart } = useCart();

    if (!toast) return null;

    const handleViewCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissToast();
        if (openCart) {
            openCart();
        }
    };

    return (
        <aside
            role="status"
            aria-live="polite"
            className={`dayal-cart-toaster ${isToastExiting ? 'dayal-toast-exit' : 'dayal-toast-enter'}`}
            style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 999999,
                maxWidth: '430px',
                width: 'calc(100vw - 32px)',
                pointerEvents: 'auto',
            }}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E6D7C3',
                    borderLeft: '4px solid #631826',
                    borderRadius: '12px',
                    boxShadow: '0 16px 36px -6px rgba(99, 24, 38, 0.18), 0 6px 16px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    position: 'relative',
                    fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Header row: Check icon, title, and close button */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px 6px 14px',
                        borderBottom: '1px solid #FAF4EE',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: '#ECFDF5',
                                color: '#059669',
                                fontSize: '11px',
                                fontWeight: 700,
                            }}
                        >
                            ✓
                        </span>
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                color: '#059669',
                                textTransform: 'uppercase',
                            }}
                        >
                            Added to Cart
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={dismissToast}
                        aria-label="Close notification"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: 1,
                            padding: '2px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#1E293B'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                        title="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Content row: Image, Product Name, Price, and View Cart CTA */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px 12px 14px',
                    }}
                >
                    {toast.image && (
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#FAF7F2',
                                border: '1px solid #EFE6DC',
                            }}
                        >
                            <img
                                src={toast.image}
                                alt={toast.name || 'Product'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                            style={{
                                margin: '0 0 3px 0',
                                fontSize: '13.5px',
                                fontWeight: 700,
                                color: '#2A1810',
                                lineHeight: 1.3,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            title={toast.name}
                        >
                            {toast.name}
                        </h4>
                        <div
                            style={{
                                fontSize: '12.5px',
                                color: '#7A6355',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <span>
                                Qty: <strong style={{ color: '#2A1810' }}>{toast.quantity || 1}</strong>
                            </span>
                            {typeof toast.price === 'number' && (
                                <>
                                    <span>•</span>
                                    <span style={{ fontWeight: 600, color: '#631826' }}>
                                        ₹{(toast.price * (toast.quantity || 1)).toFixed(2)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleViewCart}
                        style={{
                            background: '#631826',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '7px 14px',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(99, 24, 38, 0.25)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#7D2334';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#631826';
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        View Cart &rarr;
                    </button>
                </div>

                {/* 4-Second Animated Countdown Progress Bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: '#F0E6D8',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            background: '#631826',
                            animation: 'dayalToastCountdown 4s linear forwards',
                        }}
                    />
                </div>
            </div>
        </aside>
    );
}
