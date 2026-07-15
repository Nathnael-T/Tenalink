import { Input } from '../../../components/ui/Input';
export function PatientSearchFilters({
  searchTerm,
  onSearchChange,
  hospitalFilter,
  onHospitalFilterChange,
  statusFilter,
  onStatusFilterChange,
  hospitals,
  statuses,
  resultsCount
}) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Doctor Patients</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Search and review patient records</h2><p className="mt-2 text-sm text-slate-600">Use the filters below to find the right patient quickly.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{resultsCount} results</span></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><label className="space-y-2 text-sm text-slate-700"><span>Search by name or patient ID</span><Input value={searchTerm} onChange={event => onSearchChange(event.target.value)} placeholder="Search name or ID" /></label><label className="space-y-2 text-sm text-slate-700"><span>Hospital</span><select value={hospitalFilter} onChange={event => onHospitalFilterChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">{hospitals.map(hospital => <option value={hospital} key={hospital}>{hospital}</option>)}</select></label><label className="space-y-2 text-sm text-slate-700"><span>Status</span><select value={statusFilter} onChange={event => onStatusFilterChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">{statuses.map(status => <option value={status} key={status}>{status}</option>)}</select></label><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-semibold text-slate-900">Quick focus</p><p className="mt-1">Search by patient name, patient ID, hospital, or care status to prioritize consultations.</p></div></div></section>;
}
