import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { KeyIcon, UserIcon, ShieldCheckIcon, StarIcon, CheckCircleIcon } from '@/Components/Icons';

export default function Login({ status, canResetPassword, defaultEmail = '', defaultPassword = '' }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'

    // Login Form State
    const loginForm = useForm({
        email: defaultEmail,
        password: defaultPassword,
        remember: true,
    });

    // Register Form State (Customer Role)
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    const fillCredentials = (email, password) => {
        setMode('login');
        loginForm.setData((prev) => ({
            ...prev,
            email,
            password,
        }));
    };

    return (
        <GuestLayout
            title={mode === 'login' ? 'Sign In to Your Account' : 'Create Customer Account'}
            subtitle={
                mode === 'login'
                    ? 'Access your Dayal Sweets dashboard, active orders, and account privileges'
                    : 'Join Dayal Sweets as a registered Customer & receive 100 bonus reward points'
            }
        >
            <Head title={mode === 'login' ? 'Sign In - Dayal Sweets' : 'Create Account - Dayal Sweets'} />

            {/* Mode Switcher Tabs */}
            <div className="dayal-auth-mode-switch" role="tablist" aria-label="Authentication mode">
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'login'}
                    className={`auth-mode-tab ${mode === 'login' ? 'is-active' : ''}`}
                    onClick={() => setMode('login')}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'register'}
                    className={`auth-mode-tab ${mode === 'register' ? 'is-active' : ''}`}
                    onClick={() => setMode('register')}
                >
                    Create Customer Account
                </button>
            </div>

            {status && (
                <div className="dayal-alert dayal-alert--success dayal-mb-4">
                    {status}
                </div>
            )}

            {mode === 'login' ? (
                <>
                    {/* Quick Demo Login Fill Buttons */}
                    <div className="dayal-demo-pills">
                        <span className="dayal-demo-label">
                            ⚡ Quick Demo Credentials (1-Click Fill):
                        </span>
                        <div className="dayal-pills-row">
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin@dayalsweets.com', 'password')}
                                className="dayal-quick-demo-pill"
                            >
                                <ShieldCheckIcon width="14" height="14" />
                                <span>Admin Store Manager</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillCredentials('customer@dayalsweets.com', 'password')}
                                className="dayal-quick-demo-pill"
                            >
                                <UserIcon width="14" height="14" />
                                <span>Demo Customer</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLoginSubmit}>
                        {/* Email Address */}
                        <div className="dayal-input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={loginForm.data.email}
                                    autoComplete="username"
                                    placeholder="admin@dayalsweets.com or customer@dayalsweets.com"
                                    autoFocus
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {loginForm.errors.email && <p className="error-message">{loginForm.errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="dayal-input-group">
                            <div className="dayal-flex-between dayal-mb-1">
                                <label htmlFor="password">Password</label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="dayal-text-gold"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="input-wrapper">
                                <KeyIcon className="field-icon" width="16" height="16" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={loginForm.data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {loginForm.errors.password && <p className="error-message">{loginForm.errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="dayal-mb-4">
                            <label className="dayal-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                    className="dayal-checkbox"
                                />
                                <span>Remember this device</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginForm.processing}
                            className="dayal-submit-btn"
                        >
                            {loginForm.processing ? 'Signing In...' : 'Sign In to Account'}
                        </button>
                    </form>

                    {/* Bottom Switcher */}
                    <div className="dayal-auth-footer">
                        New customer to Dayal Sweets?{' '}
                        <button
                            type="button"
                            className="dayal-auth-switch-link"
                            onClick={() => setMode('register')}
                        >
                            Create a Customer Account →
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Customer Role Benefit Notice */}
                    <div className="dayal-role-customer-notice">
                        <CheckCircleIcon width="16" height="16" />
                        <span>Registered as <strong>Customer</strong> • 100 Welcome Points Granted</span>
                    </div>

                    <form onSubmit={handleRegisterSubmit}>
                        {/* Full Name */}
                        <div className="dayal-input-group">
                            <label htmlFor="reg-name">Full Name</label>
                            <div className="input-wrapper">
                                <UserIcon className="field-icon" width="16" height="16" />
                                <input
                                    id="reg-name"
                                    type="text"
                                    name="name"
                                    value={registerForm.data.name}
                                    autoComplete="name"
                                    placeholder="e.g. Amit Sharma"
                                    autoFocus
                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.name && <p className="error-message">{registerForm.errors.name}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="dayal-input-group">
                            <label htmlFor="reg-email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    value={registerForm.data.email}
                                    autoComplete="username"
                                    placeholder="name@example.com"
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.email && <p className="error-message">{registerForm.errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="dayal-input-group">
                            <label htmlFor="reg-password">Password</label>
                            <div className="input-wrapper">
                                <KeyIcon className="field-icon" width="16" height="16" />
                                <input
                                    id="reg-password"
                                    type="password"
                                    name="password"
                                    value={registerForm.data.password}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => registerForm.setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.password && <p className="error-message">{registerForm.errors.password}</p>}
                        </div>

                        {/* Password Confirmation */}
                        <div className="dayal-input-group">
                            <label htmlFor="reg-password-confirmation">Confirm Password</label>
                            <div className="input-wrapper">
                                <KeyIcon className="field-icon" width="16" height="16" />
                                <input
                                    id="reg-password-confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={registerForm.data.password_confirmation}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.password_confirmation && (
                                <p className="error-message">{registerForm.errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={registerForm.processing}
                            className="dayal-submit-btn"
                        >
                            {registerForm.processing ? 'Creating Customer Account...' : 'Create Customer Account'}
                        </button>
                    </form>

                    {/* Bottom Switcher */}
                    <div className="dayal-auth-footer">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="dayal-auth-switch-link"
                            onClick={() => setMode('login')}
                        >
                            Sign In to Account →
                        </button>
                    </div>
                </>
            )}
        </GuestLayout>
    );
}
