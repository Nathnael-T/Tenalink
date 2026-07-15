import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';

import ErrorAlert from '../../../components/shared/ErrorAlert';
import { MedicalEventDetailDrawer } from './MedicalEventDetailDrawer';
import { TimelineEventCard } from './TimelineEventCard';
import { getTimelineEvents } from '../../../api/timeline.api';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';

function matchesSearch(event, search) {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return [
    event.type,
    event.title,
    event.facility,
    event.clinician,
    event.summary,
    event.referenceId,
    ...(event.details || []),
    ...(event.tags || []),
  ]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

export function PatientTimelineExperience({ view, patientId }) {
  const { searchTerm, clearAllFilters, filters } = useTimelineSearch();
  const activeType = filters?.type || 'All';
  const search = searchTerm;

  const [selectedEvent, setSelectedEvent] = useState(null);
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
          setError('Unable to load timeline. Missing patient profile.');
          setTimelineEvents([]);
          return;
        }

        const events = await getTimelineEvents(patientId);

        if (mounted) {
          setTimelineEvents(Array.isArray(events) ? events : []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load timeline events.');
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

  const normalizedEvents = useMemo(() => {
    return timelineEvents;
  }, [timelineEvents]);

  const visibleEvents = useMemo(() => {
    return normalizedEvents.filter((event) => {
      const typeMatch = activeType === 'All' || event.type === activeType;
      const searchMatch = matchesSearch(event, search);
      return typeMatch && searchMatch;
    });
  }, [normalizedEvents, activeType, search]);

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && <ErrorAlert message={error} />}
       <h2 className="text-2xl font-bold text-black">Timeline</h2>
      {visibleEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-white py-16 text-center">
          <CalendarDays size={36} className="mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold">No Timeline Events Found</h2>
          <p className="mt-3 text-slate-600">
            {search || activeType !== 'All'
              ? 'Try adjusting your filters or search terms.'
              : 'No medical events have been recorded yet.'}
          </p>
          {(search || activeType !== 'All') && (
            <button
              onClick={() => {
                clearAllFilters();
              }}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="relative space-y-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200 sm:before:left-6">
          {visibleEvents.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              view={view}
              onOpen={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <MedicalEventDetailDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
