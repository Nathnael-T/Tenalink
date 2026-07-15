import { ArrowRight, ClipboardList, FilePlus2, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { Button } from '../../components/ui/Button';
import { DashboardWidget } from '../../features/doctor/components/DashboardWidget';
import { getAppointmentsByDoctor } from '../../api/appointments.api';
import { patientApi } from '../../api/patient.api';
import { getTimelineEvents } from '../../api/timeline.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';

function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function DoctorDashboardPage() {
  const { doctorId } = useAuth();

  const [recentPatients, setRecentPatients] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!doctorId) {
        if (mounted) {
          setError('Missing doctor identity.');
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        setError('');
        const appointments = await getAppointmentsByDoctor(doctorId);
        if (!Array.isArray(appointments) || appointments.length === 0) {
          if (mounted) {
            setRecentPatients([]);
            setRecentActivity([]);
          }
          return;
        }
        const sortedAppts = [...appointments].sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
        );
        const seenPatientIds = new Set();
        const uniquePatientIds = [];
        for (const appt of sortedAppts) {
          if (appt.patientId && !seenPatientIds.has(appt.patientId)) {
            seenPatientIds.add(appt.patientId);
            uniquePatientIds.push(appt.patientId);
          }
        }
        const topPatientIds = uniquePatientIds.slice(0, 3);
        const patientResults = await Promise.allSettled(
          topPatientIds.map((pid) => patientApi.getProfile(pid))
        );
        const patients = patientResults
          .filter((r) => r.status === 'fulfilled' && r.value)
          .map((r) => r.value);
        const mappedPatients = patients.map((p) => {
          const age = computeAge(p.dateOfBirth);
          const name = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unknown';
          return { id: p.id, name, age, gender: p.gender, summaryRoute: `/doctor/patients/${p.id}` };
        });
        if (mounted) setRecentPatients(mappedPatients);
        const timelineResults = await Promise.allSettled(
          topPatientIds.map((pid) => getTimelineEvents(pid))
        );
        const allEvents = [];
        timelineResults.forEach((result, idx) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            const patient = mappedPatients[idx];
            for (const evt of result.value) {
              allEvents.push({ ...evt, patientName: patient?.name || 'Unknown', patientId: topPatientIds[idx] });
            }
          }
        });
        allEvents.sort((a, b) => {
          const dateA = new Date(a.timestamp || a.occurredAt || 0);
          const dateB = new Date(b.timestamp || b.occurredAt || 0);
          return dateB - dateA;
        });
        if (mounted) setRecentActivity(allEvents.slice(0, 3));
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [doctorId]);

  const firstPatientRoute = recentPatients.length > 0
    ? recentPatients[0].summaryRoute
    : '/doctor/patients';

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Doctor Workspace
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Doctor dashboard</h1>
        <p className="text-slate-600">
          A quick summary of recent patients, clinical activity, and follow-up priorities.
        </p>
      </header>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <DashboardWidget title="Quick actions" description="Jump directly into the existing doctor workflow routes.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Browse patients', to: '/doctor/patients', icon: LayoutList },
            { label: 'Open summary', to: firstPatientRoute, icon: ClipboardList },
            { label: 'View timeline', to: `${firstPatientRoute}/timeline`, icon: ArrowRight },
            { label: 'Add medical event', to: `${firstPatientRoute}/add-event`, icon: FilePlus2 },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                to={action.to}
                className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-teal-50"
                key={action.label}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                    <p className="mt-1 text-xs text-slate-500">Existing doctor route</p>
                  </div>
                  <Icon className="h-5 w-5 text-teal-700" />
                </div>
              </Link>
            );
          })}
        </div>
      </DashboardWidget>

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <DashboardWidget
            title="Recent patients"
            description="Open a patient summary or timeline to continue care review."
          >
            <div className="space-y-4">
              {recentPatients.length === 0 ? (
                <EmptyState
                  title="No recent patients"
                  description="Patients will appear once appointments are scheduled."
                  icon={LayoutList}
                />
              ) : (
                recentPatients.map((patient) => (
                  <Link
                    to={patient.summaryRoute}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-white"
                    key={patient.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-teal-700">
                          {patient.id}
                        </p>
                        <h2 className="text-xl font-semibold text-slate-900">{patient.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {patient.age != null ? `${patient.age} yrs` : ''}
                          {patient.age != null && patient.gender ? ' · ' : ''}
                          {patient.gender || ''}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" type="button">
                        Review summary
                      </Button>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </DashboardWidget>

          <DashboardWidget
            title="Clinical activity"
            description="Most recent timeline events across your patients."
          >
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <EmptyState
                  title="No clinical activity"
                  description="Timeline events will appear here once recorded."
                  icon={ClipboardList}
                />
              ) : (
                recentActivity.map((item) => (
                  <Link
                    to={`/doctor/patients/${item.patientId}/timeline`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-white"
                    key={item.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {item.eventType || 'Event'}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">
                          {item.patientName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.eventData
                            ? (() => {
                                try {
                                  const data = JSON.parse(item.eventData);
                                  return data.title || data.summary || 'Timeline event';
                                } catch {
                                  return 'Timeline event';
                                }
                              })()
                            : 'Timeline event'}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </DashboardWidget>
        </section>
      )}
    </div>
  );
}
