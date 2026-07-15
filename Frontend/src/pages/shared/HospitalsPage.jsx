import { useEffect, useMemo, useState } from 'react';
import { Building2, MapPin, Phone, CalendarDays } from 'lucide-react';
import { getHospitals } from '../../api/hospitals.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';

export function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadHospitals = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getHospitals(0, 100);
        const hospitalList = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];

        if (mounted) {
          setHospitals(
            hospitalList.sort(
              (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
          );
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load hospitals.');
          setHospitals([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHospitals();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredHospitals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return hospitals;

    return hospitals.filter((hospital) => {
      return [hospital.name, hospital.city, hospital.specialty]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [hospitals, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hospital Network</h1>
        <p className="mt-2 text-slate-600">Review hospitals available across the platform.</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search hospitals, city, or specialty"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
        />
        <p className="text-sm text-slate-500">
          Showing {filteredHospitals.length} of {hospitals.length} hospitals
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : filteredHospitals.length === 0 ? (
        <EmptyState title="No hospitals found" description="Try a different search query or refresh the page." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900">
                <Building2 size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold">{hospital.name}</h2>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {hospital.city && (
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {hospital.city}
                  </p>
                )}
                {hospital.specialty && (
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    {hospital.specialty}
                  </p>
                )}
                {hospital.contact && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {hospital.contact}
                  </p>
                )}
              </div>

              <div className="mt-4 text-sm text-slate-500">
                Created: {hospital.createdAt ? new Date(hospital.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
