import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import {
  getAppointmentsByDoctor,
  updateAppointmentStatus,
} from '../../api/appointments.api';
import { sortByNewest } from '../../utils/sort';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { CalendarX } from 'lucide-react';

const STATUS = {
  SCHEDULED: 'SCHEDULED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  RESCHEDULE_REQUESTED: 'RESCHEDULE_REQUESTED',
};

function formatInstant(instant) {
  if (!instant) return '—';
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function statusLabel(status) {
  switch (status) {
    case STATUS.SCHEDULED:
      return 'Scheduled';
    case STATUS.ACCEPTED:
      return 'Accepted';
    case STATUS.REJECTED:
      return 'Rejected';
    case STATUS.RESCHEDULE_REQUESTED:
      return 'Reschedule requested';
    default:
      return status || '—';
  }
}

export function DoctorAppointmentsPage() {
  const { doctorId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadAppointments = useCallback(async () => {
    if (!doctorId) {
      setError('Missing doctor identity.');
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('doctorId:', doctorId);
      const data = await getAppointmentsByDoctor(doctorId);
      console.log('appointments:', data);

      if (!Array.isArray(data)) {
        throw new Error('Backend did not return an array');
      }

      const sorted = sortByNewest([...data], ['createdAt', 'scheduledAt']);
      setAppointments(sorted);
    } catch (err) {
      console.error('APPOINTMENTS LOAD ERROR:', err);
      setError(err?.message || 'Failed to load appointments.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAppointments();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAppointments]);

  const pendingAppointments = useMemo(
    () => appointments.filter((a) => a.status === STATUS.SCHEDULED),
    [appointments]
  );

  const otherAppointments = useMemo(
    () => appointments.filter((a) => a.status !== STATUS.SCHEDULED),
    [appointments]
  );

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      setError('');
      await updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (err) {
      console.error('STATUS UPDATE FAILED:', err);
      setError(err?.message || 'Failed to update appointment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Doctor Workspace
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Appointment Requests</h1>
        <p className="text-slate-600">
          Review scheduled requests and update their status.
        </p>
      </header>

      {error && (
        <ErrorAlert message={error} onRetry={loadAppointments} />
      )}

      {loading ? (
        <div className="flex justify-center rounded-xl border bg-white py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-teal-600" />
        </div>
      ) : pendingAppointments.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="New patient appointment requests appear here when status is SCHEDULED."
          icon={CalendarX}
        />
      ) : (
        <div className="space-y-4">
          {pendingAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {appointment.patientName || 'Unknown patient'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatInstant(appointment.scheduledAt)}
                  </p>
                  {appointment.createdAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Requested: {formatInstant(appointment.createdAt)}
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  {statusLabel(appointment.status)}
                </span>
              </div>

              {appointment.hospitalName && (
                <p className="mt-2 text-sm text-slate-600">
                  <strong>Hospital:</strong> {appointment.hospitalName}
                </p>
              )}

              <p className="mt-2 text-sm text-slate-700">
                <strong>Reason:</strong> {appointment.reason || '—'}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={updatingId === appointment.id}
                  onClick={() => handleStatusUpdate(appointment.id, STATUS.ACCEPTED)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={updatingId === appointment.id}
                  onClick={() => handleStatusUpdate(appointment.id, STATUS.REJECTED)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={updatingId === appointment.id}
                  onClick={() =>
                    handleStatusUpdate(appointment.id, STATUS.RESCHEDULE_REQUESTED)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Request Reschedule
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && otherAppointments.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent decisions</h2>
          {otherAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">
                    {appointment.patientName || 'Unknown patient'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {formatInstant(appointment.scheduledAt)}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {statusLabel(appointment.status)}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default DoctorAppointmentsPage;
