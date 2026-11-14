import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { KeyIcon } from '@/Components/Icons';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Confirm Your Password"
            subtitle="Please confirm your password to access this protected area"
        >
            <Head title="Confirm Password - Dayal Sweets" />

            <form onSubmit={submit} className="space-y-4">
                <div className="dayal-input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <KeyIcon className="field-icon" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Enter password"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="dayal-submit-btn mt-2"
                >
                    {processing ? 'Confirming...' : 'Confirm Password'}
                </button>
            </form>
        </GuestLayout>
    );
}
