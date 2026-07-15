import { useEffect, useState } from 'react';
import { patientApi } from '../../../api/patient.api';

function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function PatientContextBanner({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = await patientApi.getProfile(patientId);
        if (mounted) setPatient(data);
      } catch {
        // silently fail — banner just won't render
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [patientId]);

  if (loading || !patient) {
    return null;
  }

  const age = computeAge(patient.dateOfBirth);
  const name = patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
        Patient Context
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Patient Name
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {name || 'Unknown'}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Patient ID
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {patient.id}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Age
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {age != null ? `${age} yrs` : 'N/A'}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Gender
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {patient.gender || 'N/A'}
          </p>
        </div>
      </div>
    </section>
  );
}
