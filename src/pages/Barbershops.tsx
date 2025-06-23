import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { estabelecimentoService } from '../services/estabelecimento.service';
import { FaSearch, FaMapMarkerAlt, FaStar, FaFilter } from 'react-icons/fa';
import { Spinner } from '../components/Spinner';
import { toast } from 'react-toastify';
import Navigation from '../components/Navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Estabelecimento } from '../types';

// Mapeamento para nomes amigáveis dos tipos de serviço
const labelServico: Record<string, string> = {
  CORTE_DE_CABELO: 'Corte de Cabelo',
  BARBA: 'Barba',
  HIDRATACAO: 'Hidratação',
  LUZES: 'Luzes',
  SOBRANCELHA: 'Sobrancelha',
  PIGMENTACAO: 'Pigmentação',
  TRATAMENTO_CAPILAR: 'Tratamento Capilar',
  COLORACAO: 'Coloração',
  SELAGEM: 'Selagem',
  ESCOVA: 'Escova',
};

export default function Barbershops() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);

  const { data: barbershops, isLoading, error } = useQuery<Estabelecimento[]>({
    queryKey: ['barbershops'],
    queryFn: async () => {
      try {
        const response = await estabelecimentoService.getAprovados();
        console.log('Dados recebidos do backend:', response);
        
        // Converter os serviços de string para objeto
        const barbershopsProcessados = response.map(shop => ({
          ...shop,
          servicos: shop.servicos.map(servicoStr => {
            // Se já for um objeto, retorna como está
            if (typeof servicoStr === 'object' && servicoStr !== null) {
              return servicoStr;
            }
            
            // Garantir que estamos lidando com uma string
            const servicoString = typeof servicoStr === 'string' ? servicoStr : JSON.stringify(servicoStr);
            
            const servicoObj = {
              id: parseInt(servicoString.match(/id=(\d+)/)?.[1] || '0'),
              tipo: servicoString.match(/tipo=([^,]+)/)?.[1] || '',
              descricao: servicoString.match(/descricao=([^,]+)/)?.[1] || '',
              preco: parseFloat(servicoString.match(/preco=([^,]+)/)?.[1] || '0'),
              duracaoMinutos: parseInt(servicoString.match(/duracaoMinutos=(\d+)/)?.[1] || '0')
            };
            return servicoObj;
          })
        }));
        
        console.log('Barbearias processadas:', barbershopsProcessados);
        return barbershopsProcessados;
      } catch (error) {
        console.error('Erro ao buscar barbearias:', error);
        throw error;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  // Extrair cidades únicas das barbearias
  const uniqueCities = React.useMemo(() => {
    if (!barbershops) return [];
    return Array.from(new Set(barbershops.map(shop => shop.cidade).filter(Boolean))).sort();
  }, [barbershops]);

  useEffect(() => {
    if (user?.tipo === 'ESTABELECIMENTO') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('Estado atual das barbearias:', barbershops);
    if (barbershops && barbershops.length > 0) {
      console.log('Primeira barbearia:', barbershops[0]);
      console.log('Serviços da primeira barbearia:', barbershops[0].servicos);
    }
  }, [barbershops]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    console.error('Erro ao carregar barbearias:', error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Erro ao carregar as barbearias. Tente novamente mais tarde.</p>
      </div>
    );
  }

  const filteredBarbershops = barbershops?.filter(shop => {
    if (!shop) return false;

    // Se não houver filtros ativos, retorna true
    if (!searchTerm && !selectedCity && !selectedService && !selectedLocation && !selectedRating && priceRange[1] === 200) {
      return true;
    }

    // Verifica cada filtro apenas se estiver ativo
    const matchesSearch = !searchTerm || 
      (shop.nomeEstabelecimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       `${shop.rua}, ${shop.numero}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
       shop.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       shop.cidade?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = !selectedCity || shop.cidade === selectedCity;
    
    const matchesService = !selectedService || 
      (shop.servicos && shop.servicos.some(service => {
        if (typeof service === 'object' && service !== null) {
          return service.tipo === selectedService;
        }
        // Se for string, tenta extrair o tipo
        const servicoString = typeof service === 'string' ? service : JSON.stringify(service);
        const tipo = servicoString.match(/tipo=([^,]+)/)?.[1];
        return tipo === selectedService;
      }));
    
    const matchesLocation = !selectedLocation || shop.cidade === selectedLocation;
    
    const matchesRating = !selectedRating || (
      shop.notaMedia !== undefined && shop.notaMedia !== null && Number(shop.notaMedia) >= parseInt(selectedRating)
    );

    // Novo filtro: serviço mais caro
    const maxServicePrice = shop.servicos && shop.servicos.length > 0
      ? Math.max(...shop.servicos.map(s => {
          const preco = (s as any).preco || 0;
          return isNaN(preco) ? 0 : preco;
        }))
      : 0;
    const matchesPrice = maxServicePrice <= priceRange[1];

    // Retorna true se todos os filtros ativos corresponderem
    return matchesSearch && matchesCity && matchesService && matchesLocation && matchesRating && matchesPrice;
  });

  console.log('Barbearias filtradas:', filteredBarbershops);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Encontre sua Barbearia</h1>
          
          {/* Barra de Pesquisa */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou endereço..."
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filtros */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="p-2 border rounded-lg"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Todos os Serviços</option>
              <option value="CORTE_DE_CABELO">Corte de Cabelo</option>
              <option value="BARBA">Barba</option>
              <option value="HIDRATACAO">Hidratação</option>
              <option value="LUZES">Luzes</option>
              <option value="SOBRANCELHA">Sobrancelha</option>
            </select>

            <select
              className="p-2 border rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Todas as Localizações</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Filtro de Estrelas em Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-2 w-full border rounded-lg flex items-center justify-between bg-white text-yellow-500 border-gray-300 hover:bg-yellow-50 transition-colors"
                >
                  <span className="flex items-center">
                    <FaStar className="mr-2 text-yellow-400" />
                    {selectedRating ? `${selectedRating}+` : 'Todas as Avaliações'}
                  </span>
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSelectedRating('')} className={!selectedRating ? 'bg-yellow-100 font-semibold' : ''}>
                  Todas as Avaliações
                </DropdownMenuItem>
                {[4, 3, 2, 1].map((star) => (
                  <DropdownMenuItem
                    key={star}
                    onClick={() => setSelectedRating(String(star))}
                    className={selectedRating === String(star) ? 'bg-yellow-100 font-semibold' : ''}
                  >
                    <div className="flex items-center">
                      {[...Array(star)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      {[...Array(5 - star)].map((_, i) => (
                        <FaStar key={i} className="text-gray-300" />
                      ))}
                      <span className="ml-2 text-sm">{star} Estrela{star > 1 ? 's' : ''} ou mais</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Filtro de Preço */}
            <div className="p-2 border rounded-lg bg-white">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                Preço máximo: R$ {priceRange[1]}
              </label>
              <input
                id="priceRange"
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange[1] / 200) * 100}%, #e5e7eb ${(priceRange[1] / 200) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </div>
        
        {isLoading && <p>Carregando barbearias...</p>}
        {error && <p>Erro ao carregar barbearias.</p>}
        {!isLoading && !error && filteredBarbershops && filteredBarbershops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBarbershops.map((shop) => (
              <div 
                key={shop.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <img 
                    src={shop.foto || 'https://via.placeholder.com/400x250'} 
                    alt={shop.nomeEstabelecimento}
                    className="w-full h-48 object-cover" 
                  />
                  {/* Selo de verificação com nota */}
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {shop.notaMedia ? Number(shop.notaMedia).toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{shop.nomeEstabelecimento}</h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <p>{shop.rua}, {shop.numero} - {shop.bairro}</p>
                  </div>
                  <div className="flex items-center text-yellow-500 mb-4">
                    {shop.notaMedia ? (
                      <>
                        {[...Array(Math.floor(shop.notaMedia))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                        {[...Array(5 - Math.floor(shop.notaMedia))].map((_, i) => (
                          <FaStar key={i} className="text-gray-300" />
                        ))}
                        <span className="text-gray-600 ml-2 text-sm">
                          {shop.notaMedia.toFixed(1)} ({shop.quantidadeAvaliacoes} avaliação{shop.quantidadeAvaliacoes === 1 ? '' : 'es'})
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">Sem avaliações</span>
                    )}
                  </div>
                  
                  {/* Seção de Serviços */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {shop.servicos && shop.servicos.length > 0 ? (
                      <>
                        {shop.servicos.slice(0, 3).map((service, idx) => {
                          let nomeServico = '';
                          if (typeof service === 'string') {
                            // Se for string e parece um objeto serializado, tenta extrair o tipo
                            const tipoMatch = service.match(/tipo=([A-Z_]+)/);
                            const tipo = tipoMatch ? tipoMatch[1] : service;
                            nomeServico = labelServico[tipo] || tipo;
                          } else if (typeof service === 'object' && service !== null) {
                            nomeServico = labelServico[service.tipo] || service.descricao || service.tipo || '';
                          }
                          return nomeServico ? (
                            <span
                              key={`${shop.id}-service-${idx}-${nomeServico}`}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {nomeServico}
                            </span>
                          ) : null;
                        })}
                        {shop.servicos.length > 3 && (
                          <span
                            key={`${shop.id}-more-services-${shop.servicos.length}`}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            +{shop.servicos.length - 3} serviços
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs">Nenhum serviço cadastrado</span>
                    )}
                  </div>
                  
                  {/* Botão Ver Detalhes */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/barbershops/${shop.id}`)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Nenhuma barbearia encontrada</h2>
            <p className="mt-2 text-gray-500">Tente ajustar seus filtros para encontrar o que procura.</p>
          </div>
        )}
      </div>
    </div>
  );
} 