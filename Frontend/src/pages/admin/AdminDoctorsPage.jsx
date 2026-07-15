import { useEffect, useState } from 'react';
import { Stethoscope, Mail, Phone } from 'lucide-react';
import { getUsersByRole } from '../../api/users.api';

export function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getUsersByRole('PROVIDER');
        if (mounted) setDoctors(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load doctors.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const filtered = doctors.filter((d) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      (d.fullName || '').toLowerCase().includes(term) ||
      (d.email || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Management</h1>
          <p className="mt-2 text-slate-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Doctor Management</h1>
        <p className="mt-2 text-slate-600">
          View all registered doctors on the platform.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm"
        />
      </div>

      <p className="text-sm text-slate-500">
        Showing {filtered.length} of {doctors.length} doctors
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doctor) => (
          <div
            key={doctor.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Stethoscope size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{doctor.fullName}</h3>
                <span className="text-xs font-medium text-blue-600">Provider</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {doctor.email}
              </div>
              {doctor.faydaId && (
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  Fayda: {doctor.faydaId}
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Registered: {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No doctors found.
        </div>
      )}
    </div>
  );
}

export default AdminDoctorsPage;
