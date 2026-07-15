import {
  Activity,
  Building2,
  CalendarDays,
  FileText,
  Pill,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { PatientDashboardWidget } from '../../features/patient/components/PatientDashboardWidget';
import { useAuth } from '../../app/providers/AuthContext';
import { patientApi } from '../../api/patient.api';
import { getAppointments } from '../../api/appointments.api';
import { getTimelineEvents } from '../../api/timeline.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonStatCard } from '../../components/shared/SkeletonCard';

export function PatientDashboardPage() {
  const { patientId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!patientId) {
        if (mounted) {
          setError('Missing patient identity.');
          setLoading(false);
        }
        return;
      }
      try {
        setError('');
        setLoading(true);
        const [profileData, appointmentsData, timelineData] = await Promise.all([
          patientApi.getProfile(patientId),
          getAppointments(patientId),
          getTimelineEvents(patientId)
        ]);
        if (mounted) {
          setProfile(profileData);
          setAppointments(
            (Array.isArray(appointmentsData) ? appointmentsData : []).sort(
              (a, b) => new Date(b.scheduledAt || b.createdAt || 0) - new Date(a.scheduledAt || a.createdAt || 0)
            )
          );
          setTimelineEvents(
            (Array.isArray(timelineData) ? timelineData : []).sort(
              (a, b) => new Date(b.occurredAt || b.timestamp || 0) - new Date(a.occurredAt || a.timestamp || 0)
            )
          );
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load dashboard.');
          setProfile(null);
          setAppointments([]);
          setTimelineEvents([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [patientId]);

// normalizing arryas
const normalizeList = (value) => {
  if (!value) return null;

  // If backend sends JSON string like '["Penicillin"]'
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }

  return Array.isArray(value) ? value : [value];
};

const allergies = useMemo(() => {
  if (!profile) return null;
  return normalizeList(profile.allergies);
}, [profile]);

const conditions = useMemo(() => {
  if (!profile) return null;
  return normalizeList(profile.conditions || profile.chronic_conditions);
}, [profile]);



  const nextAppointment = useMemo(() => {
    if (!appointments.length) {
      return null;
    }

    const upcoming = appointments
      .map((appointment) => ({
        ...appointment,
        dateTime: new Date(
          `${appointment.date || ''}T${appointment.time || '00:00'}`
        )
      }))
      .filter((appointment) => appointment.dateTime >= new Date())
      .sort((a, b) => a.dateTime - b.dateTime);

    return upcoming[0] || null;
  }, [appointments]);

  const recentActivity = useMemo(() => {
    if (!timelineEvents.length) {
      return [];
    }

    return [...timelineEvents]
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime()
      )
      .slice(0, 3);
  }, [timelineEvents]);

  const quickActions = [
    {
      label: 'Medical Records',
      to: '/patient/history/timeline',
      icon: FileText
    },
    {
      label: 'Appointments',
      to: '/patient/appointments',
      icon: CalendarDays
    },
    {
      label: 'Medications',
      to: '/patient/history/prescriptions',
      icon: Pill
    },
    {
      label: 'Hospitals',
      to: '/patient/hospitals',
      icon: Building2
    }
  ];

  

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
      {/* HERO */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-bold">
              Good Morning
            </h1>
            <p className="mt-3 max-w-2xl text-teal-50">
              Here's your healthcare summary for today.
              Stay on top of appointments, records,
              medications and your overall wellness.
            </p>
          </div>
          <Link
            to="/patient/hospitals"
            className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-teal-700 transition hover:bg-slate-100"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            setError('');
            setLoading(true);
            // Trigger re-fetch via patientId change not possible, so reload inline
            (async () => {
              try {
                const [profileData, appointmentsData, timelineData] = await Promise.all([
                  patientApi.getProfile(patientId),
                  getAppointments(patientId),
                  getTimelineEvents(patientId)
                ]);
                setProfile(profileData);
                setAppointments(
                  (Array.isArray(appointmentsData) ? appointmentsData : []).sort(
                    (a, b) => new Date(b.scheduledAt || b.createdAt || 0) - new Date(a.scheduledAt || a.createdAt || 0)
                  )
                );
                setTimelineEvents(
                  (Array.isArray(timelineData) ? timelineData : []).sort(
                    (a, b) => new Date(b.occurredAt || b.timestamp || 0) - new Date(a.occurredAt || a.timestamp || 0)
                  )
                );
              } catch (e) {
                setError(e?.message || 'Unable to load dashboard.');
              } finally {
                setLoading(false);
              }
            })();
          }}
        />
      )}

      {/* UPCOMING APPOINTMENT */}
      {nextAppointment && (
        <PatientDashboardWidget
          title="Upcoming Appointment"
          description="Your next scheduled healthcare visit."
        >
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {nextAppointment.title}
                </h3>
                <p className="mt-2 text-slate-600">
                  {nextAppointment.when}
                </p>
                <p className="text-slate-600">
                  {nextAppointment.location}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-blue-700 shadow">
                  {nextAppointment.status}
                </span>
                <Link
                  to="/patient/appointments"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </PatientDashboardWidget>
      )}

      {/* HEALTH SNAPSHOT */}
      <PatientDashboardWidget
        title="Health Snapshot"
        description="Key health indicators at a glance."
      >
      <div className="grid gap-4 md:grid-cols-3">
  {profile ? (
    [
      {
        label: 'Blood Type',
        value: profile.blood_type || profile.bloodType || 'N/A',
        status: 'Recorded'
      },
      {
        label: 'Allergies',
        value: allergies?.length
          ? allergies.join(', ')
          : 'No known allergies',
        status: 'Review'
      },
      {
        label: 'Conditions',
        value: conditions?.length
          ? conditions.join(', ')
          : 'None recorded',
        status: 'Current'
      }
    ].map((vital) => (
      <div
        key={vital.label}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <p className="text-sm font-medium text-slate-500">
          {vital.label}
        </p>

        <p className="mt-3 text-2xl font-bold text-slate-900">
          {vital.value}
        </p>

        <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {vital.status}
        </span>
      </div>
    ))
  ) : (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
      No health summary available.
    </div>
  )}
