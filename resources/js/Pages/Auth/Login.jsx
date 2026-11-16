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
    ArrowRight,
    Check,
    X,
    Loader2,
    ShieldCheck
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

    const pwdStrength = getPasswordStrength(registerForm.data.password);
    const hasEnteredConfirm = registerForm.data.password_confirmation.length > 0;
    const isMatching =
        hasEnteredConfirm &&
        registerForm.data.password === registerForm.data.password_confirmation;

    return (
        <GuestLayout hideTitleBlock={true}>
            <Head title={mode === 'login' ? 'Sign In - Dayal Sweets' : 'Create Account - Dayal Sweets'} />

            {/* Segmented Mode Switcher */}
            <div className="dayal-auth-tabs" role="tablist" aria-label="Sign In or Register">
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'login'}
                    className={`dayal-auth-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => setMode('login')}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'register'}
                    className={`dayal-auth-tab ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => setMode('register')}
                >
                    Create Account
                </button>
            </div>

            {/* Status Alert if redirected from password reset */}
            {status && (
                <div className="dayal-auth-alert success">
                    <CheckCircle2 size={16} />
                    <span>{status}</span>
                </div>
            )}

            {/* ========================================================= */}
            {/* 1. SIGN IN MODE                                           */}
            {/* ========================================================= */}
            {mode === 'login' && (
                <div className="auth-form-container">
                    <div className="auth-header-block">
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">
                            Please sign in with your email and password to access your account.
                        </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="dayal-modern-form">
                        {/* Email Address */}
                        <div className="modern-field-group">
                            <label htmlFor="login-email">Email Address</label>
                            <div className="modern-input-wrapper">
                                <Mail size={17} className="input-icon-left" />
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
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{loginForm.errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="modern-field-group">
                            <div className="label-with-link">
                                <label htmlFor="login-password">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="auth-forgot-link">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="modern-input-wrapper">
                                <Lock size={17} className="input-icon-left" />
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
                                    className="input-eye-button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {loginForm.errors.password && (
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{loginForm.errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="remember-row">
                            <label className="remember-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                />
                                <span>Remember this device</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginForm.processing}
                            className="auth-primary-submit-btn"
                        >
                            {loginForm.processing ? (
                                <>
                                    <Loader2 size={16} className="spin-animation" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Subtle Demo Access Row */}
                    <div className="auth-demo-bar">
                        <span className="demo-title">Demo Accounts:</span>
                        <div className="demo-links">
                            <button
                                type="button"
                                onClick={() => fillCredentials('customer', 'customer@dayalsweets.com', 'password')}
                                className={`demo-pill ${demoFilledRole === 'customer' ? 'active' : ''}`}
                            >
                                {demoFilledRole === 'customer' ? '✓ Customer Filled' : 'Customer'}
                            </button>
                            <span className="demo-divider">•</span>
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin', 'admin@dayalsweets.com', 'password')}
                                className={`demo-pill ${demoFilledRole === 'admin' ? 'active' : ''}`}
                            >
                                {demoFilledRole === 'admin' ? '✓ Admin Filled' : 'Store Admin'}
                            </button>
                        </div>
                    </div>

                    {/* Bottom Helper */}
                    <div className="auth-bottom-switch">
                        <span>Don't have an account yet?</span>
                        <button
                            type="button"
                            className="switch-action-btn"
                            onClick={() => setMode('register')}
                        >
                            Create an Account
                        </button>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 2. REGISTER / CREATE ACCOUNT MODE                         */}
            {/* ========================================================= */}
            {mode === 'register' && (
                <div className="auth-form-container">
                    <div className="auth-header-block">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">
                            Sign up in seconds to easily order, track shipments, and receive special offers.
                        </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="dayal-modern-form">
                        {/* Full Name */}
                        <div className="modern-field-group">
                            <label htmlFor="reg-name">Full Name</label>
                            <div className="modern-input-wrapper">
                                <User size={17} className="input-icon-left" />
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
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{registerForm.errors.name}</span>
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
                                    value={registerForm.data.email}
                                    autoComplete="username"
                                    placeholder="name@example.com"
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {registerForm.errors.email && (
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{registerForm.errors.email}</span>
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
                                    className="input-eye-button"
                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                    title={showRegPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Live Password Strength Meter */}
                            {registerForm.data.password.length > 0 && (
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

                            {registerForm.errors.password && (
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{registerForm.errors.password}</span>
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
                                    className="input-eye-button"
                                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                                    title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                                    aria-label="Toggle password visibility"
                                >
                                    {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

                            {registerForm.errors.password_confirmation && (
                                <div className="modern-field-error">
                                    <X size={13} />
                                    <span>{registerForm.errors.password_confirmation}</span>
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
                            disabled={registerForm.processing}
                            className="auth-primary-submit-btn"
                        >
                            {registerForm.processing ? (
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
                        <button
                            type="button"
                            className="switch-action-btn"
                            onClick={() => setMode('login')}
                        >
                            Sign In to Account
                        </button>
                    </div>
                </div>
            )}

            {/* Subtle Security & Authenticity Footer */}
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
