import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { agendamentoService } from '../services/agendamento.service';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const ClientSchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const { data: estabelecimentos, isLoading: isLoadingEstabelecimentos } = useQuery({
    queryKey: ['estabelecimentos'],
    queryFn: agendamentoService.getEstabelecimentos,
    enabled: !!user
  });

  const { data: servicos, isLoading: isLoadingServicos } = useQuery({
    queryKey: ['servicos'],
    queryFn: agendamentoService.getServicos,
    enabled: !!user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      const dataHora = new Date(`${selectedDate}T${selectedTime}`);
      await agendamentoService.criarAgendamento({
        clienteId: user?.id,
        estabelecimentoId: 1, // Temporário, deve ser selecionado pelo usuário
        dataHora: dataHora.toISOString(),
        servicos: selectedServices
      });

      toast.success('Agendamento criado com sucesso!');
      navigate('/client/appointments');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao criar agendamento. Por favor, tente novamente.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Você precisa estar logado para fazer um agendamento.</p>
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

  if (isLoadingEstabelecimentos || isLoadingServicos) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Novo Agendamento</h1>
          <Button
            onClick={() => navigate('/client/appointments')}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Voltar para Agendamentos
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preencha os dados do agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços
                </label>
                <div className="space-y-2">
                  {servicos?.map((servico) => (
                    <label key={servico.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(servico.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, servico.id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== servico.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{servico.tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Agendar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSchedule; 