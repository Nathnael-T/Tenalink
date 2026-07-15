import { apiClient } from './apiClient';

export function getAuditLogs(page = 0, size = 20) {
  return apiClient.get('/audit-logs', { params: { page, size } })
    .then((r) => {
      const data = r.data;
      if (data && Array.isArray(data.content)) {
        return data;
      }
      return { content: Array.isArray(data) ? data : [], page: 0, size: 20, totalElements: Array.isArray(data) ? data.length : 0, totalPages: 1 };
    });
}

export function getAuditLogsByAdmin(adminId) {
  return apiClient
    .get(`/audit-logs/admin/${encodeURIComponent(adminId)}`)
    .then((r) => r.data);
}
