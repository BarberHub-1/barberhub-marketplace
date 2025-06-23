import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { agendamentoService, Agendamento } from '../services/agendamento.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '../components/Spinner';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTrash, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ClientAppointments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showConcluirDialog, setShowConcluirDialog] = useState(false);
  const [agendamentoParaConcluir, setAgendamentoParaConcluir] = useState<number | null>(null);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState<number | null>(null);

  const { data: agendamentos, isLoading, error } = useQuery<Agendamento[]>({
    queryKey: ['agendamentos'],
    queryFn: agendamentoService.getAgendamentosCliente,
    enabled: !!user,
    retry: 1
  });

  const cancelarAgendamento = useMutation({
    mutationFn: agendamentoService.cancelarAgendamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success('Agendamento cancelado com sucesso!');
      setShowCancelarDialog(false);
      setAgendamentoParaCancelar(null);
    },
    onError: (error) => {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento. Por favor, tente novamente.');
    }
  });

  const concluirAgendamento = useMutation({
    mutationFn: agendamentoService.concluirAgendamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success('Agendamento concluído com sucesso!');
      setShowConcluirDialog(false);
      setAgendamentoParaConcluir(null);
    },
    onError: (error) => {
      console.error('Erro ao concluir agendamento:', error);
      toast.error('Erro ao concluir agendamento. Por favor, tente novamente.');
    }
  });

  const handleCancelar = (id: number) => {
    setAgendamentoParaCancelar(id);
    setShowCancelarDialog(true);
  };

  const confirmarCancelar = async () => {
    if (agendamentoParaCancelar) {
      try {
        await cancelarAgendamento.mutateAsync(agendamentoParaCancelar);
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
      }
    }
  };

  const handleConcluir = (id: number) => {
    setAgendamentoParaConcluir(id);
    setShowConcluirDialog(true);
  };

  const confirmarConcluir = async () => {
    if (agendamentoParaConcluir) {
      try {
        await concluirAgendamento.mutateAsync(agendamentoParaConcluir);
      } catch (error) {
        console.error('Erro ao concluir agendamento:', error);
      }
    }
  };

  const formatarServico = (servico: string) => {
    const formatacoes: { [key: string]: string } = {
      'HIDRATACAO': 'Hidratação',
      'LUZES': 'Luzes',
      'CORTE': 'Corte',
      'BARBA': 'Barba',
      'COLORACAO': 'Coloração',
      'PINTURA': 'Pintura',
      'ALISAMENTO': 'Alisamento',
      'PENTEADO': 'Penteado',
      'MANICURE': 'Manicure',
      'PEDICURE': 'Pedicure',
      'MASSAGEM': 'Massagem',
      'LIMPEZA': 'Limpeza de Pele',
      'MAQUIAGEM': 'Maquiagem',
      'DEPILACAO': 'Depilação',
      'TRATAMENTO': 'Tratamento Capilar',
      'CORTE_DE_CABELO': 'Corte de Cabelo',
      'CORTE_DE_BARBA': 'Corte de Barba',
      'HIDRATACAO_CAPILAR': 'Hidratação Capilar',
      'COLORACAO_CAPILAR': 'Coloração Capilar',
      'PINTURA_CAPILAR': 'Pintura Capilar',
      'MAQUIAGEM_FESTA': 'Maquiagem para Festa',
      'DEPILACAO_FACIAL': 'Depilação Facial',
      'TRATAMENTO_CAPILAR': 'Tratamento Capilar',
      'CORTE_DE_CABELO_E_BARBA': 'Corte de Cabelo e Barba',
      'ALISAMENTO_CAPILAR': 'Alisamento Capilar',
    };
    return formatacoes[servico] || servico;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Você precisa estar logado para ver seus agendamentos.</p>
            <Button
              onClick={() => navigate('/login')}
              className="mt-4 bg-gray-600 hover:bg-gray-700"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Erro ao carregar agendamentos</h1>
            <p className="mt-2 text-gray-600">Por favor, tente novamente mais tarde.</p>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['agendamentos'] })}
              className="mt-4 bg-gray-600 hover:bg-gray-700"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const agendamentosAtivos = agendamentos?.filter(
    agendamento => agendamento.status === 'AGENDADA'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Agendamentos</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/client/history')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Ver Histórico
            </Button>
          </div>
        </div>

        {agendamentosAtivos && agendamentosAtivos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendamentosAtivos.map((agendamento) => (
              <Card key={agendamento.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-600" />
                      {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Agendado
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-800">Estabelecimento: {agendamento.estabelecimentoNome}</h3>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800">Serviços:</h4>
                      <ul className="text-gray-600 list-disc list-inside">
                        {agendamento.servicosNomes.map((servico, idx) => (
                          <li key={idx}>{formatarServico(servico)}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCancelar(agendamento.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleConcluir(agendamento.id)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Concluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600">Nenhum agendamento ativo</h2>
            <p className="mt-2 text-gray-500">Você não tem agendamentos ativos no momento.</p>
          </div>
        )}
      </div>

      {/* Dialog de Confirmação para Concluir Agendamento */}
      <Dialog open={showConcluirDialog} onOpenChange={setShowConcluirDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaCheck className="text-green-600" />
              Confirmar Conclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja marcar este agendamento como concluído? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConcluirDialog(false);
                setAgendamentoParaConcluir(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarConcluir}
              disabled={concluirAgendamento.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {concluirAgendamento.isPending ? (
                <>
                  <Spinner />
                  Concluindo...
                </>
              ) : (
                'Confirmar Conclusão'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação para Cancelar Agendamento */}
      <Dialog open={showCancelarDialog} onOpenChange={setShowCancelarDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaTrash className="text-red-600" />
              Confirmar Cancelamento
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelarDialog(false);
                setAgendamentoParaCancelar(null);
              }}
            >
              Voltar
            </Button>
            <Button
              onClick={confirmarCancelar}
              disabled={cancelarAgendamento.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelarAgendamento.isPending ? (
                <>
                  <Spinner />
                  Cancelando...
                </>
              ) : (
                'Confirmar Cancelamento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientAppointments; 