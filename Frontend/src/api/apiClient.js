import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1`,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const authState = JSON.parse(localStorage.getItem('authState') || 'null');
  const token = authState?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authState');
      localStorage.removeItem('session');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject({
      original: error,
      message:
        error.response?.data?.message ||
        error.message ||
        'Unexpected error',
    });
  }
);

export { apiClient };
export default apiClient;

