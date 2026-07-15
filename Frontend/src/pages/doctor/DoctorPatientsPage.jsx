import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import { getAppointmentsByDoctor } from '../../api/appointments.api';
import { patientApi } from '../../api/patient.api';
import { PatientResultCard } from '../../features/doctor/components/PatientResultCard';
import { PatientSearchFilters } from '../../features/doctor/components/PatientSearchFilters';

const HOSPITAL_LABELS = {
  'Black Lion Hospital': 'Black Lion Hospital',
  'St. Paul Millennium Medical College': 'St. Paul Millennium Medical College',
  'Yekatit 12 Hospital': 'Yekatit 12 Hospital',
};

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

function mapAppointmentToStatus(appointmentStatus) {
  switch (appointmentStatus) {
    case 'COMPLETED':
      return 'Stable';
    case 'SCHEDULED':
    case 'CONFIRMED':
      return 'Monitoring';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return appointmentStatus || 'Unknown';
  }
}

export function DoctorPatientsPage() {
  const { doctorId } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('All Hospitals');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!doctorId) {
        if (mounted) {
          setError('Unable to load patients. Missing doctor profile.');
          setPatients([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const appointments = await getAppointmentsByDoctor(doctorId);

        if (!Array.isArray(appointments) || appointments.length === 0) {
          if (mounted) setPatients([]);
          return;
        }

        const patientAppointmentMap = new Map();
        for (const appt of appointments) {
          const pid = appt.patientId;
          if (!pid) continue;
          const existing = patientAppointmentMap.get(pid);
          if (!existing || new Date(appt.scheduledAt) > new Date(existing.scheduledAt)) {
            patientAppointmentMap.set(pid, appt);
          }
        }

        const patientIds = [...patientAppointmentMap.keys()];
        const patientResults = await Promise.allSettled(
          patientIds.map((pid) => patientApi.getProfile(pid))
        );

        const mapped = patientResults
          .map((result, index) => {
            if (result.status !== 'fulfilled' || !result.value) return null;
            const patient = result.value;
            const latestAppt = patientAppointmentMap.get(patientIds[index]);
            const age = computeAge(patient.dateOfBirth);

            return {
              id: patient.id,
              name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient',
              age: age ?? 'N/A',
              gender: patient.gender || 'N/A',
              hospital: latestAppt?.hospitalId
                ? (HOSPITAL_LABELS[latestAppt.hospitalId] || latestAppt.hospitalId)
                : 'Unknown Hospital',
              status: mapAppointmentToStatus(latestAppt?.status),
              lastVisit: latestAppt?.scheduledAt
                ? new Date(latestAppt.scheduledAt).toLocaleDateString()
                : 'N/A',
              condition: latestAppt?.status === 'COMPLETED'
                ? 'Follow-up completed'
                : latestAppt?.status === 'SCHEDULED'
                  ? 'Scheduled visit'
                  : latestAppt?.status || 'No active condition',
            };
          })
          .filter(Boolean);

        if (mounted) {
          const sortedMapped = mapped.sort(
            (a, b) => new Date(b.lastVisit !== 'N/A' ? b.lastVisit : 0) - new Date(a.lastVisit !== 'N/A' ? a.lastVisit : 0)
          );
          setPatients(sortedMapped);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to load patient list.');
          setPatients([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [doctorId]);

  const hospitalOptions = useMemo(() => {
    const hospitals = [...new Set(patients.map((p) => p.hospital))];
    return ['All Hospitals', ...hospitals];
  }, [patients]);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(patients.map((p) => p.status))];
    return ['All Statuses', ...statuses];
  }, [patients]);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q);
      const matchesHospital =
        hospitalFilter === 'All Hospitals' || patient.hospital === hospitalFilter;
      const matchesStatus =
        statusFilter === 'All Statuses' || patient.status === statusFilter;
      return matchesSearch && matchesHospital && matchesStatus;
    });
  }, [patients, searchTerm, hospitalFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PatientSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hospitalFilter={hospitalFilter}
        onHospitalFilterChange={setHospitalFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        hospitals={hospitalOptions}
        statuses={statusOptions}
        resultsCount={filteredPatients.length}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {!loading && !error && filteredPatients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
                {patients.length === 0
                  ? 'No patients found. Patients will appear here once appointments are scheduled.'
                  : 'No patients match the current search. Try a different name, patient ID, hospital, or status.'}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <PatientResultCard patient={patient} key={patient.id} />
              ))
            )}
          </div>

        </section>
      )}
    </div>
  );
}
