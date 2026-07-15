// src/pages/patient/MedicalHistoryLayout.jsx

import { NavLink, Outlet } from 'react-router-dom';
import { Activity, FileText, FileStack, Pill } from 'lucide-react';
import TimelineSearchBar from '../../features/timeline/components/TimelineSearchBar';
import TimelineFilterBar from '../../features/timeline/components/TimelineFilterBar';
import { TimelineSearchProvider } from '../../context/TimelineSearchContext';

const tabs = [
  { to: '/patient/history/timeline', label: 'Timeline', icon: Activity },
  { to: '/patient/history/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/patient/history/labs', label: 'Lab Results', icon: FileText },
  { to: '/patient/history/documents', label: 'Documents', icon: FileStack },
];

export default function MedicalHistoryLayout() {
  return (
    <TimelineSearchProvider>
      <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Medical History</h1>
              <p className="text-sm text-white/80">Complete clinical record</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                    }`
                  }
                >
                  <tab.icon size={16} />
                  {tab.label}
                </NavLink>
              ))}
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <TimelineSearchBar className="w-full xl:w-96" placeholder="Search across medical history..." />
              <TimelineFilterBar />
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </TimelineSearchProvider>
  );
}

// Named export for compatibility with imports expecting a named export
export { MedicalHistoryLayout };