</div>
      </PatientDashboardWidget>

      {/* QUICK ACTIONS */}
      <PatientDashboardWidget
        title="Quick Actions"
        description="Access your most-used healthcare tools."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-teal-200 hover:bg-white"
            >
              <Icon className="h-8 w-8 text-teal-700" />
              <span className="text-center text-sm font-semibold text-slate-900">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </PatientDashboardWidget>

      {/* RECENT ACTIVITY */}
      <PatientDashboardWidget
        title="Recent Activity"
        description="Your latest healthcare updates."
      >
        <div className="space-y-3">
          {recentActivity.length ? (
            recentActivity.map((event) => (
              <article
                key={event.id || event.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {event.type || 'Update'}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {event.title}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
                    {new Date(event.occurredAt || event.date || new Date()).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {event.summary || event.notes || 'No additional details available.'}
                </p>
              </article>
            ))
          ) : (
            <EmptyState
              title="No recent activity"
              description="Your latest healthcare updates will appear here."
              icon={Activity}
            />
          )}
        </div>
      </PatientDashboardWidget>

      {/* ACTIVE CONDITIONS */}
      {profile && (Array.isArray(profile.conditions) ? profile.conditions : profile.chronic_conditions || []).length > 0 && (
        <PatientDashboardWidget
          title="Active Conditions"
          description="Conditions we're monitoring."
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ul className="space-y-2 text-sm text-slate-600">
              {(Array.isArray(profile.conditions)
                ? profile.conditions
                : profile.chronic_conditions || [])
                .map((condition) => (
                  <li key={condition} className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-700" />
                    {condition}
                  </li>
                ))}
            </ul>
          </div>
        </PatientDashboardWidget>
      )}
    </div>
  );
}

export default PatientDashboardPage;
