import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { createAppointment } from '../../api/appointments.api';
import { getDoctorById } from '../../api/doctors.api';
import { getHospitalById } from '../../api/hospitals.api';
import ErrorAlert from '../../components/shared/ErrorAlert';

export function BookAppointmentPage() {
  const navigate = useNavigate();
  const { user, patientId } = useAuth();
  const [searchParams] = useSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const doctorId = searchParams.get('doctor');
  const hospitalId = searchParams.get('hospital');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadBookingData() {
      try {
        setLoading(true);
        setError('');

        if (!doctorId) {
          setDoctor(null);
          setHospital(null);
          return;
        }

        const [doctorData, hospitalData] = await Promise.all([
          getDoctorById(doctorId).catch((err) => {
            throw new Error(err?.message || 'Unable to load selected doctor.');
          }),
          hospitalId
            ? getHospitalById(hospitalId).catch(() => null)
            : Promise.resolve(null)
        ]);

        if (mounted) {
          setDoctor(doctorData);
          setHospital(hospitalData || null);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load booking details.');
          setDoctor(null);
          setHospital(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBookingData();

    return () => {
      mounted = false;
    };
  }, [doctorId, hospitalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor) {
      setError('Please select a doctor before submitting your appointment request.');
      return;
    }

    if (!patientId) {
      setError('Unable to submit: patient profile not loaded. Try logging in again.');
      return;
    }

    const resolvedHospitalId = hospital?.id || doctor?.hospitalId;
    if (!resolvedHospitalId) {
      setError('Please select a hospital before booking an appointment.');
      return;
    }

    if (!date || !time) {
      setError('Date and time are required');
      return;
    }

    const newAppointment = {
      patientId,
      patientName: user?.name || doctor.patientName || 'Patient',
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      hospitalId: resolvedHospitalId,
      hospitalName: hospital?.name || doctor.hospitalName || '',
      date,
      time,
      reason: reason || 'General consultation',
    };

    try {
      setLoading(true);
      setError('');
      await createAppointment(newAppointment);
      navigate('/patient/appointments');
    } catch (submitError) {
      setError(submitError?.message || 'Unable to submit appointment request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <div className="flex justify-center rounded-xl border bg-white py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
          <p className="mt-2 text-slate-600">
            Select a doctor to request an appointment.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No doctor selected
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a hospital and doctor before requesting an appointment.
          </p>
          <Link
            to="/patient/hospitals"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 text-white transition hover:bg-teal-700"
          >
            Back to Hospitals
          </Link>
        </div>
      </div>
    );
  }

  const doctorsBackLink = hospital
    ? `/patient/doctors?hospital=${hospital.id}`
    : '/patient/hospitals';

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link
          to={doctorsBackLink}
          className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
        >
          Back to Doctors
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Book Appointment
        </h1>

        <p className="mt-2 text-slate-600">
          {doctor?.fullName || 'Loading doctor...'} •
          {doctor?.specialization || 'Doctor information'}
          {hospital ? ` • ${hospital.name}` : ''}
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block font-medium" htmlFor="appointment-date">
            Appointment Date
          </label>

          <input
            id="appointment-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium" htmlFor="appointment-time">
            Appointment Time
          </label>

          <input
            id="appointment-time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium" htmlFor="appointment-reason">
            Reason for Visit
          </label>

          <textarea
            id="appointment-reason"
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <p className="text-sm text-slate-500">
          Your request will be sent to the doctor for approval. You will see a
          Pending status until it is reviewed.
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-3 text-white hover:bg-teal-700"
        >
          Submit Appointment Request
        </button>
      </form>
    </div>
  );
}

export default BookAppointmentPage;

