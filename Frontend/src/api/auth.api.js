import { apiClient } from './apiClient';

export const authApi = {
  login: ({ identifier, password }) =>
    apiClient
      .post('/auth/login', {
        identifier,
        password,
      })
      .then((response) => response.data),

  getMe: () =>
    apiClient
      .get('/context/me')
      .then((response) => response.data),
};