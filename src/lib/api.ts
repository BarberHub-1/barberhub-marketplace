import axios from 'axios';

// Pega a URL da API a partir da variável de ambiente
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // <-- aqui
    headers: {
        'Content-Type': 'application/json',
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
