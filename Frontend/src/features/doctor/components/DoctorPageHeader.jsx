import { Link } from 'react-router-dom';
export function DoctorPageHeader({
  title,
  subtitle,
  patientName,
  breadcrumbs
}) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Doctor Workflow</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>{patientName ? <p className="mt-1 text-sm text-slate-500">Patient: {patientName}</p> : null}{subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}</div>{breadcrumbs && breadcrumbs.length > 0 ? <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><ol className="flex flex-wrap items-center gap-1.5">{breadcrumbs.map((item, index) => <li className="flex items-center gap-1.5" key={`${item.label}-${index}`}>{item.to ? <Link to={item.to} className="text-blue-700 hover:text-blue-800 hover:underline">{item.label}</Link> : <span className="text-slate-700">{item.label}</span>}{index < breadcrumbs.length - 1 ? <span>/</span> : null}</li>)}</ol></nav> : null}</div></section>;
}
