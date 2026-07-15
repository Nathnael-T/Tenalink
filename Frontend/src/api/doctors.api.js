import { apiClient } from './apiClient';

export function getDoctors(hospitalId) {
  const params = hospitalId ? { hospitalId } : {};
  return apiClient
    .get('/doctors', { params })
    .then((response) => response.data);
}

export function getDoctorById(doctorId) {
  return apiClient
    .get(`/doctors/${encodeURIComponent(doctorId)}`)
    .then((response) => response.data);
}

export const doctorsApi = {
  getAll: getDoctors,
  getById: getDoctorById
};
