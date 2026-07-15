import { Input } from '../../../components/ui/Input';
import { getMedicalEventTemplate } from '../mockMedicalEventTemplates';
export function EventFormSection({
  selectedType,
  values,
  onChange
}) {
  const template = getMedicalEventTemplate(selectedType);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Dynamic Form</p><h3 className="mt-1 text-xl font-semibold text-slate-950">{template.label}</h3><p className="mt-1 text-sm text-slate-500">{template.description}</p></div><div className="grid gap-4 md:grid-cols-2">{template.fields.map(field => <label className="space-y-2 text-sm text-slate-700" key={field.name}><span>{field.label}</span><Input type={field.type ?? 'text'} value={values[field.name] ?? ''} placeholder={field.placeholder} onChange={event => onChange(field.name, event.target.value)} /></label>)}</div></section>;
}
