import {
  Calendar,
  Clock,
  MapPin,
  User
} from 'lucide-react';

const statusStyles = {
  Pending: {
    badge:
      'bg-blue-100 text-blue-700 border-blue-200'
  },

  Scheduled: {
    badge:
      'bg-green-100 text-green-700 border-green-200'
  },

  Rejected: {
    badge:
      'bg-red-100 text-red-700 border-red-200'
  },

  'Reschedule Requested': {
    badge:
      'bg-slate-100 text-slate-700 border-slate-300'
  }
};

export function AppointmentCard({
  appointment,
  onViewDetails
}) {
  const hospitalLabel =
    appointment.hospitalName ||
    appointment.hospital ||
    'Hospital not specified';

  // ✅ FIX: normalize backend status values
  const normalizedStatus = (appointment.status || '')
    .toString()
    .trim()
    .toLowerCase();

  const statusKeyMap = {
    pending: 'Pending',
    confirmed: 'Scheduled',
    scheduled: 'Scheduled',
    rejected: 'Rejected',
    'reschedule requested': 'Reschedule Requested'
  };

  const mappedStatus =
    statusKeyMap[normalizedStatus] ||
    appointment.status;

  const style =
    statusStyles[mappedStatus] || {
      badge:
        'bg-slate-100 text-slate-700 border-slate-200'
    };

  return (
    <div
      className={`relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {appointment.doctorName}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {appointment.specialty ||
              'General Consultation'}
          </p>

          {appointment.patientName ? (
            <p className="mt-1 text-xs text-slate-400">
              Patient: {appointment.patientName}
            </p>
          ) : null}
        </div>

        {/* STATUS BADGE (NOW FIXED) */}
        <span
          className={`absolute top-4 right-4 rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${style.badge}`}
        >
          {appointment.status}
        </span>
      </div>

      {/* DETAILS */}
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-blue-600" />
          <span>{appointment.date}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={16} className="text-blue-600" />
          <span>{appointment.time}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-blue-600" />
          <span>{hospitalLabel}</span>
        </div>

        <div className="flex items-start gap-3">
          <User
            size={16}
            className="mt-0.5 text-blue-600"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reason
            </p>

            <p>{appointment.reason}</p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() =>
            onViewDetails(appointment)
          }
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
        </button>

        {appointment.status === 'Scheduled' && (
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Prepare
          </button>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;