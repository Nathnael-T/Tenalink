import { CalendarDays, HelpCircle } from 'lucide-react';
import { timelineTypeMeta } from './timelineTypeMeta';

function formatDate(value) {
  if (!value) return 'Unknown date';

  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function formatTime(value) {
  if (!value) return '';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

export function TimelineEventCard({ event, view, onOpen }) {
  // 🚨 HARD GUARD: event missing
  if (!event) {
    return null; // or a fallback UI if you prefer
  }

  const meta = timelineTypeMeta?.[event.type] ?? {
    icon: HelpCircle,
    color: 'gray',
    tone: 'ring-slate-300',
    label: 'Unknown'
  };

  const Icon = meta.icon;

  const details = Array.isArray(event.details) ? event.details : [];
  const tags = Array.isArray(event.tags) ? event.tags : [];

  return (
    <article
      className="relative pl-12 sm:pl-14"
      onClick={() => onOpen?.(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          onOpen?.(event);
        }
      }}
    >
      <div
        className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${meta.tone}`}
      >
        <Icon size={19} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${meta.tone}`}>
                {event.type ?? 'unknown'}
              </span>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <CalendarDays size={14} />
                {formatDate(event.occurredAt)} {formatTime(event.occurredAt) && `at ${formatTime(event.occurredAt)}`}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-950">
              {event.title ?? 'Untitled event'}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {event.summary ?? 'No description available'}
            </p>

          </div>

          <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left lg:w-52">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reference
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {event.referenceId ?? 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Facility
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {event.facility ?? 'Unknown'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {view === 'doctor' ? 'Recorded By' : 'Clinician'}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {event.clinician ?? 'Unknown'}
            </p>
          </div>
        </div>

        {details.length > 0 && (
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            {details.map((detail, idx) => (
              <li className="rounded-lg bg-slate-50 px-3 py-2" key={idx}>
                {detail}
              </li>
            ))}
          </ul>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                key={idx}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}