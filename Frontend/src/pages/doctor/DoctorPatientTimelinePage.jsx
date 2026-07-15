import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DoctorPageHeader } from '../../features/doctor/components/DoctorPageHeader';
import { PatientContextBanner } from '../../features/doctor/components/PatientContextBanner';
import { PatientTimelineExperience } from '../../features/timeline/components/PatientTimelineExperience';

import { patientApi } from '../../api/patient.api';
import { TimelineSearchProvider } from '../../context/TimelineSearchContext';

export function DoctorPatientTimelinePage() {
  const { patientId } = useParams();
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    if (!patientId) return;

    let mounted = true;

    (async () => {
      try {
        const data = await patientApi.getProfile(patientId);

        if (!mounted) return;

        const name =
          data.fullName ||
          `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
          '';

        setPatientName(name);
      } catch (err) {
        // intentionally silent fallback
        console.error('Failed to load patient profile:', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const displayName = patientName || patientId || 'Patient';

  return (
    <TimelineSearchProvider>
      <div className="space-y-6">
        <DoctorPageHeader
          title="Patient Timeline"
          subtitle={
            patientName
              ? `Viewing a read-only clinical history for ${patientName} before consultation.`
              : 'Viewing a read-only clinical history before consultation.'
          }
          patientName={patientName || null}
          breadcrumbs={[
            { label: 'Patients', to: '/doctor/patients' },
            {
              label: displayName,
              to: patientId ? `/doctor/patients/${patientId}` : undefined,
            },
            { label: 'Timeline' },
          ]}
        />

        <PatientContextBanner patientId={patientId} />

        <PatientTimelineExperience view="doctor" patientId={patientId} />
      </div>
    </TimelineSearchProvider>
  );
}