import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AgendamentoResponse {
  id: number;
  dataHora: string;
  statusAgendamento?: 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA';
  status?: 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA';
  clienteId: number;
  clienteNome: string;
  estabelecimentoId: number;
  estabelecimentoNome: string;
  servicos: number[];
  servicosNomes: string[];
  avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    dataAvaliacao: string;
  };
}

// Interceptor para mapear o status do agendamento
api.interceptors.response.use((response) => {
  if (response.data) {
    if (Array.isArray(response.data)) {
      response.data = response.data.map((agendamento: AgendamentoResponse) => ({
        ...agendamento,
        status: agendamento.statusAgendamento || agendamento.status,
        avaliacao: agendamento.avaliacao
      }));
    } else if ((response.data as AgendamentoResponse).statusAgendamento) {
      (response.data as AgendamentoResponse).status = (response.data as AgendamentoResponse).statusAgendamento;
    }
  }
  return response;
});

export interface Agendamento {
  id: number;
  // Data e hora do agendamento no formato ISO 8601
  dataHora: string;
  status: 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA';
  statusAgendamento?: 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA';
  clienteId: number;
  clienteNome: string;
  estabelecimentoId: number;
  estabelecimentoNome: string;
  servicos: number[]; // Lista de IDs de serviço
  servicosNomes: string[]; // Lista de nomes dos serviços
  profissionalId?: number;
  avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    dataAvaliacao: string;
  };
}

export interface AgendamentoPayload {
  clienteId: number;
  estabelecimentoId: number;
  servicos: number[]; // Lista de IDs de serviço
  dataHora: string; // Formato ISO 8601
}

export interface Estabelecimento {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

export interface Servico {
  id: number;
  tipo: string;
  preco: number;
}

export interface AvaliacaoPayload {
  nota: number;
  comentario: string;
  agendamentoId: number;
  estabelecimentoId: number;
  dateTime: string;
}

export const agendamentoService = {
  // Buscar todos os agendamentos do cliente logado
  getAgendamentosCliente: async (): Promise<Agendamento[]> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuário não encontrado');
    }
    const user = JSON.parse(userStr);
    const clienteId = user.id;

    if (!clienteId) {
      throw new Error('ID do cliente não encontrado');
    }
    const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/cliente/${clienteId}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.map((agendamento) => ({
      ...agendamento,
      status: (agendamento.statusAgendamento || agendamento.status) as 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA'
    }));
  },

  // Buscar todos os agendamentos por um ID de cliente específico (para admin)
  getByClienteId: async (clienteId: number): Promise<Agendamento[]> => {
    const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/cliente/${clienteId}`);
    return response.data.map((agendamento) => ({
      ...agendamento,
      status: (agendamento.statusAgendamento || agendamento.status) as 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA'
    }));
  },

  // Buscar todos os agendamentos do estabelecimento logado
  getAgendamentosEstabelecimento: async (status?: string[]): Promise<Agendamento[]> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Usuário não encontrado');
    }
    const user = JSON.parse(userStr);
    const estabelecimentoId = user.id;
    if (!estabelecimentoId) {
      throw new Error('ID do estabelecimento não encontrado');
    }

    const params = new URLSearchParams();
    if (status && status.length > 0) {
      params.append('status', status.join(','));
    }

    const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/estabelecimento/${estabelecimentoId}`, {
      params,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.map((agendamento) => ({
      ...agendamento,
      status: (agendamento.statusAgendamento || agendamento.status) as 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA'
    }));
  },

  // Criar novo agendamento
  criarAgendamento: async (data: AgendamentoPayload): Promise<Agendamento> => {
    console.log('Enviando dados para criar agendamento:', data);
    
    // Validar dados obrigatórios
    if (!data.clienteId) {
      throw new Error('ID do cliente é obrigatório');
    }
    if (!data.estabelecimentoId) {
      throw new Error('ID do estabelecimento é obrigatório');
    }
    if (!data.servicos || data.servicos.length === 0) {
      throw new Error('Pelo menos um serviço deve ser selecionado');
    }
    if (!data.dataHora) {
      throw new Error('Data e hora são obrigatórias');
    }

    try {
      const response = await api.post<AgendamentoResponse>('/api/agendamentos', data);
      console.log('Resposta do servidor:', response.data);
      
      return {
        ...response.data,
        status: (response.data.statusAgendamento || response.data.status) as 'AGENDADA' | 'CANCELADA' | 'CONCLUIDA'
      };
    } catch (error: any) {
      console.error('Erro na requisição:', error.response?.data);
      throw error;
    }
  },

  // Cancelar agendamento
  cancelarAgendamento: async (id: number): Promise<void> => {
    await api.put(`/api/agendamentos/${id}/cancelar`);
  },

  // Concluir agendamento
  concluirAgendamento: async (id: number): Promise<void> => {
    await api.put(`/api/agendamentos/${id}/status?status=CONCLUIDA`);
  },

  getEstabelecimentos: async (): Promise<Estabelecimento[]> => {
    const response = await api.get<Estabelecimento[]>('/estabelecimentos');
    return response.data;
  },

  getServicos: async (): Promise<Servico[]> => {
    const response = await api.get<Servico[]>('/api/servicos');
    return response.data;
  },

  avaliarAgendamento: async (id: number, avaliacao: AvaliacaoPayload): Promise<void> => {
    await api.put(`/api/agendamentos/${id}/avaliacao`, {
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      agendamentoId: avaliacao.agendamentoId,
      estabelecimentoId: avaliacao.estabelecimentoId,
      dateTime: avaliacao.dateTime
    });
  }
}; 