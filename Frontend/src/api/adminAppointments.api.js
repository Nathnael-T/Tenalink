import { apiClient } from './apiClient';

export function getAdminAppointments(page = 0, size = 20) {
  return apiClient.get('/admin/appointments', { params: { page, size } })
    .then((r) => {
      const data = r.data;
      // Support both paginated and legacy array response
      if (data && Array.isArray(data.content)) {
        return data;
      }
      return { content: Array.isArray(data) ? data : [], page: 0, size: 20, totalElements: Array.isArray(data) ? data.length : 0, totalPages: 1 };
    });
}

export function getAdminAppointmentOverview() {
  return apiClient.get('/admin/appointments/overview').then((r) => r.data);
}
