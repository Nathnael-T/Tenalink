import { apiClient } from './apiClient';

export function getHospitals(page = 0, size = 20) {
  return apiClient.get('/hospitals', { params: { page, size } })
    .then((r) => {
      const data = r.data;
      // Support both paginated and legacy array response
      if (data && Array.isArray(data.content)) {
        return data;
      }
      return { content: Array.isArray(data) ? data : [], page: 0, size: 20, totalElements: Array.isArray(data) ? data.length : 0, totalPages: 1 };
    });
}

export function getHospitalById(id) {
  return apiClient.get(`/hospitals/${encodeURIComponent(id)}`).then((r) => r.data);
}

export function createHospital(data) {
  return apiClient.post('/hospitals', data).then((r) => r.data);
}

export function updateHospital(id, data) {
  return apiClient.put(`/hospitals/${encodeURIComponent(id)}`, data).then((r) => r.data);
}

export function deleteHospital(id) {
  return apiClient.delete(`/hospitals/${encodeURIComponent(id)}`).then((r) => r.data);
}

