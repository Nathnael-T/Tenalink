import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { Button } from '../../components/ui/Button';
import { DoctorPageHeader } from '../../features/doctor/components/DoctorPageHeader';
import { EventFormSection } from '../../features/doctor/components/EventFormSection';
import { EventPreviewCard } from '../../features/doctor/components/EventPreviewCard';
import { EventTypeSelector } from '../../features/doctor/components/EventTypeSelector';
import { PatientContextBanner } from '../../features/doctor/components/PatientContextBanner';
import { getMedicalEventTemplate } from '../../features/doctor/mockMedicalEventTemplates';
import { createMedicalEvent } from '../../api/timeline.api';
import { patientApi } from '../../api/patient.api';

export function AddMedicalEventPage() {
  const { patientId } = useParams();
  const { doctorId } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [selectedType, setSelectedType] = useState('VISIT_CREATED');
  const [formValues, setFormValues] = useState({
    title: '',
    facility: '',
    priority: '',
    primaryDiagnosis: '',
    notes: '',
    medication: '',
    instructions: '',
    lab: '',
    result: '',
    summary: '',
    followUp: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedTemplate = useMemo(() => getMedicalEventTemplate(selectedType), [selectedType]);

  useEffect(() => {
    if (!patientId) return;
    let mounted = true;

    (async () => {
      try {
        const data = await patientApi.getProfile(patientId);
        if (mounted) {
          const name = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || '';
          setPatientName(name);
        }
      } catch {
        // name stays empty
      }
    })();

    return () => { mounted = false; };
  }, [patientId]);

  const updateField = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!patientId) {
      setSubmitError('Missing patient ID.');
      return;
    }

    if (!doctorId) {
      setSubmitError('Missing doctor identity. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const eventData = JSON.stringify({
        template: selectedTemplate?.label || selectedType,
        ...formValues,
      });

      await createMedicalEvent({
        patientId,
        authorId: doctorId,
        // hospitalId omitted — nullable on backend
        timestamp: new Date().toISOString(),
        eventType: selectedType,
        eventData: eventData || '{}',
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save medical event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="Add Medical Event"
        subtitle={patientName
          ? `Create a new append-only timeline entry for ${patientName}.`
          : 'Create a new append-only timeline entry for this patient.'
        }
        patientName={patientName || null}
        breadcrumbs={[
          { label: 'Patients', to: '/doctor/patients' },
          { label: patientName || patientId || 'Patient', to: patientId ? `/doctor/patients/${patientId}` : undefined },
          { label: 'Add Medical Event' },
        ]}
      />
      <PatientContextBanner patientId={patientId} />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <EventTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
          <EventFormSection selectedType={selectedType} values={formValues} onChange={updateField} />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Submit Event
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                  Append event to timeline
                </h3>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Event'}
              </Button>
            </div>

            {submitError && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                {submitError}
              </p>
            )}

            {submitted ? (
              <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                Event appended successfully for {selectedTemplate.label}.
              </p>
            ) : null}
          </section>
        </div>

        <EventPreviewCard selectedType={selectedType} values={formValues} />
      </section>
    </div>
  );
}
