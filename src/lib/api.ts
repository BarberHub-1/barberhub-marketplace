import axios from 'axios';


const api = axios.create({
  baseURL: '', // todas as requisições serão redirecionadas para /.netlify/functions/proxy/
  headers: {
    'Content-Type': 'application/json'
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    if (!config.url?.includes('/auth/') && 
        !(config.url?.includes('/api/clientes') && config.method === 'post') && 
        !(config.url?.includes('/api/estabelecimentos') && config.method === 'post')) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
