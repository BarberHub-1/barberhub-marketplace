import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { estabelecimentoService } from '../services/estabelecimento.service';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '../components/Spinner';
import { useToast } from '@/hooks/use-toast';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { agendamentoService } from '../services/agendamento.service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Servico {
  id: number;
  tipo: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
}

interface BarberShop {
  id: number;
  nomeEstabelecimento: string;
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
  servicos: Servico[];
}

const AppointmentContent = ({ barbershop, availableTimes, handleSubmit, selectedServices, setSelectedServices, selectedDate, setSelectedDate, selectedTime, setSelectedTime, disabledDays }: { barbershop: BarberShop, availableTimes: string[], handleSubmit: (e: React.FormEvent) => Promise<void>, selectedServices: Servico[], setSelectedServices: React.Dispatch<React.SetStateAction<Servico[]>>, selectedDate: Date | undefined, setSelectedDate: React.Dispatch<React.SetStateAction<any>>, selectedTime: string, setSelectedTime: React.Dispatch<React.SetStateAction<string>>, disabledDays: (({ date }: { date: Date; }) => boolean )}) => (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Agendar Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{barbershop.nomeEstabelecimento}</h2>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
            <span>
              {barbershop.rua}, {barbershop.numero} - {barbershop.bairro}, {barbershop.cidade}
            </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleção de Serviços */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviços
                  </label>
                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                    {barbershop.servicos.map((servico) => {
                      const isSelected = selectedServices.some(s => s.id === servico.id);
                      return (
                        <div key={servico.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`servico-${servico.id}`}
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices(prev => [...prev, servico]);
                              } else {
                                setSelectedServices(prev => prev.filter(s => s.id !== servico.id));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`servico-${servico.id}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800">{servico.descricao}</span>
                              <div className="text-right">
                                <span className="text-gray-900 font-semibold">
                                  R$ {typeof servico.preco === 'number' ? servico.preco.toFixed(2) : 'N/A'}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                  ({servico.duracaoMinutos || 0} min)
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {selectedServices.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">Selecione pelo menos um serviço</p>
                  )}
                </div>

                {/* Seleção de Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <FaCalendarAlt className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span className="text-gray-500">Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        value={selectedDate}
                        onChange={(value: any) => {
                          // react-calendar pode retornar um array para range, então garantimos que é uma data
                          const newDate = Array.isArray(value) ? value[0] : value;
                          if (newDate instanceof Date) {
                            setSelectedDate(newDate);
                          }
                        }}
                        tileDisabled={disabledDays}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Seleção de Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  {availableTimes.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 border rounded-lg text-sm ${selectedTime === time ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {selectedDate && selectedServices.length > 0 ? (
                        <p>Não há horários disponíveis para este dia. Tente selecionar outra data.</p>
                      ) : (
                        <p>Selecione uma data e pelo menos um serviço para ver os horários disponíveis.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Resumo do Agendamento */}
                {selectedServices.length > 0 && selectedDate && selectedTime && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Resumo do Agendamento</h3>
                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <span className="font-medium">Serviços:</span>
                        <ul className="mt-1 ml-4 space-y-1">
                          {selectedServices.map((servico) => (
                            <li key={servico.id} className="flex justify-between">
                              <span>• {servico.descricao}</span>
                              <span className="text-gray-900">R$ {typeof servico.preco === 'number' ? servico.preco.toFixed(2) : 'N/A'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Data:</span>{' '}
                        {format(selectedDate, "PPP", { locale: ptBR })}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Horário:</span> {selectedTime}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Duração Total:</span> {selectedServices.reduce((total, servico) => total + (servico.duracaoMinutos || 0), 0)} minutos
                      </p>
                      <p className="text-gray-600 font-semibold">
                        <span className="font-medium">Valor Total:</span> R$ {selectedServices.reduce((total, servico) => total + (typeof servico.preco === 'number' ? servico.preco : 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-6 text-lg"
                  disabled={selectedServices.length === 0}
                >
                  Confirmar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
);

const Appointment = () => {
  // 1. Chamar TODOS os hooks incondicionalmente no topo.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<Servico[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { data: barbershop, isLoading, error } = useQuery<BarberShop>({
    queryKey: ['barbershop', id],
    queryFn: async () => {
      const response = await estabelecimentoService.getById(Number(id));
      
      // Processa a resposta para garantir que os serviços sejam do tipo correto
      const processedServicos = response.servicos.map((servico, index) => {
        if (typeof servico === 'string') {
          // Tenta fazer o parse da string. Se falhar, retorna um objeto padrão.
          try {
            const tipoMatch = servico.match(/tipo=([^,]+)/);
            const descMatch = servico.match(/descricao=([^,]+)/);
            const precoMatch = servico.match(/preco=([^,]+)/);
            const duracaoMatch = servico.match(/duracaoMinutos=(\d+)/);
            const idMatch = servico.match(/id=(\d+)/);
            
            return {
              id: idMatch ? parseInt(idMatch[1]) : index + 1, // Usar ID do match ou index + 1
              tipo: tipoMatch ? tipoMatch[1] : 'N/A',
              descricao: descMatch ? descMatch[1] : 'Serviço',
              preco: precoMatch ? parseFloat(precoMatch[1]) : 0,
              duracaoMinutos: duracaoMatch ? parseInt(duracaoMatch[1]) : 30,
            };
          } catch (error) {
            return { id: index + 1, tipo: 'N/A', descricao: 'Serviço Inválido', preco: 0, duracaoMinutos: 0 };
          }
        }
        
        // Se já for um objeto, garantir que todos os campos existam
        const servicoObj = servico as Servico;
        return {
          id: servicoObj.id || index + 1,
          tipo: servicoObj.tipo || '',
          descricao: servicoObj.descricao || '',
          preco: typeof servicoObj.preco === 'number' ? servicoObj.preco : 0,
          duracaoMinutos: servicoObj.duracaoMinutos || 0
        };
      });

      return { ...response, servicos: processedServicos };
    },
    enabled: !!id && !authLoading && !!user,
  });

  const { data: horarios, isLoading: isLoadingHorarios } = useQuery({
    queryKey: ['horarios', id],
    queryFn: () => estabelecimentoService.getHorarios(Number(id)),
    enabled: !!id && !authLoading && !!user,
  });

  const diasDeFuncionamento = React.useMemo(() => {
    if (!horarios) return [];
    const diaMap: { [key: string]: number } = {
      DOMINGO: 0,
      SEGUNDA: 1,
      TERCA: 2,
      QUARTA: 3,
      QUINTA: 4,
      SEXTA: 5,
      SABADO: 6,
    };
    const diasMapeados = horarios.map(h => diaMap[h.diaSemana]).filter(d => d !== undefined);
    return diasMapeados;
  }, [horarios]);

  const availableTimes = React.useMemo(() => {
    if (!horarios || !selectedDate || !selectedServices.length) {
      return [];
    }

    // Usa getDay() que retorna 0-6 (0 = domingo, 1 = segunda, etc.)
    const dayOfWeek = selectedDate.getDay();
    
    // Mapeia o número do dia para o nome usado no backend
    const dayNames = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
    const diaSemana = dayNames[dayOfWeek];
    
    const horarioDoDia = horarios.find(h => h.diaSemana === diaSemana);

    if (!horarioDoDia) {
      return [];
    }

    const times = [];
    const [startHour, startMinute] = horarioDoDia.horarioAbertura.split(':').map(Number);
    const [endHour, endMinute] = horarioDoDia.horarioFechamento.split(':').map(Number);
    
    // Converte para minutos para facilitar os cálculos
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    const serviceDurationMinutes = selectedServices.reduce((total, servico) => total + (servico.duracaoMinutos || 0), 0);
    
    // Intervalo de 30 minutos entre horários
    const intervalMinutes = 30;
    
    // Gera horários disponíveis considerando a duração do serviço
    for (let timeMinutes = startTimeMinutes; timeMinutes + serviceDurationMinutes <= endTimeMinutes; timeMinutes += intervalMinutes) {
      const hour = Math.floor(timeMinutes / 60);
      const minute = timeMinutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }

    return times;
  }, [horarios, selectedDate, selectedServices]);

  const disabledDays = ({ date }: { date: Date }): boolean => {
    const today = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(today.getDate() + 30);

    today.setHours(0, 0, 0, 0);

    // Se a barbearia funciona em um dia da semana específico, a função retorna `false` (não desabilitado).
    // Se não funciona, retorna `true` (desabilitado).
    const isClosedOnThisDay = !diasDeFuncionamento.includes(date.getDay());

    return date < today || date > futureLimit || isClosedOnThisDay;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    if (!selectedServices.length) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos um serviço",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um horário",
        variant: "destructive",
      });
      return;
    }

    // Valida se o horário selecionado está na lista de horários disponíveis
    if (!availableTimes.includes(selectedTime)) {
      toast({
        title: "Erro",
        description: "Horário não disponível. Por favor, selecione outro horário.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataHora = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dataHora.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Remove a conversão de fuso horário que estava causando o problema
      // O backend deve receber a data/hora exatamente como o usuário selecionou
      if (dataHora <= new Date()) {
        toast({
          title: "Erro",
          description: "A data e hora devem ser futuras",
          variant: "destructive",
        });
        return;
      }

      // Formata a data no fuso horário local para evitar conversões
      const dataHoraLocal = new Date(
        dataHora.getFullYear(),
        dataHora.getMonth(),
        dataHora.getDate(),
        dataHora.getHours(),
        dataHora.getMinutes(),
        0,
        0
      );

      const year = dataHoraLocal.getFullYear();
      const month = String(dataHoraLocal.getMonth() + 1).padStart(2, '0');
      const day = String(dataHoraLocal.getDate()).padStart(2, '0');
      const hour = String(dataHoraLocal.getHours()).padStart(2, '0');
      const minute = String(dataHoraLocal.getMinutes()).padStart(2, '0');
      const second = String(dataHoraLocal.getSeconds()).padStart(2, '0');
      
      const dataHoraFormatada = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

      const agendamentoData = {
        clienteId: user.id,
        estabelecimentoId: Number(id),
        servicos: selectedServices.map(servico => servico.id),
        dataHora: dataHoraFormatada
      };

      await agendamentoService.criarAgendamento(agendamentoData);

      toast({
        title: "Sucesso",
        description: "Agendamento realizado com sucesso!",
        variant: "default",
      });
      navigate('/client/appointments');
    } catch (error: any) {
      console.error('Erro ao realizar agendamento:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || 'Erro ao realizar agendamento',
        variant: "destructive",
      });
    }
  };

  // Limpa o horário selecionado quando a data ou serviço muda
  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedServices]);

  // 2. AGORA, com todos os hooks já chamados, podemos fazer a renderização condicional.
  if (authLoading || isLoading || isLoadingHorarios) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login Necessário</AlertDialogTitle>
              <AlertDialogDescription>
                Você precisa estar logado para agendar um horário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => navigate(-1)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate('/login', { state: { from: { pathname: `/agendamento/${id}` } } })}>
                Fazer Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (error || !barbershop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20 text-center">
            <h1 className="text-2xl font-bold text-red-600">Erro ao carregar detalhes da barbearia</h1>
            <p className="mt-2 text-gray-600">Por favor, tente novamente mais tarde.</p>
            <Button onClick={() => navigate('/barbershops')} className="mt-4">Voltar</Button>
        </div>
      </div>
    );
  }

  // 3. Renderização de sucesso.
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-20">
        <Button onClick={() => navigate(`/barbershops/${id}`)} variant="outline" className="mb-6">
          ← Voltar
        </Button>
        <AppointmentContent 
          barbershop={barbershop}
          availableTimes={availableTimes}
          handleSubmit={handleSubmit}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          disabledDays={disabledDays}
        />
      </div>
    </div>
  );
};

export default Appointment; 