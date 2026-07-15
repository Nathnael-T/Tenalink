import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDoctors } from '../../api/doctors.api';
import { getHospitalById } from '../../api/hospitals.api';
import ErrorAlert from '../../components/shared/ErrorAlert';

export function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hospitalId = searchParams.get('hospital');

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      if (!hospitalId) {
        setHospital(null);
        setDoctors([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [hospitalData, doctorsData] = await Promise.all([
          getHospitalById(hospitalId),
          getDoctors(hospitalId)
        ]);

        if (mounted) {
          setHospital(hospitalData);
          const sortedDoctors = (Array.isArray(doctorsData) ? doctorsData : []).sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          setDoctors(sortedDoctors);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load doctors.');
          setHospital(null);
          setDoctors([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, [hospitalId]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/patient/hospitals"
          className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
        >
          Back to Hospitals
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Available Doctors
        </h1>

        <p className="mt-2 text-slate-600">
          {hospital
            ? `Doctors at ${hospital.name}`
            : 'Select a hospital to view available doctors.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-xl border bg-white py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <ErrorAlert message={error} />
      ) : !hospitalId ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No hospital selected
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a hospital before browsing doctors.
          </p>
          <Link
            to="/patient/hospitals"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 text-white transition hover:bg-teal-700"
          >
            Browse Hospitals
          </Link>
        </div>
      ) : !hospital ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Hospital not found
          </h2>
          <p className="mt-2 text-slate-600">
            The selected hospital could not be loaded.
          </p>
          <Link
            to="/patient/hospitals"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 text-white transition hover:bg-teal-700"
          >
            Browse Hospitals
          </Link>
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No doctors available
          </h2>
          <p className="mt-2 text-slate-600">
            This hospital does not have any doctors listed yet.
          </p>
          <Link
            to="/patient/hospitals"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 text-white transition hover:bg-teal-700"
          >
            Choose Another Hospital
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{doctor.fullName}</h2>

              <p className="mt-2 text-sm text-slate-600">{doctor.specialization}</p>

              <p className="mt-2 text-sm text-slate-600">
                Experience: {doctor.experience}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Availability: {doctor.availability}</p>

              <Link
                to={`/patient/book-appointment?doctor=${doctor.id}&hospital=${hospitalId}`}
                className="mt-4 inline-block w-full rounded-lg bg-teal-600 px-4 py-2 text-center text-white hover:bg-teal-700"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;
