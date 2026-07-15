import { apiClient } from './apiClient';

export function getUsers(page = 0, size = 20) {
  return apiClient.get('/auth/users', { params: { page, size } })
    .then((r) => {
      const data = r.data;
      if (data && Array.isArray(data.content)) {
        return data;
      }
      return { content: Array.isArray(data) ? data : [], page: 0, size: 20, totalElements: Array.isArray(data) ? data.length : 0, totalPages: 1 };
    });
}

export function getUsersByRole(role) {
  return apiClient
    .get(`/auth/users/role/${encodeURIComponent(role)}`)
    .then((r) => r.data);
}

export function getUserStats() {
  return apiClient.get('/auth/users/stats').then((r) => r.data);
}
