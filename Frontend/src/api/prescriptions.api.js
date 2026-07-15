// src/api/prescriptions.api.js
import { apiClient } from './apiClient';

export function getPrescriptions(patientId) {
  if (!patientId) {
    return Promise.resolve([]);
  }

  return apiClient
    .get(`/prescriptions/patient/${encodeURIComponent(patientId)}`)
    .then((response) => response.data);
}

export function getPrescriptionById(id) {
  return apiClient
    .get(`/prescriptions/${encodeURIComponent(id)}`)
    .then((response) => response.data);
}

export function createPrescription(data) {
  return apiClient
    .post('/prescriptions', data)
    .then((response) => response.data);
}

export function updatePrescription(id, data) {
  return apiClient
    .put(`/prescriptions/${encodeURIComponent(id)}`, data)
    .then((response) => response.data);
}

export function deletePrescription(id) {
  return apiClient
    .delete(`/prescriptions/${encodeURIComponent(id)}`)
    .then((response) => response.data);
}

export const prescriptionsApi = {
  getAll: getPrescriptions,
  getById: getPrescriptionById,
  create: createPrescription,
  update: updatePrescription,
  delete: deletePrescription
};

