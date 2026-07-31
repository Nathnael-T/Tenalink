import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
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

function mapPatientStatus(patientStatus) {
  switch (patientStatus) {
    case 'COMPLETED':
      return 'Stable';
    case 'SCHEDULED':
    case 'CONFIRMED':
      return 'Monitoring';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return patientStatus || 'Unknown';
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

        if (mounted) {
          setPatients([]);
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
                  ? 'No patients found. Patients will appear here as they are added to your care list.'
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
