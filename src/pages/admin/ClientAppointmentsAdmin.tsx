import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Agendamento } from '../../types';
import { agendamentoService } from '../../services/agendamento.service';
import { useToast } from '../../hooks/use-toast';

const ClientAppointmentsAdmin = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadAgendamentos(Number(id));
        }
    }, [id]);

    const loadAgendamentos = async (clienteId: number) => {
        try {
            setLoading(true);
            const data = await agendamentoService.getByClienteId(clienteId);
            setAgendamentos(data);
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os agendamentos do cliente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            AGENDADO: 'Agendado',
            CONFIRMADO: 'Confirmado',
            CONCLUIDO: 'Concluído',
            CANCELADO: 'Cancelado',
        };
        return statusMap[status] || status;
    };
    
    const getStatusColor = (status: string) => {
        const colorMap: { [key: string]: string } = {
            AGENDADO: 'bg-blue-100 text-blue-800',
            CONFIRMADO: 'bg-yellow-100 text-yellow-800',
            CONCLUIDO: 'bg-green-100 text-green-800',
            CANCELADO: 'bg-red-100 text-red-800',
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Agendamentos do Cliente</h1>
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <p className="mt-2 text-gray-600">Carregando agendamentos...</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">ID</th>
                                        <th className="text-left py-3 px-4">Estabelecimento</th>
                                        <th className="text-left py-3 px-4">Data</th>
                                        <th className="text-left py-3 px-4">Horário</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agendamentos.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-500">
                                                Nenhum agendamento encontrado para este cliente.
                                            </td>
                                        </tr>
                                    ) : (
                                        agendamentos.map((agendamento) => {
                                            const data = new Date(agendamento.dataHora);
                                            const dataFormatada = !isNaN(data.getTime()) ? data.toLocaleDateString() : 'Data inválida';
                                            const horaFormatada = !isNaN(data.getTime()) ? data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hora inválida';

                                            return (
                                                <tr key={agendamento.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">{agendamento.id}</td>
                                                    <td className="py-3 px-4">{agendamento.estabelecimentoNome}</td>
                                                    <td className="py-3 px-4">{dataFormatada}</td>
                                                    <td className="py-3 px-4">{horaFormatada}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(agendamento.status)}`}>
                                                            {getStatusText(agendamento.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientAppointmentsAdmin; 