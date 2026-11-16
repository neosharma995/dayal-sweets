import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Gift,
    ArrowRight,
    Sparkles,
    Check,
    X,
    Loader2,
    Shield,
    Leaf,
    PhoneCall
} from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Real-time password strength checker
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: 'None', color: '#E2E8F0' };
        let score = 1;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) score++;

        if (score === 1) return { score: 1, label: 'Weak', color: '#EF4444' };
        if (score === 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
        if (score === 3) return { score: 3, label: 'Good', color: '#3B82F6' };
        return { score: 4, label: 'Strong', color: '#10B981' };
    };

    const pwdStrength = getPasswordStrength(data.password);
    const hasEnteredConfirm = data.password_confirmation.length > 0;
    const isMatching = hasEnteredConfirm && data.password === data.password_confirmation;

    return (
        <GuestLayout
            title="Create Your Customer Account"
            subtitle="Join Dayal Sweets & receive 100 bonus reward points on your first order"
            hideTitleBlock={true}
        >
            <Head title="Sign Up - Dayal Sweets" />

            <div className="dayal-auth-welcome-header">
                <span className="auth-pretitle">
                    <Sparkles size={13} />
                    <span>Mithai Club Membership</span>
                </span>
                <h2>Join Dayal Sweets</h2>
                <p>
                    Create an account in 30 seconds to enjoy express checkout &amp; instant bonus points.
                </p>
            </div>

            {/* Welcome Perk Card */}
            <div className="dayal-welcome-perk-card">
                <div className="perk-icon-wrap">
                    <Gift size={18} />
                </div>
                <div className="perk-text-wrap">
                    <strong>🎁 100 Welcome Reward Points Included</strong>
                    <p>
                        Get 100 bonus points credited instantly upon signup, redeemable as ₹100 direct discount on sweet boxes!
                    </p>
                </div>
            </div>

            <form onSubmit={submit}>
                {/* Full Name */}
                <div className="dayal-modern-field">
                    <div className="field-top-row">
                        <label htmlFor="name">Full Name</label>
                    </div>
                    <div className="field-input-box">
                        <User size={17} className="field-icon-left" />
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
                    {errors.name && (
                        <div className="field-error-msg">
                            <X size={13} />
                            <span>{errors.name}</span>
                        </div>
                    )}
                </div>

                {/* Email Address */}
                <div className="dayal-modern-field">
                    <div className="field-top-row">
                        <label htmlFor="email">Email Address</label>
                    </div>
                    <div className="field-input-box">
                        <Mail size={17} className="field-icon-left" />
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
                    {errors.email && (
                        <div className="field-error-msg">
                            <X size={13} />
                            <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                {/* Password */}
                <div className="dayal-modern-field">
                    <div className="field-top-row">
                        <label htmlFor="password">Create Password</label>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Min 8 characters</span>
                    </div>
                    <div className="field-input-box">
                        <Lock size={17} className="field-icon-left" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="field-eye-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Live Password Strength Meter */}
                    {data.password.length > 0 && (
                        <div className="pwd-strength-container">
                            <div className="strength-bar-track">
                                {[1, 2, 3, 4].map((seg) => (
                                    <div
                                        key={seg}
                                        className="strength-segment"
                                        style={{
                                            backgroundColor:
                                                pwdStrength.score >= seg ? pwdStrength.color : '#E2E8F0',
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="strength-label-row">
                                <span>Password strength:</span>
                                <span className="strength-status" style={{ color: pwdStrength.color }}>
                                    {pwdStrength.label}
                                </span>
                            </div>
                        </div>
                    )}

                    {errors.password && (
                        <div className="field-error-msg">
                            <X size={13} />
                            <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="dayal-modern-field">
                    <div className="field-top-row">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                    </div>
                    <div className="field-input-box">
                        <Lock size={17} className="field-icon-left" />
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="field-eye-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            aria-label="Toggle password visibility"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Password Match / Mismatch real-time check */}
                    {hasEnteredConfirm && (
                        <div className={`pwd-match-indicator ${isMatching ? 'match' : 'mismatch'}`}>
                            {isMatching ? (
                                <>
                                    <Check size={12} />
                                    <span>Passwords match</span>
                                </>
                            ) : (
                                <>
                                    <X size={12} />
                                    <span>Passwords do not match yet</span>
                                </>
                            )}
                        </div>
                    )}

                    {errors.password_confirmation && (
                        <div className="field-error-msg">
                            <X size={13} />
                            <span>{errors.password_confirmation}</span>
                        </div>
                    )}
                </div>

                {/* Terms Notice */}
                <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                    By creating an account, you agree to Dayal Sweets' Terms of Service and Privacy Policy.
                </p>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-modern-submit-btn"
                >
                    {processing ? (
                        <>
                            <Loader2 size={16} className="spin-icon" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account (+100 Pts)</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {/* Bottom Switcher */}
            <div className="dayal-auth-footer">
                <span>Already registered with Dayal Sweets?</span>
                <Link href={route('login')}>
                    Sign In to Account →
                </Link>
            </div>

            {/* Trust & Guarantee Strip */}
            <div className="dayal-auth-trust-strip">
                <div className="trust-item">
                    <Shield size={13} />
                    <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="trust-item">
                    <Leaf size={13} />
                    <span>100% Pure Desi Ghee</span>
                </div>
                <div className="trust-item">
                    <PhoneCall size={13} />
                    <span>+91 98765 43210</span>
                </div>
            </div>
        </GuestLayout>
    );
}
