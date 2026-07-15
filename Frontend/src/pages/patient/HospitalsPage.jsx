import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from 'lucide-react';
import { getHospitals } from '../../api/hospitals.api';
import ErrorAlert from '../../components/shared/ErrorAlert';

export function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadHospitals() {
      try {
        setLoading(true);
        setError('');
        const data = await getHospitals();

        if (mounted) {
          const hospitalList = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
          setHospitals(hospitalList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
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
    }

    loadHospitals();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/patient/appointments"
          className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
        >
          Back to Appointments
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">Hospitals</h1>

        <p className="mt-2 text-slate-600">
          Select a hospital to view available doctors and book an appointment.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <div className="flex justify-center rounded-xl border bg-white py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 text-slate-900">
              <Hospital className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">{hospital.name}</h2>
            </div>

            <p className="mt-2 text-sm text-slate-600">{hospital.city}</p>

            <p className="mt-2 text-sm text-slate-600">{hospital.specialty}</p>

            <p className="mt-2 text-sm text-slate-500">
              {hospital.doctors || '—'} Doctors Available
            </p>

            <Link
              to={`/patient/doctors?hospital=${hospital.id}`}
              className="mt-4 inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-teal-700"
            >
              View Doctors
            </Link>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default HospitalsPage;
