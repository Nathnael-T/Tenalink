import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { getUsersByRole } from '../../api/users.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { PageHeader } from '../../components/shared/PageHeader';

const ROLE_LABELS = {
  ROLE_ADMIN: 'Hospital Admin',
  ROLE_SUPER_ADMIN: 'Platform Admin',
  ROLE_PROVIDER: 'Doctor',
  ROLE_PATIENT: 'Patient',
};

export function SuperAdminHospitalAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getUsersByRole('ADMIN');
        if (mounted) setAdmins(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load hospital admins.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hospital Admins"
        subtitle="Manage hospital administrator accounts across the platform."
      />

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : admins.length === 0 ? (
        <EmptyState
          title="No hospital admins found"
          description="Hospital admin accounts will appear here as they are created."
          icon={ShieldCheck}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{admin.fullName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {ROLE_LABELS[admin.role] || admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SuperAdminHospitalAdminsPage;
