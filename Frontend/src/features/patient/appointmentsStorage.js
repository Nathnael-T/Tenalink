export const APPOINTMENTS_STORAGE_KEY = 'appointments';

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  RESCHEDULE_REQUESTED: 'Reschedule Requested',
};

export function getAppointments() {
  try {
    const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAppointments(appointments) {
  localStorage.setItem(
    APPOINTMENTS_STORAGE_KEY,
    JSON.stringify(appointments)
  );
}

export function addAppointment(appointment) {
  const appointments = getAppointments();
  saveAppointments([...appointments, appointment]);
}

export function updateAppointmentStatus(id, status) {
  const appointments = getAppointments();
  const updated = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status } : appointment
  );
  saveAppointments(updated);
  return updated;
}

export function getPendingAppointments() {
  return getAppointments().filter(
    (appointment) => appointment.status === APPOINTMENT_STATUS.PENDING
  );
}
