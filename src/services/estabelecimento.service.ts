import api from '../lib/axios';
import { Estabelecimento, HorarioFuncionamento } from '../types';

export const estabelecimentoService = {
    // Para páginas públicas
    getAprovados: async (): Promise<Estabelecimento[]> => {
        const response = await api.get<Estabelecimento[]>('/api/estabelecimentos');
        return response.data.map(est => ({
            ...est,
            foto: est.foto ? `data:image/jpeg;base64,${est.foto}` : undefined
        }));
    },

    // Para o painel de admin
    getAll: async (): Promise<Estabelecimento[]> => {
        const response = await api.get<Estabelecimento[]>('/api/estabelecimentos/all');
        return response.data.map(est => ({
            ...est,
            foto: est.foto ? `data:image/jpeg;base64,${est.foto}` : undefined
        }));
    },

    getById: async (id: number): Promise<Estabelecimento> => {
        const response = await api.get<Estabelecimento>(`/api/estabelecimentos/${id}`);
        return {
            ...response.data,
            foto: response.data.foto ? `data:image/jpeg;base64,${response.data.foto}` : undefined
        };
    },

    getHorarios: async (id: number): Promise<HorarioFuncionamento[]> => {
        const response = await api.get<HorarioFuncionamento[]>(`/api/estabelecimentos/${id}/horarios`);
        return response.data;
    },

    create: async (data: any): Promise<Estabelecimento> => {
        const response = await api.post<Estabelecimento>('/api/estabelecimentos', data);
        return response.data;
    },

    update: async (id: number, data: any): Promise<Estabelecimento> => {
        const response = await api.put<Estabelecimento>(`/api/estabelecimentos/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/estabelecimentos/${id}`);
    },

    aprovar: async (id: number): Promise<Estabelecimento> => {
        const response = await api.patch<Estabelecimento>(`/api/estabelecimentos/${id}/status`, { status: 'APROVADO' });
        return response.data;
    },

    rejeitar: async (id: number): Promise<Estabelecimento> => {
        const response = await api.patch<Estabelecimento>(`/api/estabelecimentos/${id}/status`, { status: 'REJEITADO' });
        return response.data;
    },

    desativar: async (id: number): Promise<Estabelecimento> => {
        const response = await api.patch<Estabelecimento>(`/api/estabelecimentos/${id}/status`, { status: 'REJEITADO' });
        return response.data;
    }
}; 