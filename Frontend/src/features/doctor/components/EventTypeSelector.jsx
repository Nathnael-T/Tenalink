import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { medicalEventTemplates } from '../mockMedicalEventTemplates';
export function EventTypeSelector({
  selectedType,
  onSelect
}) {
  return <Card><CardHeader><CardTitle>Event Type</CardTitle><p className="text-sm text-slate-500">Choose the medical record entry you want to append to the timeline.</p></CardHeader><CardContent className="grid gap-3">{medicalEventTemplates.map(template => {
        const active = template.type === selectedType;
        return <button type="button" onClick={() => onSelect(template.type)} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-100 hover:bg-slate-50'}`} key={template.type}><p className="text-sm font-semibold text-slate-900">{template.label}</p><p className="mt-1 text-sm text-slate-600">{template.description}</p></button>;
      })}</CardContent></Card>;
}
