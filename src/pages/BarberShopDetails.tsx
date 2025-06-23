import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { estabelecimentoService } from '../services/estabelecimento.service';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '../components/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  nomeProprietario: string;
  rua?: string;
  numero?: string | number;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone: string;
  foto?: string;
  status: string;
  descricao?: string;
  horario: {
    id: number;
    diaSemana: string;
    horarioAbertura: string;
    horarioFechamento: string;
  }[];
  servicos: Servico[];
}

const BarberShopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const { data: barbershop, isLoading, error } = useQuery<BarberShop>({
    queryKey: ['barbershop', id],
    queryFn: async () => {
      try {
        const response = await estabelecimentoService.getById(Number(id));
        console.log('Resposta da API:', response);
        
        // Verificar se os serviços estão vindo como string
        const processedResponse = {
          ...response,
          servicos: response.servicos.map((servico, index) => {
            console.log('Serviço original:', servico);
            
            // Se o serviço for uma string, tentar converter para objeto
            if (typeof servico === 'string') {
              const servicoStr = servico as string;
              try {
                const servicoObj = {
                  id: index + 1,
                  tipo: servicoStr.match(/tipo=([^,]+)/)?.[1] || '',
                  descricao: servicoStr.match(/descricao=([^,]+)/)?.[1] || '',
                  preco: parseFloat(servicoStr.match(/preco=([^,]+)/)?.[1] || '0'),
                  duracaoMinutos: parseInt(servicoStr.match(/duracaoMinutos=(\d+)/)?.[1] || '0')
                };
                console.log('Serviço convertido:', servicoObj);
                return servicoObj;
              } catch (error) {
                console.error('Erro ao converter serviço:', error);
                return {
                  id: index + 1,
                  tipo: '',
                  descricao: servicoStr,
                  preco: 0,
                  duracaoMinutos: 0
                };
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
          })
        };
        
        console.log('Resposta processada:', processedResponse);
        return processedResponse;
      } catch (error) {
        console.error('Erro ao buscar detalhes da barbearia:', error);
        throw error;
      }
    },
    enabled: !!id,
  });

  // Adicionar log para verificar o estado dos serviços
  React.useEffect(() => {
    if (barbershop) {
      console.log('Estado atual da barbearia:', barbershop);
      console.log('Serviços da barbearia:', barbershop.servicos);
    }
  }, [barbershop]);

  const handleAgendamentoClick = () => {
    console.log('BarberShopDetails - navegando para agendamento');
    navigate(`/agendamento/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !barbershop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Erro ao carregar detalhes da barbearia</h1>
            <p className="mt-2 text-gray-600">Por favor, tente novamente mais tarde.</p>
            <Button 
              onClick={() => navigate('/barbershops')}
              className="mt-4 bg-gray-600 hover:bg-gray-700"
            >
              Voltar para Barbearias
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-20">
        <Button 
          onClick={() => navigate('/barbershops')}
          variant="outline"
          className="mb-6"
        >
          ← Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações Principais */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="relative h-64 md:h-96">
                <img
                  src={barbershop.foto || 'https://placehold.co/800x400/e2e8f0/1e293b?text=Barbearia'}
                  alt={barbershop.nomeEstabelecimento}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {barbershop.status === 'APROVADO' && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Verificado
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{barbershop.nomeEstabelecimento}</h1>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{[
                      barbershop.rua,
                      barbershop.numero,
                      barbershop.bairro,
                      barbershop.cidade,
                      barbershop.estado,
                      barbershop.cep
                    ].filter(Boolean).join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2" />
                    <span>{barbershop.telefone}</span>
                  </div>

                  {barbershop.descricao && (
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sobre</h2>
                      <p className="text-gray-600">{barbershop.descricao}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Horários de Funcionamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaClock className="text-blue-600" />
                  Horários de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbershop.horario.map((horario) => (
                    <div key={horario.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{horario.diaSemana}</span>
                      <span className="text-gray-600">
                        {horario.horarioAbertura} - {horario.horarioFechamento}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Serviços */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {barbershop.servicos.map((servico, index) => (
                    <div key={`servico-${servico.id}-${index}`} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{servico.descricao || 'Serviço sem descrição'}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Duração: {servico.duracaoMinutos || 0} minutos
                          </p>
                        </div>
                        <span className="font-bold text-blue-600">
                          R$ {typeof servico.preco === 'number' ? servico.preco.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botão de Agendamento */}
            {!isAuthenticated ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <FaCalendarAlt className="mx-auto text-orange-500 text-2xl mb-2" />
                    <h3 className="font-semibold text-orange-800 mb-2">Login Necessário</h3>
                    <p className="text-orange-700 text-sm mb-4">
                      Para realizar um agendamento, você precisa estar logado em sua conta.
                    </p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => navigate("/login", { 
                        state: { 
                          from: {
                            pathname: `/barbershops/${id}`
                          }
                        } 
                      })}
                    >
                      Fazer Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : user?.tipo !== "CLIENTE" ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <FaCalendarAlt className="mx-auto text-red-500 text-2xl mb-2" />
                    <h3 className="font-semibold text-red-800 mb-2">Acesso Restrito</h3>
                    <p className="text-red-700 text-sm">
                      Apenas clientes podem realizar agendamentos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-6 text-lg"
                onClick={handleAgendamentoClick}
              >
                <FaCalendarAlt className="mr-2" />
                Agendar Horário
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberShopDetails; 