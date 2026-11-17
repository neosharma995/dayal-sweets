import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheckIcon, KeyIcon, CheckCircleIcon } from '@/Components/Icons';

export default function AdminLogin({ status, defaultEmail = 'admin@dayalsweets.com', defaultPassword = 'password', submitUrl }) {
    const [showPassword, setShowPassword] = useState(false);
    const [justFilled, setJustFilled] = useState(false);

    const targetUrl = submitUrl || (window.location.pathname.startsWith('/admin') ? route('admin.login.store') : route('login'));

    const { data, setData, post, processing, errors, reset } = useForm({
        email: defaultEmail,
        password: defaultPassword,
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(targetUrl, {
            onFinish: () => reset('password'),
        });
    };

    const handleAutoFill = () => {
        setData((prev) => ({
            ...prev,
            email: defaultEmail,
            password: defaultPassword,
        }));
        setJustFilled(true);
        setTimeout(() => setJustFilled(false), 2000);
    };

    return (
        <div className="dayal-admin-login-body">
            <Head title="Admin Portal Sign In - Dayal Sweets" />

            {/* Ambient Background Floating Glows */}
            <div className="login-ambient-orb login-ambient-orb--gold" />
            <div className="login-ambient-orb login-ambient-orb--maroon" />

         

            <div className="dayal-admin-login-container">
                <div className="dayal-admin-login-card">
                    {/* Header Brand */}
                    <div className="dayal-admin-login-header">
                        <div className="dayal-admin-brand-icon-wrap">
                            <div className="dayal-admin-brand-icon">
                                DS
                            </div>
                            <span className="dayal-live-dot" title="Store System Active" />
                        </div>

                        <div>
                           
                            <h1 className="dayal-admin-portal-title">Dayal Sweets</h1>
                            
                        </div>
                    </div>

                    {/* Status Alert */}
                    {status && (
                        <div
                            style={{
                                marginBottom: '1.25rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#065F46',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.8125rem',
                            }}
                        >
                            <CheckCircleIcon width="16" height="16" />
                            <span>{status}</span>
                        </div>
                    )}

                

                    {/* Login Form */}
                    <form onSubmit={submit}>
                        {/* Email Field */}
                        <div className="dayal-admin-form-group">
                            <label htmlFor="email">
                                <span>Administrator Email</span>
                            </label>
                            <div className="admin-input-wrapper">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    placeholder="admin@dayalsweets.com"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <svg className="input-lead-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                            </div>
                            {errors.email && (
                                <p className="admin-error-text">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="dayal-admin-form-group">
                            <label htmlFor="password">
                                <span>Security Password</span>
                            </label>
                            <div className="admin-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <span className="input-lead-icon">
                                    <KeyIcon width="16" height="16" />
                                </span>
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="admin-error-text">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Remember Session */}
                        <div className="dayal-admin-remember-row">
                            <label className="remember-label">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Remember this workstation</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="dayal-admin-login-btn"
                        >
                            {processing ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" strokeWidth="3" stroke="currentColor" strokeDasharray="32" strokeLinecap="round" />
                                    </svg>
                                    <span>Verifying Credentials...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheckIcon width="16" height="16" />
                                    <span>Sign In to Admin Portal</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Nav Links */}
                    <div className="dayal-admin-login-footer-links">
                        <Link href="/" title="Return to public sweet shop">
                            ← Back to Website
                        </Link>
                        <Link href={route('contact')} title="Dayal Sweets Support">
                            Need Help? Contact Store →
                        </Link>
                    </div>
                </div>

                
            </div>
        </div>
    );
}
