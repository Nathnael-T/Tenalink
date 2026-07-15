import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

import { useAuth } from '../../app/providers/AuthContext';
import { AppointmentCard } from '../../features/patient/components/AppointmentCard';
import { getAppointments } from '../../api/appointments.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonStatCard } from '../../components/shared/SkeletonCard';

const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected'
};

const FILTERS = [
  { id: 'All', label: 'All' },
  { id: APPOINTMENT_STATUS.PENDING, label: 'Pending' },
  { id: APPOINTMENT_STATUS.CONFIRMED, label: 'Confirmed' },
  { id: APPOINTMENT_STATUS.REJECTED, label: 'Rejected' }
];

export function AppointmentsPage() {
  const { patientId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadAppointments() {
      try {
        setLoading(true);
        setError('');

        if (!patientId) {
          setError('Unable to load appointments. Missing patient profile.');
          setAppointments([]);
          return;
        }

        const data = await getAppointments(patientId);

        if (mounted) {
          const sortedData = (Array.isArray(data) ? data : []).sort(
            (a, b) => new Date(b.scheduledAt || b.createdAt || 0) - new Date(a.scheduledAt || a.createdAt || 0)
          );
          setAppointments(sortedData);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load appointments.');
          setAppointments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      confirmed: appointments.filter(
        (a) =>
          a.status ===
          APPOINTMENT_STATUS.CONFIRMED
      ).length,
      pending: appointments.filter(
        (a) =>
          a.status ===
          APPOINTMENT_STATUS.PENDING
      ).length,
      rejected: appointments.filter(
        (a) =>
          a.status ===
          APPOINTMENT_STATUS.REJECTED
      ).length
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'All') {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === activeFilter
    );
  }, [appointments, activeFilter]);

  if (loading) {
      return (
        <div className="space-y-8">
          <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg">
            <div className="h-8 w-48 animate-pulse rounded bg-white/30" />
            <div className="mt-4 h-4 w-96 animate-pulse rounded bg-white/20" />
          </section>
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        </div>
      );
    }
  
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            
            <h1 className="mt-2 text-3xl font-bold">
              Manage Your Care Journey
            </h1>

            <p className="mt-3 max-w-2xl text-blue-50">
              Track appointment requests,
              confirmations, schedules, and
              upcoming consultations in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/patient/hospitals"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      

      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const count =
            filter.id === 'All'
              ? stats.total
              : appointments.filter(
                  (a) =>
                    a.status === filter.id
                ).length;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() =>
                setActiveFilter(filter.id)
              }
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center rounded-3xl border bg-white py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <CalendarDays
              size={36}
              className="text-blue-600"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Appointments Found
          </h2>

          <p className="mt-3 text-slate-600">
            Book your first appointment with
            a healthcare provider.
          </p>

          <Link
            to="/patient/hospitals"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredAppointments.map(
            (appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={
                  setSelectedAppointment
                }
              />
            )
          )}
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Appointment Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedAppointment(
                      null
                    )
                  }
                  className="text-slate-500 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Doctor
                  </p>

                  <p className="font-semibold">
                    {
                      selectedAppointment.doctorName
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Hospital
                  </p>

                  <p>
                    {selectedAppointment
                      .hospitalName ||
                      selectedAppointment.hospital}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Date & Time
                  </p>

                  <p>{selectedAppointment.date}</p>
                  <p>{selectedAppointment.time}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Reason
                  </p>

                  <p>{selectedAppointment.reason}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="font-semibold">
                    {selectedAppointment.status}
                  </p>
                </div>

                {selectedAppointment.createdAt && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Requested
                    </p>

                    <p>
                      {new Date(
                        selectedAppointment.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
