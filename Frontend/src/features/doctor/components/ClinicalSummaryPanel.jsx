import { SummarySectionCard } from './SummarySectionCard';
export function ClinicalSummaryPanel({
  title,
  description,
  items,
  emphasis = 'default'
}) {
  const emphasisStyles = {
    default: 'bg-slate-50 border-slate-100',
    alert: 'bg-rose-50 border-rose-100',
    success: 'bg-emerald-50 border-emerald-100'
  };
  return <SummarySectionCard title={title} description={description}><div className={`grid gap-3 rounded-2xl border p-4 ${emphasisStyles[emphasis]}`}>{items.map((item, index) => <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100" key={`${item.label}-${index}`}><p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p></div>)}</div></SummarySectionCard>;
}
