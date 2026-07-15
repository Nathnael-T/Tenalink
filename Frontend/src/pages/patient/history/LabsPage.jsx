import { useEffect, useMemo, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';
import { getTimelineEvents } from '../../../api/timeline.api';
import EmptyState from '../../../components/shared/EmptyState';
import ErrorAlert from '../../../components/shared/ErrorAlert';

export default function LabsPage() {
  const { patientId } = useAuth();
  const { searchTerm, filters } = useTimelineSearch();
  const activeType = filters?.type || 'All';
  const search = searchTerm;
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTimeline() {
      try {
        setLoading(true);
        setError('');

        if (!patientId) {
          setError('Unable to load lab results. Missing patient profile.');
          setTimelineEvents([]);
          return;
        }

        const events = await getTimelineEvents(patientId);

        if (mounted) {
          setTimelineEvents(Array.isArray(events) ? events : []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load lab results.');
          setTimelineEvents([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTimeline();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const filtered = useMemo(() => {
    return timelineEvents.filter(event => {
      if (event.type !== 'Lab Result Uploaded') {
        return false;
      }

      const q = search.trim().toLowerCase();
      if (q && !(event.title?.toLowerCase().includes(q) || event.summary?.toLowerCase().includes(q))) {
        return false;
      }

      if (activeType !== 'All' && activeType !== 'Lab Result Uploaded') {
        return false;
      }
      return true;
    });
  }, [activeType, search, timelineEvents]);

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      <h2 className="text-2xl font-semibold text-slate-900">Lab Results</h2>
      <div className="grid gap-4">
        {filtered.map(lab => (
          <div key={lab.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900">{lab.title}</h3>
            <p className="text-sm text-slate-600">{lab.summary}</p>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(lab.occurredAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon={FlaskConical}
            title="No Lab Results Found"
            description="No lab results match your current search or filters."
          />
        )}
      </div>
    </div>
  );
}
