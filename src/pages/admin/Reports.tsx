import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
            <p className="mt-2 text-gray-600">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <button 
            onClick={() => navigate('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Relatório de Agendamentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agendamentos</h2>
            <p className="text-gray-600 mb-4">Relatórios sobre agendamentos realizados.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Agendamentos por Período
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Taxa de Cancelamento
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Horários Mais Populares
              </button>
            </div>
          </div>

          {/* Card de Relatório de Estabelecimentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Estabelecimentos</h2>
            <p className="text-gray-600 mb-4">Relatórios sobre estabelecimentos.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Desempenho por Estabelecimento
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Serviços Mais Populares
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Crescimento Mensal
              </button>
            </div>
          </div>

          {/* Card de Relatório de Avaliações */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Avaliações</h2>
            <p className="text-gray-600 mb-4">Relatórios sobre avaliações dos estabelecimentos.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Média de Avaliações
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Análise de Sentimentos
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Tendências de Satisfação
              </button>
            </div>
          </div>

          {/* Card de Relatório de Usuários */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuários</h2>
            <p className="text-gray-600 mb-4">Relatórios sobre usuários do sistema.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Novos Usuários
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Frequência de Uso
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Retenção de Usuários
              </button>
            </div>
          </div>

          {/* Card de Relatório Financeiro */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financeiro</h2>
            <p className="text-gray-600 mb-4">Relatórios financeiros do sistema.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Receita Mensal
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Taxa de Comissão
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Projeções
              </button>
            </div>
          </div>

          {/* Card de Relatório de Sistema */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sistema</h2>
            <p className="text-gray-600 mb-4">Relatórios técnicos do sistema.</p>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Uso do Sistema
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Performance
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Logs de Erro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 