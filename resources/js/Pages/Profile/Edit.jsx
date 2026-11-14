import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <span className="dayal-badge dayal-badge--gold">Account Management</span>
                    <h1 className="dayal-font-serif">User Profile & Security Settings</h1>
                </div>
            }
        >
            <Head title="Profile - Dayal Sweets" />

            <div className="dayal-card dayal-mb-6">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
            </div>

            <div className="dayal-card dayal-mb-6">
                <UpdatePasswordForm />
            </div>

            <div className="dayal-card">
                <DeleteUserForm />
            </div>
        </AuthenticatedLayout>
    );
}
