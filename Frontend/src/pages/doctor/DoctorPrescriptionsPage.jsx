import { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import { Pill } from 'lucide-react';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import apiClient from '../../api/apiClient';

export function DoctorPrescriptionsPage() {
  const { doctorId } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!doctorId) {
        if (mounted) {
          setError('Missing doctor identity.');
          setPrescriptions([]);
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await apiClient.get(`/prescriptions/doctor/${encodeURIComponent(doctorId)}`);
        const sortedData = (Array.isArray(response.data) ? response.data : []).sort(
          (a, b) => new Date(b.prescribedAt || b.createdAt || 0) - new Date(a.prescribedAt || a.createdAt || 0)
        );
        if (mounted) setPrescriptions(sortedData);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load prescriptions.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [doctorId]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Doctor Workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Prescriptions</h1>
        <p className="mt-2 text-slate-600">
          View prescriptions you have issued to patients.
        </p>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description="Prescriptions you issue will appear here."
          icon={Pill}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Medication</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Dosage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Prescribed Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{rx.medication}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{rx.dosage}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {rx.prescribedAt ? new Date(rx.prescribedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      rx.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                      rx.status === 'FULFILLED' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {rx.status}
                    </span>
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

export default DoctorPrescriptionsPage;
