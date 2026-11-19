import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');

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
            heroTitle="CREATE ACCOUNT"
            heroDescription="Create your account in seconds to start ordering fresh authentic sweets"
            breadcrumbLabel="REGISTER"
        >
            <Head title="Register - Dayal Sweets" />

            {/* Segmented Mode Switcher Tabs */}
            <div className="dayal-otp-tabs pos-register" role="tablist">
                <Link
                    href={route('login')}
                    className="dayal-otp-tab"
                >
                    Login
                </Link>
                <div className="dayal-otp-tab active">
                    New Register
                </div>
            </div>

            <div className="dayal-auth-pane" id="dayal-pane-register">
                <form onSubmit={submit} noValidate>
                    {/* Full Name */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_reg_fullname">Full Name</label>
                        <input
                            type="text"
                            id="dayal_reg_fullname"
                            name="name"
                            value={data.name}
                            placeholder="e.g. Ramesh Kumar"
                            required
                            autoFocus
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <div className="dayal-notice error" style={{ marginTop: '6px' }}>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Mobile Phone Number */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_reg_phone">Mobile Phone Number</label>
                        <div className="dayal-phone-input-wrapper">
                            <span className="dayal-country-code">+91</span>
                            <input
                                type="tel"
                                id="dayal_reg_phone"
                                name="phone"
                                placeholder="9876543210"
                                maxLength={10}
                                value={phone}
                                autoComplete="tel"
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_reg_email">Email Address</label>
                        <input
                            type="email"
                            id="dayal_reg_email"
                            name="email"
                            value={data.email}
                            placeholder="ramesh@example.com"
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

                    {/* Create Password */}
                    <div className="dayal-otp-form-group">
                        <label htmlFor="dayal_reg_password">Create Password</label>
                        <div className="dayal-password-input-wrap">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="dayal_reg_password"
                                name="password"
                                value={data.password}
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        password: e.target.value,
                                        password_confirmation: e.target.value,
                                    });
                                }}
                            />
                            <button
                                type="button"
                                className="dayal-toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                                aria-label="Show or hide password"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="dayal-notice error" style={{ marginTop: '6px' }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="dayal-otp-btn-submit"
                        id="dayal-register-send-otp-btn"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={16} className="spin-animation" style={{ marginRight: '6px' }} />
                                <span>REGISTERING...</span>
                            </>
                        ) : (
                            <span>CREATE ACCOUNT</span>
                        )}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
