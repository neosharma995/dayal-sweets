import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Loader2 } from 'lucide-react';

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
            heroTitle="LOST PASSWORD"
            heroDescription="Lost your password? Please enter your username or email address."
            breadcrumbLabel="LOST PASSWORD"
        >
            <Head title="Lost Password - Dayal Sweets" />

            {status && (
                <div className="dayal-notice success">
                    <span>{status}</span>
                </div>
            )}

            <div className="dayal-auth-pane" id="dayal-pane-forgot">
                <form onSubmit={submit} noValidate>
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_lost_email">Username or email address</label>
                        <input
                            type="email"
                            id="dayal_lost_email"
                            name="email"
                            value={data.email}
                            placeholder="Enter username or email address"
                            autoFocus
                            required
                            autoComplete="email"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <div className="dayal-notice error" style={{ marginTop: '6px' }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="dayal-otp-btn-submit"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={16} className="spin-animation" style={{ marginRight: '6px' }} />
                                <span>SENDING RESET LINK...</span>
                            </>
                        ) : (
                            <span>RESET PASSWORD</span>
                        )}
                    </button>
                </form>

                <Link href={route('login')} className="dayal-forgot-password">
                    ← Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}
