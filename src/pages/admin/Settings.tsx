import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('geral');

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
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('geral')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'geral'
                    ? 'border-b-2 border-gray-600 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Geral
              </button>
            </nav>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="p-6">
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Configurações Gerais</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome da Plataforma
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        defaultValue="BarberHub"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        rows={3}
                        defaultValue="Plataforma de agendamento para barbearias e salões de beleza"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fuso Horário
                      </label>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
                        <option>America/Sao_Paulo</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 