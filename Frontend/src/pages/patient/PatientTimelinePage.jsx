import { TimelineSearchProvider } from '../../context/TimelineSearchContext';
import { PatientTimelineExperience } from '../../features/timeline/components/PatientTimelineExperience';
import { useAuth } from '../../app/providers/AuthContext';

export function PatientTimelinePage() {
  const { patientId } = useAuth();

  return (
    <TimelineSearchProvider>
      <PatientTimelineExperience view="patient" patientId={patientId} />
    </TimelineSearchProvider>
  );
}
