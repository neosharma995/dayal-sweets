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

            <div className="mb-5 text-xs text-stone-600 leading-relaxed">
                Thank you for registering! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we'll gladly send another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    A fresh verification link has been sent to your registered email address.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn"
                >
                    {processing ? 'Sending Link...' : 'Resend Verification Email'}
                </button>

                <div className="pt-2 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline"
                    >
                        Sign Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
