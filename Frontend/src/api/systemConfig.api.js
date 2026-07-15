import { apiClient } from './apiClient';

export function getSystemConfigs() {
  return apiClient.get('/system-config').then((r) => r.data);
}

export function getSystemConfigByKey(key) {
  return apiClient.get(`/system-config/${encodeURIComponent(key)}`).then((r) => r.data);
}

export function createSystemConfig(data) {
  return apiClient.post('/system-config', data).then((r) => r.data);
}

export function updateSystemConfig(key, data) {
  return apiClient.put(`/system-config/${encodeURIComponent(key)}`, data).then((r) => r.data);
}

export function deleteSystemConfig(key) {
  return apiClient.delete(`/system-config/${encodeURIComponent(key)}`).then((r) => r.data);
}
