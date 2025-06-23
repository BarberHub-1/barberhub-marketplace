export interface Usuario {
    id: number;
    email: string;
    senha: string;
}

export interface Cliente extends Usuario {
    nome: string;
    telefone: string;
    foto?: string;
}

export interface Profissional extends Usuario {
    nome: string;
    telefone: string;
    foto?: string;
    especialidades: string[];
}

export interface Estabelecimento {
    id: number;
    nomeEstabelecimento: string;
    nomeProprietario: string;
    cnpj: string;
    email: string;
    telefone: string;
    rua: string;
    numero: number;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    descricao?: string;
    foto?: string;
    status: string;
    horario: {
        id: number;
        diaSemana: string;
        horarioAbertura: string;
        horarioFechamento: string;
    }[];
    servicos: (string | {
        id: number;
        descricao: string;
        preco: number;
        duracaoMinutos: number;
        tipo: string;
    })[];
    notaMedia?: number;
    quantidadeAvaliacoes?: number;
}

export interface HorarioFuncionamento {
    id: number;
    diaSemana: string;
    horarioAbertura: string;
    horarioFechamento: string;
}

export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    estabelecimentoId: number;
}

export interface Agendamento {
    id: number;
    clienteId: number;
    estabelecimentoId: number;
    estabelecimentoNome: string;
    dataHora: string;
    servicos: number[];
    servicosNomes: string[];
    status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
}

export interface Avaliacao {
    id: number;
    clienteId: number;
    clienteNome: string;
    estabelecimentoId: number;
    estabelecimentoNome: string;
    nota: number;
    comentario: string;
    dataAvaliacao: string;
} 