import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircleIcon, AlertIcon } from '@/Components/Icons';

export default function FlashToaster() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef(null);
    const exitTimerRef = useRef(null);

    // Watch for new flash messages
    useEffect(() => {
        const msg = flash?.success || flash?.error;
        const type = flash?.success ? 'success' : (flash?.error ? 'error' : null);

        if (msg && type) {
            // Clear any active timers
            if (timerRef.current) clearTimeout(timerRef.current);
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

            setIsExiting(false);
            setToast({
                id: Date.now(),
                type,
                message: msg,
            });

            // Automatically dismiss after 4500ms
            timerRef.current = setTimeout(() => {
                handleClose();
            }, 4500);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        };
    }, [flash?.success, flash?.error]);

    const handleClose = () => {
        setIsExiting(true);
        exitTimerRef.current = setTimeout(() => {
            setToast(null);
            setIsExiting(false);
        }, 250);
    };

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div
            className={`dayal-toaster-container ${isExiting ? 'dayal-toast-exit' : 'dayal-toast-enter'}`}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 99999,
                maxWidth: '420px',
                width: 'calc(100vw - 40px)',
                pointerEvents: 'auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.9rem 1rem 1rem 1rem',
                    background: '#FFFFFF',
                    border: isSuccess ? '1.5px solid #10B981' : '1.5px solid #EF4444',
                    borderRadius: '0.625rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Icon Badge */}
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSuccess ? '#ECFDF5' : '#FEF2F2',
                        color: isSuccess ? '#059669' : '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '0.1rem',
                    }}
                >
                    {isSuccess ? <CheckCircleIcon width="18" height="18" /> : <AlertIcon width="18" height="18" />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <strong
                            style={{
                                fontSize: '0.875rem',
                                color: '#0F172A',
                                fontWeight: 700,
                            }}
                        >
                            {isSuccess ? 'Success' : 'Notice'}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>• auto-closing</span>
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '0.8125rem',
                            color: '#475569',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                        }}
                    >
                        {toast.message}
                    </p>
                </div>

                {/* Close Button 'X' */}
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close notification"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '0.375rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#64748B';
                    }}
                    title="Dismiss notification"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* 4500ms Animated Countdown Progress Bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: isSuccess ? '#A7F3D0' : '#FECDD3',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            background: isSuccess ? '#059669' : '#DC2626',
                            animation: 'dayalToastCountdown 4.5s linear forwards',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
