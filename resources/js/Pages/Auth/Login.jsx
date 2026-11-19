import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword = true,
    defaultEmail = 'customer@dayalsweets.com',
    defaultPassword = 'password',
    canRegister = true,
}) {
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [demoFilledRole, setDemoFilledRole] = useState(null);

    // Login Form State
    const loginForm = useForm({
        email: defaultEmail,
        password: defaultPassword,
        remember: true,
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const fillCredentials = (role, email, password) => {
        setDemoFilledRole(role);
        loginForm.setData({
            ...loginForm.data,
            email,
            password,
        });
        setTimeout(() => setDemoFilledRole(null), 2500);
    };

    return (
        <GuestLayout
            heroTitle="WELCOME BACK"
            heroDescription="Sign in with your password to access your account"
            breadcrumbLabel="LOGIN"
        >
            <Head title="Login - Dayal Sweets" />

            {/* Segmented Mode Switcher Tabs */}
            <div className="dayal-otp-tabs" role="tablist">
                <div className="dayal-otp-tab active">
                    Login
                </div>
                <Link href={route('register')} className="dayal-otp-tab">
                    New Register
                </Link>
            </div>

            {/* Status Alert if redirected */}
            {status && (
                <div className="dayal-notice success">
                    <span>{status}</span>
                </div>
            )}

            {/* LOGIN FORM */}
            <div className="dayal-auth-pane" id="dayal-pane-login">
                <form onSubmit={handleLoginSubmit} noValidate>
                    {/* Username, Email, Or Phone Number */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_login_username">Username, Email, Or Phone Number</label>
                        <input
                            type="text"
                            id="dayal_login_username"
                            name="email"
                            value={loginForm.data.email}
                            placeholder="Enter username, email, or 10-digit phone number"
                            required
                            autoFocus
                            autoComplete="username"
                            onChange={(e) => loginForm.setData('email', e.target.value)}
                        />
                        {loginForm.errors.email && (
                            <div className="dayal-notice error" style={{ marginTop: '6px' }}>
                                {loginForm.errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_login_password">Password</label>
                        <div className="dayal-password-input-wrap">
                            <input
                                type={showLoginPassword ? 'text' : 'password'}
                                id="dayal_login_password"
                                name="password"
                                value={loginForm.data.password}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="dayal-toggle-password"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                title={showLoginPassword ? 'Hide password' : 'Show password'}
                                aria-label="Show or hide password"
                            >
                                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {loginForm.errors.password && (
                            <div className="dayal-notice error" style={{ marginTop: '6px' }}>
                                {loginForm.errors.password}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loginForm.processing}
                        className="dayal-otp-btn-submit"
                        id="dayal-login-submit-btn"
                    >
                        {loginForm.processing ? (
                            <>
                                <Loader2 size={16} className="spin-animation" style={{ marginRight: '6px' }} />
                                <span>LOGGING IN...</span>
                            </>
                        ) : (
                            <span>LOG IN</span>
                        )}
                    </button>
                </form>

                {/* Forgot Password Link */}
                {canResetPassword && (
                    <Link href={route('password.request')} className="dayal-forgot-password">
                        Forgot Password?
                    </Link>
                )}

                {/* Subtle Demo Access Row */}
                <div className="dayal-demo-bar">
                    <span className="demo-title">Demo Accounts:</span>
                    <div className="demo-links">
                        <button
                            type="button"
                            onClick={() => fillCredentials('customer', 'customer@dayalsweets.com', 'password')}
                            className={`demo-pill ${demoFilledRole === 'customer' ? 'active' : ''}`}
                        >
                            {demoFilledRole === 'customer' ? '✓ Customer Filled' : 'Customer'}
                        </button>
                        <span className="demo-divider">•</span>
                        <button
                            type="button"
                            onClick={() => fillCredentials('admin', 'admin@dayalsweets.com', 'password')}
                            className={`demo-pill ${demoFilledRole === 'admin' ? 'active' : ''}`}
                        >
                            {demoFilledRole === 'admin' ? '✓ Admin Filled' : 'Store Admin'}
                        </button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
