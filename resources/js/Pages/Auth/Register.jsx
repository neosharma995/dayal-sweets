import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Check,
    X,
    Loader2,
    ShieldCheck
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

    // Password strength check
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: 'None', color: '#E2D9CC' };
        let score = 1;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) score++;

        if (score === 1) return { score: 1, label: 'Weak', color: '#E11D48' };
        if (score === 2) return { score: 2, label: 'Fair', color: '#D97706' };
        if (score === 3) return { score: 3, label: 'Good', color: '#2563EB' };
        return { score: 4, label: 'Strong', color: '#059669' };
    };

    const pwdStrength = getPasswordStrength(data.password);
    const hasEnteredConfirm = data.password_confirmation.length > 0;
    const isMatching = hasEnteredConfirm && data.password === data.password_confirmation;

    return (
        <GuestLayout hideTitleBlock={true}>
            <Head title="Create Account - Dayal Sweets" />

            {/* Segmented Mode Switcher */}
            <div className="dayal-auth-tabs" role="tablist" aria-label="Sign In or Register">
                <Link
                    href={route('login')}
                    className="dayal-auth-tab"
                >
                    Sign In
                </Link>
                <div className="dayal-auth-tab active">
                    Create Account
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-header-block">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">
                        Sign up in seconds to easily order, track shipments, and receive special offers.
                    </p>
                </div>

                <form onSubmit={submit} className="dayal-modern-form">
                    {/* Full Name */}
                    <div className="modern-field-group">
                        <label htmlFor="reg-name">Full Name</label>
                        <div className="modern-input-wrapper">
                            <User size={17} className="input-icon-left" />
                            <input
                                id="reg-name"
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
                            <div className="modern-field-error">
                                <X size={13} />
                                <span>{errors.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Email Address */}
                    <div className="modern-field-group">
                        <label htmlFor="reg-email">Email Address</label>
                        <div className="modern-input-wrapper">
                            <Mail size={17} className="input-icon-left" />
                            <input
                                id="reg-email"
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
                            <div className="modern-field-error">
                                <X size={13} />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="modern-field-group">
                        <div className="label-with-link">
                            <label htmlFor="reg-password">Password</label>
                            <span className="helper-hint">Minimum 8 characters</span>
                        </div>
                        <div className="modern-input-wrapper">
                            <Lock size={17} className="input-icon-left" />
                            <input
                                id="reg-password"
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
                                className="input-eye-button"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Live Password Strength Meter */}
                        {data.password.length > 0 && (
                            <div className="strength-meter-wrapper">
                                <div className="strength-track">
                                    {[1, 2, 3, 4].map((seg) => (
                                        <div
                                            key={seg}
                                            className="strength-step"
                                            style={{
                                                backgroundColor:
                                                    pwdStrength.score >= seg ? pwdStrength.color : '#EADBCA',
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="strength-meta">
                                    <span>Strength:</span>
                                    <span style={{ color: pwdStrength.color, fontWeight: 700 }}>
                                        {pwdStrength.label}
                                    </span>
                                </div>
                            </div>
                        )}

                        {errors.password && (
                            <div className="modern-field-error">
                                <X size={13} />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="modern-field-group">
                        <label htmlFor="reg-password-confirmation">Confirm Password</label>
                        <div className="modern-input-wrapper">
                            <Lock size={17} className="input-icon-left" />
                            <input
                                id="reg-password-confirmation"
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
                                className="input-eye-button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                aria-label="Toggle password visibility"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Confirmation match indicator */}
                        {hasEnteredConfirm && (
                            <div className={`match-badge ${isMatching ? 'match' : 'mismatch'}`}>
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
                            <div className="modern-field-error">
                                <X size={13} />
                                <span>{errors.password_confirmation}</span>
                            </div>
                        )}
                    </div>

                    {/* Terms Notice */}
                    <p className="terms-disclaimer">
                        By continuing, you agree to Dayal Sweets' Terms of Service and Privacy Policy.
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="auth-primary-submit-btn"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={16} className="spin-animation" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Bottom Helper */}
                <div className="auth-bottom-switch">
                    <span>Already registered with us?</span>
                    <Link
                        href={route('login')}
                        className="switch-action-btn"
                    >
                        Sign In to Account
                    </Link>
                </div>
            </div>

            {/* Security Strip */}
            <div className="auth-security-strip">
                <span className="strip-item">
                    <ShieldCheck size={13} />
                    <span>256-Bit SSL Encrypted</span>
                </span>
                <span className="strip-sep">•</span>
                <span className="strip-item">
                    <span>100% Pure Desi Ghee</span>
                </span>
                <span className="strip-sep">•</span>
                <span className="strip-item">
                    <span>Authentic Since 1952</span>
                </span>
            </div>
        </GuestLayout>
    );
}
