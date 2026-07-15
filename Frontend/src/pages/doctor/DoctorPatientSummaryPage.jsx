import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ClinicalSummaryPanel } from '../../features/doctor/components/ClinicalSummaryPanel';
import { DoctorPageHeader } from '../../features/doctor/components/DoctorPageHeader';
import { PatientContextBanner } from '../../features/doctor/components/PatientContextBanner';
import { patientApi } from '../../api/patient.api';
import { getPrescriptions } from '../../api/prescriptions.api';

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

export function DoctorPatientSummaryPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!patientId) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [profileData, prescriptionData] = await Promise.allSettled([
          patientApi.getProfile(patientId),
          getPrescriptions(patientId),
        ]);

        if (!mounted) return;

        if (profileData.status === 'fulfilled' && profileData.value) {
          setPatient(profileData.value);
        } else {
          setError('Failed to load patient profile.');
        }

        if (prescriptionData.status === 'fulfilled' && Array.isArray(prescriptionData.value)) {
          setPrescriptions(prescriptionData.value);
        }
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load patient summary.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [patientId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <DoctorPageHeader
          title="Patient Summary"
          subtitle="Loading patient data..."
          breadcrumbs={[
            { label: 'Patients', to: '/doctor/patients' },
            { label: 'Summary' },
          ]}
        />
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6">
        <DoctorPageHeader
          title="Patient Summary"
          subtitle="Quick clinical summary for the current consultation."
          breadcrumbs={[
            { label: 'Patients', to: '/doctor/patients' },
            { label: 'Summary' },
          ]}
        />
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
          No patient summary is available for this record.
        </section>
      </div>
    );
  }

  const patientName = patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient';
  const age = computeAge(patient.dateOfBirth);
  const activePrescriptions = prescriptions.filter((rx) => rx.status === 'ACTIVE');
  const medicationNames = activePrescriptions.map((rx) => rx.medication).filter(Boolean);
  const latestPrescription = prescriptions.length > 0
    ? prescriptions[prescriptions.length - 1]?.medication || 'Not recorded'
    : 'Not recorded';

  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="Patient Summary"
        subtitle="Quick clinical summary for the current consultation."
        patientName={patientName}
        breadcrumbs={[
          { label: 'Patients', to: '/doctor/patients' },
          { label: patientName, to: `/doctor/patients/${patientId}` },
          { label: 'Summary' },
        ]}
      />

      <PatientContextBanner patientId={patientId} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* IMPORTANT ACTIONS FIRST */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Patient Actions
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/doctor/patients')}>
            Back to Patients
          </Button>

          <Button variant="outline" onClick={() => navigate(`/doctor/patients/${patientId}/timeline`)}>
            View Timeline
          </Button>

          <Button variant="outline" onClick={() => navigate(`/doctor/patients/${patientId}/add-event`)}>
            Add Medical Event
          </Button>

          <Button variant="outline" onClick={() => navigate(`/doctor/patients/${patientId}/prescribe`)}>
            Create Prescription
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          These are the most common actions performed during a patient review.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ClinicalSummaryPanel
          title="Clinical Snapshot"
          description="High-priority facts for the current consultation."
          emphasis="default"
          items={[
            { label: 'Active Problem', value: 'Not recorded' },
            { label: 'Reason For Visit', value: 'Not recorded' },
            { label: 'Risk Level', value: 'Not recorded' },
            { label: 'Primary Doctor', value: 'Not recorded' },
            {
              label: 'Last Encounter',
              value: patient.dateOfBirth
                ? `DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`
                : 'Not recorded',
            },
          ]}
        />

        <ClinicalSummaryPanel
          title="Patient Demographics"
          description="Basic patient information from the registered profile."
          emphasis="success"
          items={[
            { label: 'Full Name', value: patientName },
            { label: 'Age', value: age != null ? `${age} yrs` : 'Not recorded' },
            { label: 'Gender', value: patient.gender || 'Not recorded' },
            { label: 'Fayda ID', value: patient.faydaId || 'Not recorded' },
            { label: 'Contact Phone', value: patient.contactPhone || 'Not recorded' },
          ]}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ClinicalSummaryPanel
          title="Current Medications"
          description="Active prescriptions from the pharmacy service."
          items={
            medicationNames.length > 0
              ? medicationNames.map((name) => ({ label: 'Medication', value: name }))
              : [{ label: 'Medications', value: 'No active prescriptions recorded' }]
          }
        />

        <ClinicalSummaryPanel
          title="Prominent Allergies"
          description="Important allergies to confirm before further actions."
          emphasis="alert"
          items={[
            { label: 'Allergies', value: 'Not recorded in system' },
          ]}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <ClinicalSummaryPanel
          title="Recent Activity"
          description="The latest care updates available for this patient."
          items={[
            { label: 'Latest Diagnosis', value: 'Not recorded' },
            { label: 'Latest Prescription', value: latestPrescription },
            { label: 'Total Prescriptions', value: String(prescriptions.length) },
          ]}
        />

        <ClinicalSummaryPanel
          title="Recommended Next Action"
          description="A concise next step for the current consultation."
          emphasis="success"
          items={[
            { label: 'Action', value: 'Review patient timeline and add clinical notes.' },
          ]}
        />
      </section>
    </div>
  );
}

export default DoctorPatientSummaryPage;