import api from '../lib/axios';
import { Cliente } from '../types';

export const clienteService = {
    async getAll() {
        const response = await api.get<Cliente[]>('/clientes');
        return response.data.map(cliente => ({
            ...cliente,
            foto: cliente.foto ? `data:image/jpeg;base64,${cliente.foto}` : undefined
        }));
    },

    async getById(id: number) {
        const response = await api.get<Cliente>(`/clientes/${id}`);
        return {
            ...response.data,
            foto: response.data.foto ? `data:image/jpeg;base64,${response.data.foto}` : undefined
        };
    },

    async create(cliente: Partial<Cliente>) {
        const response = await api.post<Cliente>('/clientes', cliente);
        return response.data;
    },

    async update(id: number, cliente: Partial<Cliente>) {
        const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
        return response.data;
    },

    async delete(id: number) {
        await api.delete(`/clientes/${id}`);
    }
}; 