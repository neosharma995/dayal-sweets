import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function StaffUsersIndex({ users, roles, stats, currentAdminId, filters }) {
    const { flash, errors: pageErrors = {} } = usePage().props || {};

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [showCards, setShowCards] = useState(false);

    // Change Role Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [updatingRole, setUpdatingRole] = useState(false);

    // Create New Staff Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newStaffData, setNewStaffData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles.find((r) => r.value !== 'customer')?.value || 'editor',
    });
    const [formErrors, setFormErrors] = useState({});
    const [creatingStaff, setCreatingStaff] = useState(false);

    const handleApplyFilters = (newOverrides = {}) => {
        router.get(
            route('admin.users.index'),
            {
                search,
                role: roleFilter,
                ...newOverrides,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleApplyFilters({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('all');
        router.get(route('admin.users.index'), {}, { preserveState: true });
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
    };

    const handleSaveRole = (e) => {
        e.preventDefault();
        if (!selectedUser || !newRole) return;

        setUpdatingRole(true);
        router.put(
            route('admin.users.update-role', selectedUser.id),
            { role: newRole },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedUser(null);
                },
                onFinish: () => setUpdatingRole(false),
            }
        );
    };

    const handleOpenCreateModal = () => {
        setNewStaffData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: roles.find((r) => r.value !== 'customer')?.value || 'editor',
        });
        setFormErrors({});
        setShowCreateModal(true);
    };

    const handleCreateStaffSubmit = (e) => {
        e.preventDefault();
        setFormErrors({});
        setCreatingStaff(true);

        router.post(
            route('admin.users.store'),
            newStaffData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    setNewStaffData({
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                        role: 'editor',
                    });
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
                onFinish: () => setCreatingStaff(false),
            }
        );
    };

    const handleDeleteStaff = (user) => {
        if (!window.confirm(`Are you sure you want to remove staff member '${user.name}'?`)) {
            return;
        }

        router.delete(route('admin.users.destroy', user.id), {
            preserveScroll: true,
        });
    };

    const getRoleBadgeStyle = (roleName) => {
        if (roleName === 'admin') {
            return { background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', label: 'Administrator' };
        }
        if (roleName === 'editor') {
            return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', label: 'Content Editor' };
        }
        return { background: '#F1F5F9', color: '#334155', border: '1px solid #E2E8F0', label: roleName.toUpperCase() };
    };

    // Staff roles eligible for creation (excludes customer)
    const creatableRoles = roles.filter((r) => r.value !== 'customer');

    return (
        <AdminLayout>
            <Head title="Staff Management - Dayal Sweets Admin" />

            <div className="dayal-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header Row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Link href={route('admin.dashboard')} style={{ color: '#64748B', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                Admin
                            </Link>
                            <span style={{ color: '#CBD5E1', fontSize: '0.75rem' }}>/</span>
                            <span style={{ color: '#0F172A', fontSize: '0.8125rem', fontWeight: 600 }}>Staff Management</span>
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            Staff Management
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                            Create and manage staff accounts, assign specific roles, and control access permissions.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => setShowCards(!showCards)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.85rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: showCards ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                            <span>{showCards ? 'Hide Summary Cards ▲' : 'Expand Summary Cards ▼'}</span>
                        </button>

                        <Link
                            href={route('admin.customers.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 0.9rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>Customers</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                height: '38px',
                                padding: '0 1rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <span>+ Add New Staff</span>
                        </button>
                    </div>
                </div>

                {/* Top Metric Cards - Collapsed by default, counts only, NO clicks */}
                {showCards && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* 1. Total Staff */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Staff Members
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                                {stats.total_staff}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Authorized staff accounts
                            </div>
                        </div>

                        {/* 2. Administrators */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A1C1C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Administrators
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7A1C1C', marginTop: '0.35rem' }}>
                                {stats.admins}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Full store control
                            </div>
                        </div>

                        {/* 3. Content Editors */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Content Editors
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563EB', marginTop: '0.35rem' }}>
                                {stats.editors}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Page &amp; branding editors
                            </div>
                        </div>

                        {/* 4. Registered Customers */}
                        <div
                            style={{
                                background: '#FFFFFF',
                                padding: '1.25rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Registered Customers
                            </div>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
                                {stats.total_customers}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                                <Link href={route('admin.customers.index')} style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
                                    View in Customers →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Buttons without count - Clicks happen here */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                        { key: 'all', label: 'All Staff' },
                        { key: 'admin', label: 'Administrators' },
                        { key: 'editor', label: 'Content Editors' },
                    ].map((tab) => {
                        const isActive = roleFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setRoleFilter(tab.key);
                                    handleApplyFilters({ role: tab.key });
                                }}
                                style={{
                                    padding: '0.45rem 0.9rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: isActive ? 700 : 500,
                                    border: isActive ? '1px solid #7A1C1C' : '1px solid #CBD5E1',
                                    background: isActive ? '#7A1C1C' : '#FFFFFF',
                                    color: isActive ? '#FFFFFF' : '#475569',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease',
                                    boxShadow: isActive ? '0 1px 2px rgba(122, 28, 28, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Filter Toolbar */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.5rem',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 340px', maxWidth: '480px' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search staff by name or email..."
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.8125rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '0.375rem',
                                background: '#7A1C1C',
                                color: '#FFFFFF',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    handleApplyFilters({ search: '' });
                                }}
                                style={{
                                    padding: '0.5rem 0.65rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    fontSize: '0.8125rem',
                                    border: '1px solid #CBD5E1',
                                    cursor: 'pointer',
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                            <span>Role:</span>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    handleApplyFilters({ role: e.target.value });
                                }}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    background: '#FFFFFF',
                                }}
                            >
                                <option value="all">All Staff Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="editor">Content Editors</option>
                            </select>
                        </div>

                        {(search || roleFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                </div>

                {/* Staff Table */}
                <div style={{ background: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Staff Member</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Email &amp; Login</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Assigned Role</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Added On</th>
                                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                                            <div style={{ fontWeight: 600, color: '#475569' }}>No staff members found matching criteria.</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "+ Add New Staff" to create a new team member account.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((u) => {
                                        const badge = getRoleBadgeStyle(u.role);
                                        const isCurrentUser = currentAdminId === u.id;

                                        return (
                                            <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                                                {/* Staff Member Info */}
                                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '999px',
                                                                background: '#F1F5F9',
                                                                color: '#475569',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 700,
                                                                fontSize: '0.875rem',
                                                                border: '1px solid #E2E8F0',
                                                            }}
                                                        >
                                                            {u.name ? u.name.charAt(0).toUpperCase() : 'S'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <span>{u.name}</span>
                                                                {isCurrentUser && (
                                                                    <span style={{ fontSize: '0.68rem', color: '#B45309', background: '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                                                                ID #{u.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email & Login */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <div style={{ color: '#334155', fontWeight: 500 }}>
                                                        {u.email}
                                                    </div>
                                                </td>

                                                {/* Assigned Role */}
                                                <td style={{ padding: '0.85rem 1rem' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            padding: '0.2rem 0.55rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            background: badge.background,
                                                            color: badge.color,
                                                            border: badge.border,
                                                        }}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                {/* Added On */}
                                                <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.8125rem' }}>
                                                    {u.created_at}
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenRoleModal(u)}
                                                            disabled={isCurrentUser}
                                                            title={isCurrentUser ? 'You cannot alter your own admin permissions' : 'Change staff role'}
                                                            style={{
                                                                padding: '0.4rem 0.75rem',
                                                                borderRadius: '0.375rem',
                                                                border: '1px solid #CBD5E1',
                                                                background: isCurrentUser ? '#F8FAFC' : '#FFFFFF',
                                                                color: isCurrentUser ? '#94A3B8' : '#1E293B',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 600,
                                                                cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                                                            }}
                                                        >
                                                            Change Role
                                                        </button>

                                                        {!isCurrentUser && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteStaff(u)}
                                                                style={{
                                                                    padding: '0.4rem 0.65rem',
                                                                    borderRadius: '0.375rem',
                                                                    border: '1px solid #FECACA',
                                                                    background: '#FEF2F2',
                                                                    color: '#DC2626',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                Showing {users.from || 0} to {users.to || 0} of {users.total} staff members
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {users.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid',
                                            borderColor: link.active ? '#B88E4B' : '#E2E8F0',
                                            background: link.active ? '#B88E4B' : '#FFFFFF',
                                            color: link.active ? '#FFFFFF' : link.url ? '#334155' : '#CBD5E1',
                                            fontSize: '0.8rem',
                                            cursor: link.url ? 'pointer' : 'default',
                                            fontWeight: link.active ? 700 : 500,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create New Staff Member Modal */}
            {showCreateModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '1rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                                Create New Staff Account
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateStaffSubmit}>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Full Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ramesh Verma"
                                        value={newStaffData.name}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '0.375rem',
                                            border: formErrors.name ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                    {formErrors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Staff Email Address (Login ID) *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. ramesh@dayalsweets.com"
                                        value={newStaffData.email}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '0.375rem',
                                            border: formErrors.email ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                    {formErrors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.email}</span>}
                                </div>

                                {/* Password */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Min 8 characters"
                                            value={newStaffData.password}
                                            onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 0.85rem',
                                                borderRadius: '0.375rem',
                                                border: formErrors.password ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                                fontSize: '0.875rem',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Repeat password"
                                            value={newStaffData.password_confirmation}
                                            onChange={(e) => setNewStaffData({ ...newStaffData, password_confirmation: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem 0.85rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #CBD5E1',
                                                fontSize: '0.875rem',
                                            }}
                                        />
                                    </div>
                                </div>
                                {formErrors.password && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.password}</span>}

                                {/* Role Selection */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Assign Staff Role *
                                    </label>
                                    <select
                                        value={newStaffData.role}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '0.375rem',
                                            border: formErrors.role ? '1px solid #DC2626' : '1px solid #CBD5E1',
                                            fontSize: '0.875rem',
                                            background: '#FFFFFF',
                                        }}
                                    >
                                        {creatableRoles.map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.role && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.role}</span>}
                                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.35rem' }}>
                                        This staff member will log in using these credentials and see dashboard features matching their role permissions.
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ padding: '0.55rem 1rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingStaff}
                                    style={{
                                        padding: '0.55rem 1.25rem',
                                        background: '#B88E4B',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {creatingStaff ? 'Creating Account...' : 'Create Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Staff Role Modal */}
            {selectedUser && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '1rem',
                    }}
                >
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                                Update Staff Role
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveRole}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                                        {selectedUser.name}
                                    </div>
                                    <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                                        {selectedUser.email}
                                    </div>
                                </div>

                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                    Select Role:
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.85rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.875rem',
                                        background: '#FFFFFF',
                                    }}
                                >
                                    {roles.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>

                                {newRole === 'customer' && (
                                    <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.785rem', marginTop: '1rem', border: '1px solid #FECACA' }}>
                                        ⚠️ <strong>Warning:</strong> Demoting this staff member to Customer will revoke all administrative access. They will be removed from this staff list and moved to the Customers list.
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    style={{ padding: '0.55rem 1rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingRole}
                                    style={{ padding: '0.55rem 1.25rem', background: '#B88E4B', border: 'none', borderRadius: '0.375rem', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}
                                >
                                    {updatingRole ? 'Updating...' : 'Save Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
