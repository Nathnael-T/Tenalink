import { apiClient } from './apiClient';

// =========================
// GET APPOINTMENTS (PATIENT)
// =========================
export function getAppointments(patientId) {
  if (!patientId) return Promise.resolve([]);

  return apiClient
    .get(`/appointments/patient/${encodeURIComponent(patientId)}`)
    .then((res) => res.data);
}

// =========================
// GET APPOINTMENTS (DOCTOR)
// =========================
export function getAppointmentsByDoctor(doctorId) {
  if (!doctorId) return Promise.resolve([]);

  return apiClient
    .get(`/appointments/doctor/${encodeURIComponent(doctorId)}`)
    .then((res) => res.data);
}

// =========================
// GET SINGLE APPOINTMENT
// =========================
export function getAppointmentById(id) {
  if (!id) return Promise.resolve(null);

  return apiClient
    .get(`/appointments/${encodeURIComponent(id)}`)
    .then((res) => res.data);
}

// =========================
// CREATE APPOINTMENT
// =========================
export async function createAppointment(data) {
  try {
    const res = await apiClient.post('/appointments', data);
    return res.data;
  } catch (err) {
    console.error("FULL BACKEND ERROR:", err.response?.data);
    console.error("STATUS:", err.response?.status);
    console.error("MESSAGE:", err.message);
    throw err;
  }
}

// =========================
// UPDATE APPOINTMENT (FULL)
// =========================
export function updateAppointment(id, data) {
  return apiClient
    .put(`/appointments/${encodeURIComponent(id)}`, data)
    .then((res) => res.data);
}

// =========================
// UPDATE APPOINTMENT STATUS (IMPORTANT FIX)
// =========================
export function updateAppointmentStatus(id, status) {
  return apiClient
    .put(`/appointments/${encodeURIComponent(id)}/status`, { status })
    .then((res) => res.data);
}

// =========================
// DELETE / CANCEL APPOINTMENT (optional but needed)
// =========================
export function deleteAppointment(id) {
  return apiClient
    .delete(`/appointments/${encodeURIComponent(id)}`)
    .then((res) => res.data);
}

// =========================
// OPTIONAL API WRAPPER
// =========================
export const appointmentsApi = {
  getAll: getAppointments,
  getByDoctor: getAppointmentsByDoctor,
  getById: getAppointmentById,
  create: createAppointment,
  update: updateAppointment,
  updateStatus: updateAppointmentStatus,
  delete: deleteAppointment,
};