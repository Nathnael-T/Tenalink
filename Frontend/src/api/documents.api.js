// src/api/documents.api.js
import { apiClient } from './apiClient';

export function getDocuments(patientId) {
  if (!patientId) {
    return Promise.resolve([]);
  }

  return apiClient
    .get(`/records/patient/${encodeURIComponent(patientId)}/documents`)
    .then((response) => response.data);
}

export const documentsApi = {
  getAll: getDocuments
};
