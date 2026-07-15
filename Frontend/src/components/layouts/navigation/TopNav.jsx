import { Bell, Menu, Search, ShieldCheck } from 'lucide-react';
import { ROLES } from '../../../constants/roles';
const roleNames = {
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.PATIENT]: 'Patient',
  [ROLES.HOSPITAL_ADMIN]: 'Hospital Admin',
  [ROLES.SUPER_ADMIN]: 'Platform Management'
};
export function TopNav({
  role,
  onMenuClick
}) {
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl"><div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8"><button type="button" onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{roleNames[role]} View</p><h1 className="truncate text-lg font-bold text-slate-950">TenaLink Healthcare Platform</h1></div><div className="hidden min-w-72 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex"><Search size={16} /><span>Search shell placeholder</span></div><button type="button" className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-950 sm:inline-flex" aria-label="Notifications"><Bell size={18} /></button><div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"><ShieldCheck size={16} /><span className="hidden sm:inline">{roleNames[role]}</span></div></div></header>;
}
