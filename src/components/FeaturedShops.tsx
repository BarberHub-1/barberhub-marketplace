import { Star, MapPin, Clock, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceId, getServiceLabel } from '@/constants/services';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { estabelecimentoService } from '../services/estabelecimento.service';
import { Estabelecimento } from '../types';

interface FeaturedShop {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  services: ServiceId[];
  priceRange: [number, number];
  image: string;
}

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
  // Adicione outros tipos conforme necessário
};

const FeaturedShops = () => {
  const { data: barbershops, isLoading, error } = useQuery<Estabelecimento[]>({
    queryKey: ['barbershops'],
    queryFn: estabelecimentoService.getAprovados,
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  // Ordena por nota média decrescente e pega as 3 melhores
  const topShops = (barbershops || [])
    .filter(shop => shop.notaMedia !== undefined && shop.notaMedia !== null && Number(shop.notaMedia) > 0)
    .sort((a, b) => (Number(b.notaMedia) || 0) - (Number(a.notaMedia) || 0))
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-barber-900 mb-4">Barbearias em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça algumas das melhores barbearias parceiras do BarberHub, 
              selecionadas com base na qualidade dos serviços e satisfação dos clientes.
            </p>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-barber-900"></div>
            <p className="mt-2 text-gray-600">Carregando barbearias em destaque...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-barber-900 mb-4">Barbearias em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça algumas das melhores barbearias parceiras do BarberHub, 
              selecionadas com base na qualidade dos serviços e satisfação dos clientes.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500">Erro ao carregar barbearias em destaque. Tente novamente mais tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-barber-900 mb-4">Barbearias em Destaque</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça algumas das melhores barbearias parceiras do BarberHub, 
            selecionadas com base na qualidade dos serviços e satisfação dos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topShops.length > 0 ? (
            topShops.map((shop) => {
              const minPrice = shop.servicos.length > 0 ? Math.min(...shop.servicos.map(s => {
                const preco = typeof s === 'object' ? s.preco : parseFloat(String(s).match(/preco=([^,]+)/)?.[1] || '0');
                return isNaN(preco) ? 0 : preco;
              })) : 0;
              const maxPrice = shop.servicos.length > 0 ? Math.max(...shop.servicos.map(s => {
                const preco = typeof s === 'object' ? s.preco : parseFloat(String(s).match(/preco=([^,]+)/)?.[1] || '0');
                return isNaN(preco) ? 0 : preco;
              })) : 0;
              return (
                <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={shop.foto || 'https://placehold.co/300x200/e2e8f0/1e293b?text=Barbearia'}
                      alt={shop.nomeEstabelecimento}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/300x200/e2e8f0/1e293b?text=Barbearia';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{shop.notaMedia ? Number(shop.notaMedia).toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-barber-900 mb-2">{shop.nomeEstabelecimento}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{[shop.rua, shop.bairro, shop.cidade].filter(Boolean).join(', ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
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
                                className="bg-barber-100 text-barber-800 text-xs px-2 py-1 rounded-full"
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {shop.quantidadeAvaliacoes || 0} {((shop.quantidadeAvaliacoes || 0) === 1 ? 'avaliação' : 'avaliações')}
                      </span>
                      <Link 
                        to={`/barbershops/${shop.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-barber-900 text-white rounded-md hover:bg-barber-800 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhuma barbearia com avaliações encontrada.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/barbershops"
            className="inline-flex items-center justify-center px-6 py-3 bg-barber-900 text-white rounded-md hover:bg-barber-800 transition-colors"
          >
            Ver Todas as Barbearias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShops;
