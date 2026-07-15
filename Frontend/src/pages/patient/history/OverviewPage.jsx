// src/pages/patient/history/OverviewPage.jsx
import { useMemo } from 'react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';

export default function OverviewPage() {
  const { searchTerm, filters } = useTimelineSearch();
  const activeType = filters?.type || 'All';

  const { user } = useAuth();

  const storedUser = useMemo(() => user || {}, [user]);

  const profile = {
    full_name: storedUser?.full_name || storedUser?.name || storedUser?.email || 'Patient',
    fayda_id:
      storedUser?.fayda_id ||
      storedUser?.email?.split('@')[0] ||
      'unknown',
    blood_type: storedUser?.blood_type || 'N/A',
    allergies: Array.isArray(storedUser?.allergies)
      ? storedUser.allergies.join(', ')
      : storedUser?.allergies || 'Not Provided',
    chronic_conditions: Array.isArray(storedUser?.conditions)
      ? storedUser.conditions.join(', ')
      : storedUser?.conditions || 'Not Provided',
    emergency_contact_name: storedUser?.emergency_contact_name || 'Not Provided',
    emergency_contact_phone: storedUser?.emergency_contact_phone || 'Not Provided'
  };

  // Determine if any patient field matches the search term (case‑insensitive)
  const matchesSearch = searchTerm
    ? Object.values(profile).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : true;

  // Simple type filter – treat "All" as no filter for Overview
  const matchesType = activeType === 'All' || activeType === 'Overview';

  const shouldShow = matchesSearch && matchesType;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="text-sm mb-2">Search: {searchTerm || '(none)'}</div>
      <div className="text-sm mb-2">Filter: {activeType}</div>

      {shouldShow ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800 border-b pb-2">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Full Name</p>
                <p className="text-sm font-medium text-slate-900">{profile.full_name || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Fayda ID</p>
                <p className="text-sm font-medium text-slate-900">{profile.fayda_id || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Blood Type</p>
                <p className="text-sm font-medium text-slate-900">{profile.blood_type || 'Not Provided'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800 border-b pb-2">Medical Alerts</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Allergies</p>
                <p className="text-sm font-medium text-slate-900">{profile.allergies || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Chronic Conditions</p>
                <p className="text-sm font-medium text-slate-900">{profile.chronic_conditions || 'Not Provided'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800 border-b pb-2">Emergency Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Emergency Contact Name</p>
                <p className="text-sm font-medium text-slate-900">{profile.emergency_contact_name || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Emergency Contact Phone</p>
                <p className="text-sm font-medium text-slate-900">{profile.emergency_contact_phone || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No matching patient information found.</p>
      )}
    </div>
  );
}
