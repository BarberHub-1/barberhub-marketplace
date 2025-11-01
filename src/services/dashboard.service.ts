import api from '../lib/axios';

export interface DashboardStats {
    totalUsuarios: number;
    totalEstabelecimentos: number;
    totalAgendamentos: number;
    estabelecimentosPendentes: number;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        // Tipando a requisição para DashboardStats
        const response = await api.get<DashboardStats>('/admin/dashboard/stats');
        return response.data;
    }
};