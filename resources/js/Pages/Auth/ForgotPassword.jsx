import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Reset Your Password"
            subtitle="Enter your registered email and we'll send you an instant reset link"
        >
            <Head title="Forgot Password - Dayal Sweets" />

            {status && (
                <div className="dayal-alert dayal-alert--success dayal-mb-4">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="dayal-input-group">
                    <label htmlFor="email">Registered Email Address</label>
                    <div className="input-wrapper">
                        <svg className="field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                        </svg>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="Enter your email"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn"
                >
                    {processing ? 'Sending Reset Link...' : 'Email Password Reset Link'}
                </button>
            </form>

            <div className="dayal-auth-footer">
                Remember your password?{' '}
                <Link href={route('login')}>
                    Back to Sign In →
                </Link>
            </div>
        </GuestLayout>
    );
}
