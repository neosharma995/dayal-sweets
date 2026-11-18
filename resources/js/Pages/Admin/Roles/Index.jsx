import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RolesIndex({ roles, groupedPermissions, allPermissions }) {
    const { flash } = usePage().props || {};

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        permissions: [],
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Open Create Modal
    const handleOpenCreate = () => {
        setEditingRole(null);
        setFormData({
            name: '',
            permissions: [],
        });
        setFormErrors({});
        setShowCreateModal(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            permissions: [...role.permissions],
        });
        setFormErrors({});
    };

    // Toggle single permission checkbox
    const handleTogglePermission = (permName) => {
        setFormData((prev) => {
            const has = prev.permissions.includes(permName);
            return {
                ...prev,
                permissions: has
                    ? prev.permissions.filter((p) => p !== permName)
                    : [...prev.permissions, permName],
            };
        });
    };

    // Toggle entire group
    const handleToggleGroup = (groupPerms) => {
        const groupNames = groupPerms.map((p) => p.name);
        const allSelected = groupNames.every((name) => formData.permissions.includes(name));

        setFormData((prev) => {
            if (allSelected) {
                return {
                    ...prev,
                    permissions: prev.permissions.filter((p) => !groupNames.includes(p)),
                };
            }
            const union = Array.from(new Set([...prev.permissions, ...groupNames]));
            return {
                ...prev,
                permissions: union,
            };
        });
    };

    // Submit Create or Edit
    const handleSubmitRole = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        if (editingRole) {
            router.put(route('admin.roles.update', editingRole.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingRole(null);
                },
                onError: (errors) => setFormErrors(errors),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('admin.roles.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                },
                onError: (errors) => setFormErrors(errors),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    // Delete custom role
    const handleDeleteRole = (role) => {
        if (confirm(`Are you sure you want to permanently delete custom role '${role.name}'?`)) {
            router.delete(route('admin.roles.destroy', role.id), { preserveScroll: true });
        }
    };

    const getRoleColor = (roleName) => {
        if (roleName === 'admin') return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Administrator' };
        if (roleName === 'editor') return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Content Editor' };
        if (roleName === 'customer') return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', label: 'Customer' };
        return { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', label: roleName.toUpperCase() };
    };

    return (
        <AdminLayout>
            <Head title="Roles & Permissions Management - Dayal Sweets Admin" />

            <div className="dayal-admin-content-container" style={{ padding: '1.5rem 2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Roles &amp; Permissions
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Configure system roles, create custom staff roles, and assign granular permissions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        style={{
                            background: '#B88E4B',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 4px rgba(184, 142, 75, 0.25)',
                        }}
                    >
                        <span>+ Create Custom Role</span>
                    </button>
                </div>

                {/* Roles Cards Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.25rem',
                        marginBottom: '2rem',
                    }}
                >
                    {roles.map((role) => {
                        const style = getRoleColor(role.name);

                        return (
                            <div
                                key={role.id}
                                style={{
                                    background: '#FFFFFF',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                }}
                            >
                                <div>
                                    {/* Role Header */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    background: style.bg,
                                                    color: style.text,
                                                    border: `1px solid ${style.border}`,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em',
                                                }}
                                            >
                                                {role.name}
                                            </span>
                                            {role.is_system && (
                                                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                                                    [System Role]
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                            {role.users_count} {role.users_count === 1 ? 'User' : 'Users'}
                                        </div>
                                    </div>

                                    {/* Permissions Count */}
                                    <div style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
                                        Assigned Permissions ({role.permissions.length}):
                                    </div>

                                    {/* Permissions Badges */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '160px', overflowY: 'auto', padding: '0.25rem 0' }}>
                                        {role.permissions.length === 0 ? (
                                            <span style={{ fontSize: '0.785rem', color: '#94A3B8', fontStyle: 'italic' }}>No permissions assigned</span>
                                        ) : (
                                            role.permissions.map((p) => (
                                                <span
                                                    key={p}
                                                    style={{
                                                        background: '#F1F5F9',
                                                        color: '#475569',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 500,
                                                        padding: '0.2rem 0.45rem',
                                                        borderRadius: '0.25rem',
                                                        border: '1px solid #E2E8F0',
                                                    }}
                                                >
                                                    {p}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(role)}
                                        style={{
                                            background: '#F8FAFC',
                                            color: '#0F172A',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '0.375rem',
                                            padding: '0.45rem 0.85rem',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Configure Permissions
                                    </button>

                                    {!role.is_system && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRole(role)}
                                            style={{
                                                background: '#FEF2F2',
                                                color: '#DC2626',
                                                border: '1px solid #FECACA',
                                                borderRadius: '0.375rem',
                                                padding: '0.45rem 0.75rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Delete Role
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal: Create or Edit Role */}
                {(showCreateModal || editingRole) && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem',
                        }}
                    >
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '0.75rem',
                                maxWidth: '640px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                padding: '1.75rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    {editingRole ? `Configure Role: ${editingRole.name.toUpperCase()}` : 'Create New Role'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingRole(null);
                                    }}
                                    style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmitRole}>
                                {/* Role Name */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={editingRole?.is_system}
                                        placeholder="e.g. store-manager, inventory-auditor"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem',
                                            borderRadius: '0.375rem',
                                            border: formErrors.name ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                            fontSize: '0.9rem',
                                            background: editingRole?.is_system ? '#F1F5F9' : '#FFFFFF',
                                        }}
                                    />
                                    {formErrors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                                    {editingRole?.is_system && (
                                        <span style={{ color: '#64748B', fontSize: '0.72rem' }}>
                                            System role names cannot be renamed.
                                        </span>
                                    )}
                                </div>

                                {/* Permissions Checkboxes Grouped */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                            Select Permissions ({formData.permissions.length} selected):
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {Object.entries(groupedPermissions).map(([category, perms]) => {
                                            const allGroupSelected = perms.every((p) => formData.permissions.includes(p.name));

                                            return (
                                                <div
                                                    key={category}
                                                    style={{
                                                        border: '1px solid #E2E8F0',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.85rem',
                                                        background: '#F8FAFC',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.35rem' }}>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>
                                                            {category}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleGroup(perms)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                color: '#2563EB',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {allGroupSelected ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
                                                        {perms.map((p) => {
                                                            const isChecked = formData.permissions.includes(p.name);
                                                            return (
                                                                <label
                                                                    key={p.name}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'flex-start',
                                                                        gap: '0.6rem',
                                                                        padding: '0.55rem 0.65rem',
                                                                        borderRadius: '0.375rem',
                                                                        background: isChecked ? '#EFF6FF' : '#FFFFFF',
                                                                        border: isChecked ? '1px solid #93C5FD' : '1px solid #E2E8F0',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.15s ease',
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleTogglePermission(p.name)}
                                                                        style={{ marginTop: '0.2rem' }}
                                                                    />
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span style={{ fontSize: '0.8125rem', color: '#1E293B', fontWeight: isChecked ? 700 : 600 }}>
                                                                            {p.label}
                                                                        </span>
                                                                        {p.description && (
                                                                            <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem', lineHeight: 1.35 }}>
                                                                                {p.description}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setEditingRole(null);
                                        }}
                                        style={{ padding: '0.55rem 1.25rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            padding: '0.55rem 1.5rem',
                                            background: '#B88E4B',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            fontWeight: 700,
                                            cursor: submitting ? 'wait' : 'pointer',
                                        }}
                                    >
                                        {submitting ? 'Saving...' : editingRole ? 'Update Role Permissions' : 'Create Role'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
