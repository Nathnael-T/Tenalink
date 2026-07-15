import { X, CalendarDays, Building2, Stethoscope, ClipboardList, Pill, FlaskConical, FileText, BadgeInfo } from 'lucide-react';
import { timelineTypeMeta } from './timelineTypeMeta';
function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}
function renderSections(event) {
  const base = [{
    title: 'Event Metadata',
    items: event.metadata?.length ? event.metadata.map(item => [item.label, item.value]) : [['Metadata', 'No additional metadata is available for this event.']]
  }, {
    title: 'Event Notes',
    items: event.notes?.length ? event.notes.map(note => ['Note', note]) : [['Notes', 'No note text is available for this event.']]
  }, {
    title: 'Event Details',
    items: event.details?.length ? event.details.map(detail => ['Clinical note', detail]) : [['Details', 'No additional details are available for this event.']]
  }];
  switch (event.type) {
    case 'Visit Created':
      return [{
        title: 'Visit Snapshot',
        items: [['Priority', 'Urgent intake and triage review'], ['Focus', 'Arrival and initial assessment'], ['Follow-up', 'Care plan to be reviewed at next visit']]
      }, ...base];
    case 'Diagnosis Added':
      return [{
        title: 'Diagnosis Context',
        items: [['Assessment', 'Clinical findings confirmed after review'], ['Status', 'Active diagnosis recorded in the chart'], ['Outcome', 'Monitoring recommended for recurrence risk']]
      }, ...base];
    case 'Prescription Issued':
      return [{
        title: 'Medication Plan',
        items: [['Medication', 'Prescription updated for ongoing care'], ['Adherence', 'Patient guidance included in record'], ['Monitoring', 'Check response at next follow-up']]
      }, ...base];
    case 'Lab Result Uploaded':
      return [{
        title: 'Lab Review',
        items: [['Sample', 'Laboratory result attached to record'], ['Interpretation', 'Readings reviewed for trend comparison'], ['Action', 'Clinical response documented for follow-up']]
      }, ...base];
    case 'Doctor Note Added':
      return [{
        title: 'Clinical Note',
        items: [['Note Type', 'Provider follow-up summary'], ['Patient Progress', 'Observed response and counseling notes'], ['Next Step', 'Continue routine monitoring']]
      }, ...base];
    default:
      return base;
  }
}
export function MedicalEventDetailDrawer({
  event,
  onClose
}) {
  const meta = event ? timelineTypeMeta[event.type] : null;
  const Icon = meta?.icon;
  return <div className="fixed inset-0 z-50 bg-slate-950/45 md:flex md:justify-end"><button type="button" aria-label="Close event details" className="absolute inset-0" onClick={onClose} /><aside className="relative flex h-full w-full max-w-full flex-col overflow-y-auto bg-white shadow-2xl md:ml-auto md:w-[420px] md:border md:border-slate-200 md:rounded-l-3xl lg:w-[440px]"><div className="border-b border-slate-200 px-5 py-5 sm:px-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Medical Event Detail</p><h3 className="mt-2 text-xl font-bold text-slate-950">{event?.title ?? 'Event details unavailable'}</h3><p className="mt-1 text-sm text-slate-600">{event?.summary ?? 'No medical event details are available for the current selection.'}</p></div><button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50" aria-label="Close drawer"><X size={18} /></button></div>{event ? <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1 ${meta.tone}`}><Icon size={14} />{event.type}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{event.referenceId}</span></div> : <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100"><BadgeInfo size={14} />Empty state</div>}</div><div className="flex-1 space-y-5 px-5 py-5 sm:px-6">{event ? <><section className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</p><dl className="mt-3 space-y-3 text-sm text-slate-700"><div><dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Event Type</dt><dd className="mt-1 text-base font-semibold text-slate-950">{event.type}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Timestamp</dt><dd className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-950"><CalendarDays size={16} className="text-blue-700" />{formatDate(event.occurredAt)}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Doctor</dt><dd className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-950"><Stethoscope size={16} className="text-emerald-700" />{event.clinician}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hospital</dt><dd className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-950"><Building2 size={16} className="text-violet-700" />{event.facility}</dd></div></dl></section>{renderSections(event).map(section => <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={section.title}><div className="flex items-center gap-2">{section.title === 'Visit Snapshot' && <ClipboardList size={16} className="text-blue-700" />}{section.title === 'Diagnosis Context' && <Stethoscope size={16} className="text-emerald-700" />}{section.title === 'Medication Plan' && <Pill size={16} className="text-violet-700" />}{section.title === 'Lab Review' && <FlaskConical size={16} className="text-amber-700" />}{section.title === 'Clinical Note' && <FileText size={16} className="text-slate-700" />}{section.title === 'Event Metadata' && <BadgeInfo size={16} className="text-blue-700" />}{section.title === 'Event Notes' && <FileText size={16} className="text-emerald-700" />}{section.title === 'Event Details' && <ClipboardList size={16} className="text-slate-700" />}<h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">{section.title}</h4></div><ul className="mt-3 space-y-3 text-sm text-slate-700">{section.items.map(([label, value], index) => <li className="rounded-xl bg-slate-50 px-3 py-3" key={`${section.title}-${label}-${index}`}><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-1 text-sm text-slate-900">{value}</p></li>)}</ul></section>)}<section className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">Tags</h4><div className="mt-3 flex flex-wrap gap-2">{event.tags.map(tag => <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200" key={tag}>{tag}</span>)}</div></section></> : <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center shadow-sm"><p className="text-sm font-semibold text-slate-900">No event details are available.</p><p className="mt-2 text-sm text-slate-600">Select a timeline event to open the reusable medical detail experience.</p></section>}</div></aside></div>;
}

