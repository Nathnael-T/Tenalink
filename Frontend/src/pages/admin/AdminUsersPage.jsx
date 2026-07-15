import { useEffect, useMemo, useState } from 'react';
import { getUsers } from '../../api/users.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonTable } from '../../components/shared/SkeletonCard';
import { Users } from 'lucide-react';

const ROLE_LABELS = {
  ROLE_PATIENT: 'Patient',
  ROLE_PROVIDER: 'Doctor',
  ROLE_ADMIN: 'Hospital Admin',
  ROLE_SUPER_ADMIN: 'Platform Admin',
};

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getUsers();
        if (mounted) setUsers(Array.isArray(data?.content) ? data.content : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load users.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (roleFilter !== 'ALL') {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.fullName || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term) ||
          (u.faydaId || '').toLowerCase().includes(term)
      );
    }

    return result;
  }, [users, roleFilter, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="mt-2 text-slate-600">Loading users...</p>
        </div>
        <SkeletonTable rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="mt-2 text-slate-600">
          View and manage all platform users across roles.
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by name, email, or Fayda ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          <option value="ALL">All Roles</option>
          <option value="ROLE_PATIENT">Patients</option>
          <option value="ROLE_PROVIDER">Doctors</option>
          <option value="ROLE_ADMIN">Hospital Admins</option>
          <option value="ROLE_SUPER_ADMIN">Platform Admins</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {/* User table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Email</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Fayda ID</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.fullName}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">{user.faydaId || '—'}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <EmptyState
            title="No users found"
            description="Try adjusting your search or filter criteria."
            icon={Users}
          />
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
