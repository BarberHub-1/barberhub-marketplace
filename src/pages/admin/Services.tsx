import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminServices = () => {
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Serviços</h1>
          <button 
            onClick={() => navigate('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Buscar serviço..."
                  className="border rounded px-4 py-2 w-64"
                />
                <select className="border rounded px-4 py-2">
                  <option value="">Todas as categorias</option>
                  <option value="CABELO">Cabelo</option>
                  <option value="BARBA">Barba</option>
                  <option value="ESTETICA">Estética</option>
                </select>
              </div>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                Novo Serviço
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Duração (min)</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Removido serviço mockado. Adicione aqui o mapeamento real dos serviços vindos da API */}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-gray-600">
                Mostrando 1-2 de 2 resultados
              </div>
              <div className="flex gap-2">
                <button className="border rounded px-3 py-1 disabled:opacity-50" disabled>
                  Anterior
                </button>
                <button className="border rounded px-3 py-1 disabled:opacity-50" disabled>
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices; 