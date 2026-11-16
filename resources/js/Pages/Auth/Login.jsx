import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    CheckCircle2,
    ShieldCheck,
    Gift,
    LogIn,
    UserPlus,
    ArrowRight,
    Sparkles,
    Check,
    X,
    Loader2,
    Shield,
    Leaf,
    PhoneCall
} from 'lucide-react';

export default function Login({
    status,
    canResetPassword = true,
    defaultEmail = 'customer@dayalsweets.com',
    defaultPassword = 'password',
    canRegister = true,
}) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
    const [demoFilledRole, setDemoFilledRole] = useState(null);

    // Login Form State
    const loginForm = useForm({
        email: defaultEmail,
        password: defaultPassword,
        remember: true,
    });

    // Register Form State (Customer Role)
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    const fillCredentials = (role, email, password) => {
        setMode('login');
        setDemoFilledRole(role);
        loginForm.setData({
            ...loginForm.data,
            email,
            password,
        });
        setTimeout(() => setDemoFilledRole(null), 2500);
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

    const pwdStrength = getPasswordStrength(registerForm.data.password);
    const hasEnteredConfirm = registerForm.data.password_confirmation.length > 0;
    const isMatching =
        hasEnteredConfirm &&
        registerForm.data.password === registerForm.data.password_confirmation;
    const isMismatching =
        hasEnteredConfirm &&
        registerForm.data.password !== registerForm.data.password_confirmation;

    return (
        <GuestLayout
            title={mode === 'login' ? 'Sign In to Your Account' : 'Create Customer Account'}
            subtitle={
                mode === 'login'
                    ? 'Access your orders, track shipments & sweet reward points.'
                    : 'Join Dayal Sweets & receive 100 bonus reward points.'
            }
            hideTitleBlock={true}
        >
            <Head title={mode === 'login' ? 'Sign In - Dayal Sweets' : 'Create Account - Dayal Sweets'} />

            {/* Modern Segmented Tab Switcher */}
            <div className="dayal-auth-segmented-switch" role="tablist" aria-label="Sign In or Register">
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'login'}
                    className={`segmented-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => setMode('login')}
                >
                    <LogIn size={15} />
                    <span>Sign In</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'register'}
                    className={`segmented-tab ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => setMode('register')}
                >
                    <UserPlus size={15} />
                    <span>Create Account</span>
                    <span className="perk-badge">🎁 +100 Pts</span>
                </button>
            </div>

            {/* Status Alert if redirected from password reset */}
            {status && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>{status}</span>
                </div>
            )}

            {/* ========================================================= */}
            {/* 1. SIGN IN MODE                                           */}
            {/* ========================================================= */}
            {mode === 'login' && (
                <div>
                    <div className="dayal-auth-welcome-header">
                        <span className="auth-pretitle">
                            <Sparkles size={13} />
                            <span>Namaste &amp; Welcome Back</span>
                        </span>
                        <h2>Sign In to Account</h2>
                        <p>
                            Enter your credentials to access your dashboard, order history &amp; Mithai Club rewards.
                        </p>
                    </div>

                    {/* Quick 1-Click Demo Bar */}
                    <div className="dayal-modern-demo-bar">
                        <span className="demo-hint">⚡ 1-Click Demo:</span>
                        <div className="demo-chips-group">
                            <button
                                type="button"
                                onClick={() => fillCredentials('customer', 'customer@dayalsweets.com', 'password')}
                                className={`demo-chip ${demoFilledRole === 'customer' ? 'filled' : ''}`}
                                title="Pre-fill customer account"
                            >
                                <User size={13} />
                                <span>{demoFilledRole === 'customer' ? '✓ Filled Customer' : 'Customer Demo'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin', 'admin@dayalsweets.com', 'password')}
                                className={`demo-chip ${demoFilledRole === 'admin' ? 'filled' : ''}`}
                                title="Pre-fill store admin account"
                            >
                                <ShieldCheck size={13} />
                                <span>{demoFilledRole === 'admin' ? '✓ Filled Admin' : 'Admin Demo'}</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLoginSubmit}>
                        {/* Email Address */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="login-email">Email Address</label>
                            </div>
                            <div className="field-input-box">
                                <Mail size={17} className="field-icon-left" />
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={loginForm.data.email}
                                    autoComplete="username"
                                    placeholder="your-email@example.com"
                                    autoFocus
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {loginForm.errors.email && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{loginForm.errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="login-password">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="forgot-link">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="field-input-box">
                                <Lock size={17} className="field-icon-left" />
                                <input
                                    id="login-password"
                                    type={showLoginPassword ? 'text' : 'password'}
                                    name="password"
                                    value={loginForm.data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="field-eye-btn"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {loginForm.errors.password && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{loginForm.errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        accentColor: '#631826',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                />
                                <span>Remember this device</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginForm.processing}
                            className="dayal-modern-submit-btn"
                        >
                            {loginForm.processing ? (
                                <>
                                    <Loader2 size={16} className="spin-icon" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Account</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Switcher */}
                    <div className="dayal-auth-footer">
                        <span>New to Dayal Sweets?</span>
                        <button
                            type="button"
                            className="dayal-auth-switch-link"
                            onClick={() => setMode('register')}
                        >
                            Create a Customer Account (+100 Pts) →
                        </button>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 2. REGISTER / CREATE ACCOUNT MODE                         */}
            {/* ========================================================= */}
            {mode === 'register' && (
                <div>
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

                    {/* 100 Welcome Points Perk Card */}
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

                    <form onSubmit={handleRegisterSubmit}>
                        {/* Full Name */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="reg-name">Full Name</label>
                            </div>
                            <div className="field-input-box">
                                <User size={17} className="field-icon-left" />
                                <input
                                    id="reg-name"
                                    type="text"
                                    name="name"
                                    value={registerForm.data.name}
                                    autoComplete="name"
                                    placeholder="e.g. Rahul Sharma"
                                    autoFocus
                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.name && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{registerForm.errors.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Email Address */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="reg-email">Email Address</label>
                            </div>
                            <div className="field-input-box">
                                <Mail size={17} className="field-icon-left" />
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    value={registerForm.data.email}
                                    autoComplete="username"
                                    placeholder="name@example.com"
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.email && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{registerForm.errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="reg-password">Create Password</label>
                                <span style={{ fontSize: '11px', color: '#64748B' }}>Min 8 characters</span>
                            </div>
                            <div className="field-input-box">
                                <Lock size={17} className="field-icon-left" />
                                <input
                                    id="reg-password"
                                    type={showRegPassword ? 'text' : 'password'}
                                    name="password"
                                    value={registerForm.data.password}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => registerForm.setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="field-eye-btn"
                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                    title={showRegPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Live Password Strength Meter */}
                            {registerForm.data.password.length > 0 && (
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

                            {registerForm.errors.password && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{registerForm.errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="dayal-modern-field">
                            <div className="field-top-row">
                                <label htmlFor="reg-password-confirmation">Confirm Password</label>
                            </div>
                            <div className="field-input-box">
                                <Lock size={17} className="field-icon-left" />
                                <input
                                    id="reg-password-confirmation"
                                    type={showRegConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={registerForm.data.password_confirmation}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="field-eye-btn"
                                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                                    title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

                            {registerForm.errors.password_confirmation && (
                                <div className="field-error-msg">
                                    <X size={13} />
                                    <span>{registerForm.errors.password_confirmation}</span>
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
                            disabled={registerForm.processing}
                            className="dayal-modern-submit-btn"
                        >
                            {registerForm.processing ? (
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
                        <span>Already registered?</span>
                        <button
                            type="button"
                            className="dayal-auth-switch-link"
                            onClick={() => setMode('login')}
                        >
                            Sign In to Account →
                        </button>
                    </div>
                </div>
            )}

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
