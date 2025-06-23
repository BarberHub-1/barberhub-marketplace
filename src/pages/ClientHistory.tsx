import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { agendamentoService, Agendamento, AvaliacaoPayload } from '../services/agendamento.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '../components/Spinner';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ClientHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [isAvaliacaoModalOpen, setIsAvaliacaoModalOpen] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

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
      'CORTE_DE_CABELO_E_BARBA': 'Corte de Cabelo e Barba',
      'HIDRATACAO_CAPILAR': 'Hidratação Capilar',
      'COLORACAO_CAPILAR': 'Coloração Capilar',
      'ALISAMENTO_CAPILAR': 'Alisamento Capilar',
      'PINTURA_DE_CABELO': 'Pintura de Cabelo',
      'PENTEADO_FESTA': 'Penteado para Festa',
      'TRATAMENTO_CAPILAR': 'Tratamento Capilar',
      'LIMPEZA_DE_PELE': 'Limpeza de Pele',
      'DEPILACAO_FACIAL': 'Depilação Facial',
      'DEPILACAO_CORPORAL': 'Depilação Corporal'
    };
    return formatacoes[servico] || servico;
  };

  const { data: agendamentos, isLoading, error } = useQuery<Agendamento[]>({
    queryKey: ['agendamentos'],
    queryFn: agendamentoService.getAgendamentosCliente,
    enabled: !!user,
    retry: 1
  });

  const avaliarAgendamento = useMutation({
    mutationFn: ({ id, avaliacao }: { id: number; avaliacao: AvaliacaoPayload }) =>
      agendamentoService.avaliarAgendamento(id, avaliacao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success('Avaliação enviada com sucesso!');
      setIsAvaliacaoModalOpen(false);
      setNota(0);
      setComentario('');
      setSelectedAgendamento(null);
    },
    onError: (error) => {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação. Por favor, tente novamente.');
    }
  });

  const handleAvaliar = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setIsAvaliacaoModalOpen(true);
  };

  const handleSubmitAvaliacao = () => {
    if (!selectedAgendamento) return;
    if (nota === 0) {
      toast.error('Por favor, selecione uma nota');
      return;
    }

    const dataAtual = new Date().toISOString();
    avaliarAgendamento.mutate({
      id: selectedAgendamento.id,
      avaliacao: {
        nota,
        comentario,
        agendamentoId: selectedAgendamento.id,
        estabelecimentoId: selectedAgendamento.estabelecimentoId,
        dateTime: dataAtual
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Você precisa estar logado para ver seu histórico.</p>
            <Button
              onClick={() => navigate('/login')}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
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
            <h1 className="text-2xl font-bold text-red-600">Erro ao carregar histórico</h1>
            <p className="mt-2 text-gray-600">Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  const agendamentosCancelados = agendamentos?.filter(
    agendamento => agendamento.status === 'CANCELADA'
  );

  const agendamentosConcluidos = agendamentos?.filter(
    agendamento => agendamento.status === 'CONCLUIDA'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Histórico de Agendamentos</h1>
          <Button
            onClick={() => navigate('/client/appointments')}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Voltar para Agendamentos
          </Button>
        </div>

        {/* Seção de Agendamentos Cancelados */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agendamentos Cancelados</h2>
          {agendamentosCancelados && agendamentosCancelados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agendamentosCancelados.map((agendamento) => (
                <Card key={agendamento.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" />
                        {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                        Cancelado
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
                        <p className="text-gray-600">{agendamento.servicosNomes.map(formatarServico).join(', ')}</p>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-600">Nenhum agendamento cancelado</h3>
              <p className="mt-2 text-gray-500">Você ainda não tem agendamentos cancelados no seu histórico.</p>
            </div>
          )}
        </div>

        {/* Seção de Agendamentos Concluídos */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agendamentos Concluídos</h2>
          {agendamentosConcluidos && agendamentosConcluidos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agendamentosConcluidos.map((agendamento) => (
                <Card key={agendamento.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" />
                        {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Concluído
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
                        <p className="text-gray-600">{agendamento.servicosNomes.map(formatarServico).join(', ')}</p>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {!agendamento.avaliacao && (
                        <Button
                          onClick={() => handleAvaliar(agendamento)}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          <FaStar className="mr-2" />
                          Avaliar Estabelecimento
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-600">Nenhum agendamento concluído</h3>
              <p className="mt-2 text-gray-500">Você ainda não tem agendamentos concluídos no seu histórico.</p>
            </div>
          )}
        </div>

        {/* Modal de Avaliação */}
        <Dialog open={isAvaliacaoModalOpen} onOpenChange={setIsAvaliacaoModalOpen}>
          <DialogContent className="sm:max-w-[425px]" aria-describedby="avaliacao-dialog-description">
            <DialogHeader>
              <DialogTitle>Avaliar Agendamento</DialogTitle>
              <DialogDescription id="avaliacao-dialog-description">
                Avalie sua experiência com o estabelecimento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nota">Nota</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={nota === value ? "default" : "outline"}
                      onClick={() => setNota(value)}
                      className="w-10 h-10 p-0"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comentario">Comentário</Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Conte-nos sobre sua experiência..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAvaliacaoModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitAvaliacao} disabled={avaliarAgendamento.isPending}>
                {avaliarAgendamento.isPending ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientHistory; 