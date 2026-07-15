export function PagePlaceholder({
  title,
  section
}) {
  return <section className="app-card-section"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{section}</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">Route placeholder only. Page content, forms, dashboards, API calls, and business logic are intentionally not implemented.</p></div></section>;
}
