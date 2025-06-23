import api from '../lib/api';
import { Usuario } from '../types';

interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
}

export const authService = {
    async login(email: string, senha: string) {
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, senha });
            const { token, tipo, id } = response.data;
            localStorage.setItem('token', token);
            return { id, tipo };
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },

    async register(usuario: Partial<Usuario>) {
        const response = await api.post('/auth/register', usuario);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
}; 