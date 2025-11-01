import api from '../lib/axios';
import { Avaliacao } from '../types';

export const avaliacaoService = {
    async getAll(): Promise<Avaliacao[]> {
        const response = await api.get<Avaliacao[]>('/avaliacoes');
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/avaliacoes/${id}`);
    }
}; 