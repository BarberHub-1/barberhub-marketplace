import axios from 'axios';

// URL base agora aponta para o próprio frontend (proxy via Netlify)
const api = axios.create({
  baseURL: '/api', // todas as requisições serão redirecionadas para /.netlify/functions/proxy/
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT, se existir
api.interceptors.request.use(
  (config) => {
    if (config.url !== '/auth/login') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
