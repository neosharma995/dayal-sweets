import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { KeyIcon, UserIcon, ShieldCheckIcon } from '@/Components/Icons';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillCredentials = (email, password) => {
        setData((prev) => ({
            ...prev,
            email,
            password,
        }));
    };

    return (
        <GuestLayout
            title="Sign In to Your Account"
            subtitle="Access your Dayal Sweets dashboard, active orders, and account privileges"
        >
            <Head title="Sign In - Dayal Sweets" />

            {status && (
                <div className="dayal-alert dayal-alert--success dayal-mb-4">
                    {status}
                </div>
            )}

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

            <form onSubmit={submit}>
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
                            value={data.email}
                            autoComplete="username"
                            placeholder="admin@dayalsweets.com or customer@dayalsweets.com"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="error-message">{errors.email}</p>}
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
                            value={data.password}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                {/* Remember Me */}
                <div className="dayal-mb-4">
                    <label className="dayal-checkbox-label">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="dayal-checkbox"
                        />
                        <span>Remember this device</span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn"
                >
                    {processing ? 'Signing In...' : 'Sign In to Account'}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="dayal-auth-footer">
                New to Dayal Sweets?{' '}
                <Link href={route('register')}>
                    Create a Free Customer Account →
                </Link>
            </div>
        </GuestLayout>
    );
}
