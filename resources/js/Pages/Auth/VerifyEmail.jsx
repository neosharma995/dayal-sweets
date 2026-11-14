import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout
            title="Verify Your Email Address"
            subtitle="Please check your inbox to confirm your Dayal Sweets account"
        >
            <Head title="Email Verification - Dayal Sweets" />

            <div className="dayal-mb-4 dayal-text-muted">
                Thank you for registering! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we'll gladly send another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="dayal-alert dayal-alert--success dayal-mb-4">
                    A fresh verification link has been sent to your registered email address.
                </div>
            )}

            <form onSubmit={submit}>
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn"
                >
                    {processing ? 'Sending Link...' : 'Resend Verification Email'}
                </button>

                <div className="dayal-text-center dayal-mt-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="dayal-text-muted"
                    >
                        Sign Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
