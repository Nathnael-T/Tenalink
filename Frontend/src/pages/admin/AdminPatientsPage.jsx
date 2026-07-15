import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getUsersByRole } from '../../api/users.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';

export function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getUsersByRole('PATIENT');
        if (mounted) setPatients(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load patients.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Patients</h1>
        <p className="text-neutral-600">Manage patient accounts and information</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Patient accounts will appear here as they register."
          icon={Users}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fayda ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{patient.fullName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{patient.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{patient.faydaId || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '—'}
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

export default AdminPatientsPage;
