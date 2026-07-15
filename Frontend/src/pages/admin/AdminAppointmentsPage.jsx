import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { getAdminAppointments } from '../../api/adminAppointments.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';

export function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminAppointments();
        if (mounted) setAppointments(Array.isArray(data?.content) ? data.content : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load appointments.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Appointments</h1>
        <p className="text-neutral-600">Overview of all appointments across the platform</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Appointments will appear here as they are scheduled."
          icon={Calendar}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Patient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Doctor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Hospital</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{appt.patientName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{appt.doctorName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{appt.hospitalName || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {appt.date || (appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleDateString() : '—')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      appt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      appt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {appt.status}
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

export default AdminAppointmentsPage;
