// src/api/timeline.api.js
import { apiClient } from './apiClient';

export function getTimelineEvents(patientId) {
  if (!patientId) {
    return Promise.resolve([]);
  }

  return apiClient
    .get(`/records/patient/${encodeURIComponent(patientId)}/timeline`)
    .then((response) => response.data);
}

export async function createMedicalEvent(data) {
  try {
    const response = await apiClient.post('/records', data);
    return response.data;
  } catch (err) {
    // Surface the exact backend error so we can diagnose 400s
    const backendMsg = err?.response?.data?.message
      || err?.response?.data?.error
      || JSON.stringify(err?.response?.data)
      || err?.message
      || 'Failed to create medical event.';
    console.error('[createMedicalEvent] Backend error:', err?.response?.status, backendMsg);
    console.error('[createMedicalEvent] Payload sent:', JSON.stringify(data, null, 2));
    const error = new Error(backendMsg);
    error.status = err?.response?.status;
    throw error;
  }
}

export const timelineApi = {
  getAll: getTimelineEvents,
  create: createMedicalEvent
};
