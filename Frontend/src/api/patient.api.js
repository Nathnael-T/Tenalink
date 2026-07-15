// src/api/patient.api.js
import { apiClient } from './apiClient';

export const patientApi = {
  getProfile: (patientId) =>
    apiClient.get(`/patients/${encodeURIComponent(patientId)}`).then((response) => response.data),
  updateProfile: (patientId, profileData) =>
    apiClient.put(`/patients/${encodeURIComponent(patientId)}`, profileData).then((response) => response.data),
};
