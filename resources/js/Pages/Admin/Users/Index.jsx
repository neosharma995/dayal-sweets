import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminDataTable, {
    adminPrimaryBtnStyle,
    adminSecondaryBtnStyle,
    adminTableActionStyles,
} from '@/Components/Admin/AdminDataTable';

export default function StaffUsersIndex({ users, roles = [], stats = {}, currentAdminId, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 15);

    // Only non-admin, non-customer staff roles
    const staffRoles = useMemo(
        () => roles.filter((r) => r.value !== 'admin' && r.value !== 'customer'),
        [roles]
    );

    const defaultRole = staffRoles[0]?.value || 'editor';

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
        role: defaultRole,
    });
    const [formErrors, setFormErrors] = useState({});
    const [creatingStaff, setCreatingStaff] = useState(false);

    const handleApplyFilters = (overrides = {}) => {
        const nextSearch = overrides.search !== undefined ? overrides.search : search;
        const nextRole = overrides.role !== undefined ? overrides.role : roleFilter;
        const nextPerPage = overrides.per_page !== undefined ? overrides.per_page : perPage;

        const params = {};
        if (nextSearch && nextSearch.trim()) params.search = nextSearch.trim();
        if (nextRole && nextRole !== 'all') params.role = nextRole;
        if (nextPerPage && Number(nextPerPage) !== 15) params.per_page = Number(nextPerPage);

        router.get(route('admin.users.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('all');
        setPerPage(15);
        router.get(route('admin.users.index'), {}, { preserveState: true, replace: true });
    };

    const isLockedAdminUser = (user) => Boolean(user?.is_locked || user?.role === 'admin');

    const handleOpenRoleModal = (user) => {
        if (isLockedAdminUser(user) || currentAdminId === user.id) return;
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
                onSuccess: () => setSelectedUser(null),
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
            role: defaultRole,
        });
        setFormErrors({});
        setShowCreateModal(true);
    };

    const handleCreateStaffSubmit = (e) => {
        e.preventDefault();
        setFormErrors({});
        setCreatingStaff(true);

        router.post(route('admin.users.store'), newStaffData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setNewStaffData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: defaultRole,
                });
            },
            onError: (errors) => setFormErrors(errors),
            onFinish: () => setCreatingStaff(false),
        });
    };

    const handleDeleteStaff = (user) => {
        if (isLockedAdminUser(user) || currentAdminId === user.id) return;
        if (!window.confirm(`Are you sure you want to remove staff member '${user.name}'?`)) return;

        router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
    };

    const getRoleBadgeStyle = (roleName) => {
        if (roleName === 'editor') {
            return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', label: 'Content Editor' };
        }
        const matched = staffRoles.find((r) => r.value === roleName);
        return {
            background: '#F1F5F9',
            color: '#334155',
            border: '1px solid #E2E8F0',
            label: matched?.label || roleName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        };
    };

    const summaryCards = [
        {
            label: 'Total Staff Members',
            value: stats.total_staff ?? 0,
            subtext: 'Non-admin authorized staff',
        },
        {
            label: 'Content Editors',
            value: stats.editors ?? 0,
            valueColor: '#2563EB',
            labelColor: '#2563EB',
            subtext: 'Page & branding editors',
        },
        {
            label: 'Custom Role Staff',
            value: stats.other_staff ?? 0,
            valueColor: '#7A1C1C',
            labelColor: '#7A1C1C',
            subtext: 'Assigned to custom roles',
        },
        {
            label: 'Registered Customers',
            value: stats.total_customers ?? 0,
            valueColor: '#059669',
            labelColor: '#059669',
            link: { href: route('admin.customers.index'), label: 'View in Customers →' },
        },
    ];

    const columns = [
        {
            key: 'member',
            label: 'Staff Member',
            render: (u) => {
                const isCurrentUser = currentAdminId === u.id;
                return (
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
                            <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>ID #{u.id}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'email',
            label: 'Email & Login',
            render: (u) => <span style={{ color: '#334155', fontWeight: 500 }}>{u.email}</span>,
        },
        {
            key: 'role',
            label: 'Assigned Role',
            render: (u) => {
                const badge = getRoleBadgeStyle(u.role);
                return (
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
                );
            },
        },
        {
            key: 'created_at',
            label: 'Added On',
            render: (u) => <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>{u.created_at}</span>,
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (u) => {
                const isCurrentUser = currentAdminId === u.id;
                const isLockedAdmin = isLockedAdminUser(u);
                const isActionDisabled = isLockedAdmin || isCurrentUser;

                if (isLockedAdmin) {
                    return (
                        <button
                            type="button"
                            disabled
                            title="Administrator accounts are permanently locked."
                            style={{
                                ...adminTableActionStyles.secondary,
                                background: '#F8FAFC',
                                color: '#94A3B8',
                                borderColor: '#E2E8F0',
                                cursor: 'not-allowed',
                            }}
                        >
                            🔒 Locked Admin
                        </button>
                    );
                }

                return (
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                            type="button"
                            onClick={() => handleOpenRoleModal(u)}
                            disabled={isActionDisabled}
                            title={isCurrentUser ? 'You cannot alter your own role' : 'Change staff role'}
                            style={{
                                ...adminTableActionStyles.secondary,
                                background: isActionDisabled ? '#F8FAFC' : '#FFFFFF',
                                color: isActionDisabled ? '#94A3B8' : '#1E293B',
                                cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Change Role
                        </button>

                        {!isActionDisabled && (
                            <button
                                type="button"
                                onClick={() => handleDeleteStaff(u)}
                                style={adminTableActionStyles.danger}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <Head title="Staff Management - Dayal Sweets Admin" />

            <AdminDataTable
                breadcrumb="Staff Management"
                title="Staff Management"
                subtitle="Create and manage staff accounts, assign specific roles, and control access permissions."
                headerActions={
                    <>
                        <Link href={route('admin.customers.index')} style={adminSecondaryBtnStyle}>
                            <span>Customers</span>
                        </Link>
                        <button type="button" onClick={handleOpenCreateModal} style={adminPrimaryBtnStyle}>
                            <span>+ Add New Staff</span>
                        </button>
                    </>
                }
                summaryCards={summaryCards}
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={(val) => handleApplyFilters({ search: val })}
                searchPlaceholder="Search staff by name or email..."
                toolbarRight={
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
                                color: '#0F172A',
                            }}
                        >
                            <option value="all">All Staff Roles</option>
                            {staffRoles.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                }
                hasActiveFilters={Boolean(search.trim() || roleFilter !== 'all')}
                onResetFilters={handleClearFilters}
                columns={columns}
                rows={users?.data || []}
                paginator={users}
                perPage={perPage}
                onPerPageChange={(n) => {
                    setPerPage(n);
                    handleApplyFilters({ per_page: n });
                }}
                itemLabel="staff members"
                emptyTitle="No staff members found matching criteria."
                emptySubtitle='Click "+ Add New Staff" to create a new team member account.'
            />

            {/* Create New Staff Member Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Create New Staff Account</h3>
                            <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateStaffSubmit}>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                        style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: formErrors.name ? '1px solid #DC2626' : '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                    {formErrors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                                </div>

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
                                        style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: formErrors.email ? '1px solid #DC2626' : '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                    />
                                    {formErrors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.email}</span>}
                                </div>

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
                                            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: formErrors.password ? '1px solid #DC2626' : '1px solid #CBD5E1', fontSize: '0.875rem' }}
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
                                            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                </div>
                                {formErrors.password && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.password}</span>}

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Assign Staff Role *
                                    </label>
                                    <select
                                        value={newStaffData.role}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: formErrors.role ? '1px solid #DC2626' : '1px solid #CBD5E1', fontSize: '0.875rem', background: '#FFFFFF' }}
                                    >
                                        {staffRoles.map((r) => (
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
                                <button type="button" onClick={() => setShowCreateModal(false)} style={adminTableActionStyles.secondary}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={creatingStaff} style={adminTableActionStyles.primary}>
                                    {creatingStaff ? 'Creating Account...' : 'Create Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Staff Role Modal */}
            {selectedUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                    <div style={{ background: '#FFFFFF', borderRadius: '0.75rem', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Update Staff Role</h3>
                            <button type="button" onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94A3B8' }}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveRole}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{selectedUser.name}</div>
                                    <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.15rem' }}>{selectedUser.email}</div>
                                </div>

                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                    Select Staff Role:
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '0.875rem', background: '#FFFFFF' }}
                                >
                                    {staffRoles.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setSelectedUser(null)} style={adminTableActionStyles.secondary}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={updatingRole} style={adminTableActionStyles.primary}>
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
