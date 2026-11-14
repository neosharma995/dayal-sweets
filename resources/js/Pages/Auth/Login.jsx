import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { KeyIcon, UserIcon, ShieldCheckIcon } from '@/Components/Icons';

export default function Login({ status, canResetPassword, isAdminPortal = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        const targetRoute = isAdminPortal ? route('admin.login.store') : route('login');

        post(targetRoute, {
            onFinish: () => reset('password'),
        });
    };

    // Quick-fill helper for demo testing
    const fillCredentials = (email, password) => {
        setData((prev) => ({
            ...prev,
            email,
            password,
        }));
    };

    return (
        <GuestLayout
            title={isAdminPortal ? 'Admin Console Sign In' : 'Sign In to Your Account'}
            subtitle={
                isAdminPortal
                    ? 'Restricted access for Dayal Sweets store administrators'
                    : 'Access your Dayal Sweets dashboard, active orders, and rewards'
            }
        >
            <Head title={isAdminPortal ? 'Admin Sign In - Dayal Sweets' : 'Sign In - Dayal Sweets'} />

            {status && (
                <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}

            {/* Quick Demo Login Fill Buttons */}
            <div className="mb-6 p-3.5 rounded-lg bg-[#FAF6F0] border border-[#EADBCA]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#631826] block mb-2">
                    ⚡ Quick Demo Credentials (1-Click Fill):
                </span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => fillCredentials('admin@dayalsweets.com', 'password')}
                        className="dayal-quick-demo-pill"
                    >
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-[#631826]" />
                        <span>Admin Store Manager</span>
                    </button>
                    {!isAdminPortal && (
                        <button
                            type="button"
                            onClick={() => fillCredentials('customer@dayalsweets.com', 'password')}
                            className="dayal-quick-demo-pill"
                        >
                            <UserIcon className="w-3.5 h-3.5 text-[#B88E4B]" />
                            <span>Demo Customer</span>
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                            placeholder="admin@dayalsweets.com"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="dayal-input-group">
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="!mb-0">Password</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-[#B88E4B] hover:text-[#631826] font-semibold transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="input-wrapper">
                        <KeyIcon className="field-icon" />
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
                <div className="flex items-center">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-stone-300 text-[#631826] focus:ring-[#631826] w-4 h-4"
                        />
                        <span>Remember this device</span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn mt-2"
                >
                    {processing ? 'Signing In...' : 'Sign In to Account'}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="mt-8 pt-5 border-t border-[#EADBCA] text-center text-xs text-stone-500">
                {isAdminPortal ? (
                    <>
                        Shopping as a customer?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-[#631826] hover:text-[#4A0E1A] hover:underline"
                        >
                            Go to Customer Sign In →
                        </Link>
                    </>
                ) : (
                    <>
                        New to Dayal Sweets?{' '}
                        <Link
                            href={route('register')}
                            className="font-bold text-[#631826] hover:text-[#4A0E1A] hover:underline"
                        >
                            Create a Free Customer Account →
                        </Link>
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
