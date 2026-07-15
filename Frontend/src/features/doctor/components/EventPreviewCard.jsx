import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { getMedicalEventTemplate } from '../mockMedicalEventTemplates';
export function EventPreviewCard({
  selectedType,
  values
}) {
  const template = getMedicalEventTemplate(selectedType);
  const summary = template.fields.map(field => `${field.label}: ${values[field.name] || '—'}`).join(' • ');
  return <Card className="sticky top-6"><CardHeader><CardTitle>Append-Only Preview</CardTitle><p className="text-sm text-slate-500">This preview mirrors how medical timelines are appended: immutable, time-ordered, and reviewable.</p></CardHeader><CardContent className="space-y-4 text-sm text-slate-700"><div className="rounded-xl bg-blue-50 p-4 text-slate-900"><p className="text-xs uppercase tracking-[0.18em] text-blue-700">Event Type</p><p className="mt-1 font-semibold">{template.label}</p><p className="mt-1 text-sm text-slate-600">{template.description}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview Summary</p><p className="mt-2 text-slate-900">{summary}</p></div><div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900"><p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Mock Submit</p><p className="mt-1">This action simulates appending a record to the timeline without saving anything to the server.</p></div></CardContent></Card>;
}
