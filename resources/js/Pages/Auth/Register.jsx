import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { UserIcon, StarIcon, KeyIcon } from '@/Components/Icons';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Create Your Account"
            subtitle="Join Dayal Sweets & receive 100 bonus reward points on your first order"
        >
            <Head title="Sign Up - Dayal Sweets" />

            {/* Welcome Perk Pill */}
            <div className="dayal-alert dayal-alert--warning dayal-mb-6">
                <StarIcon width="16" height="16" />
                <div>
                    <strong>Himachal Sweets Club Member Privilege</strong>
                    <p>Receive 100 bonus reward points + Free express delivery on orders above ₹999!</p>
                </div>
            </div>

            <form onSubmit={submit}>
                {/* Full Name */}
                <div className="dayal-input-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                        <UserIcon className="field-icon" width="16" height="16" />
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            placeholder="e.g. Rahul Sharma"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>

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
                            placeholder="name@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="dayal-input-group">
                    <label htmlFor="password">Create Password</label>
                    <div className="input-wrapper">
                        <KeyIcon className="field-icon" width="16" height="16" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            placeholder="Minimum 8 characters"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="dayal-input-group">
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <div className="input-wrapper">
                        <KeyIcon className="field-icon" width="16" height="16" />
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            placeholder="Re-type your password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="error-message">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn"
                >
                    {processing ? 'Creating Your Account...' : 'Register as Customer'}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="dayal-auth-footer">
                Already registered with Dayal Sweets?{' '}
                <Link href={route('login')}>
                    Sign In to Account →
                </Link>
            </div>
        </GuestLayout>
    );
}
