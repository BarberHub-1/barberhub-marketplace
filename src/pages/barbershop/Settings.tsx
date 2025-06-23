import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BarbershopSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('geral');

  // if (!user || user.role !== 'BARBERSHOP') {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
  //           <p className="mt-2 text-gray-600">Você não tem permissão para acessar esta área.</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <button 
            onClick={() => navigate('/barbershop')}
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
              <button
                onClick={() => setActiveTab('horarios')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'horarios'
                    ? 'border-b-2 border-gray-600 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Horários
              </button>
              <button
                onClick={() => setActiveTab('servicos')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'servicos'
                    ? 'border-b-2 border-gray-600 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setActiveTab('pagamentos')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'pagamentos'
                    ? 'border-b-2 border-gray-600 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pagamentos
              </button>
              <button
                onClick={() => setActiveTab('notificacoes')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'notificacoes'
                    ? 'border-b-2 border-gray-600 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notificações
              </button>
            </nav>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="p-6">
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Informações do Estabelecimento</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome do Estabelecimento
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        defaultValue="Barbearia Exemplo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        rows={3}
                        defaultValue="Barbearia especializada em cortes modernos e tradicionais"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Endereço
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        defaultValue="Rua Exemplo, 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        defaultValue="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'horarios' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Horários de Funcionamento</h3>
                  <div className="mt-4 space-y-4">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                      <div key={dia} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">
                            {dia}
                          </label>
                          <div className="mt-1 flex space-x-2">
                            <input
                              type="time"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                              defaultValue="09:00"
                            />
                            <span className="flex items-center text-gray-500">até</span>
                            <input
                              type="time"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                              defaultValue="18:00"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            defaultChecked={dia !== 'Domingo'}
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Aberto
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'servicos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Serviços Oferecidos</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-end">
                      <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                        Adicionar Serviço
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Corte de Cabelo</h4>
                          <p className="text-sm text-gray-500">Duração: 30 minutos</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-900 font-medium">R$ 50,00</span>
                          <button className="text-gray-600 hover:text-gray-900">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Remover
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Barba</h4>
                          <p className="text-sm text-gray-500">Duração: 20 minutos</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-900 font-medium">R$ 30,00</span>
                          <button className="text-gray-600 hover:text-gray-900">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pagamentos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Configurações de Pagamento</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Métodos de Pagamento Aceitos
                      </label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            defaultChecked
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Dinheiro
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            defaultChecked
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Cartão de Crédito
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            defaultChecked
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Cartão de Débito
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            defaultChecked
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            PIX
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dados Bancários
                      </label>
                      <div className="mt-2 space-y-4">
                        <input
                          type="text"
                          placeholder="Banco"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        />
                        <input
                          type="text"
                          placeholder="Agência"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        />
                        <input
                          type="text"
                          placeholder="Conta"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Configurações de Notificações</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Notificações de Agendamento
                        </label>
                        <p className="text-sm text-gray-500">
                          Receber notificações quando houver novos agendamentos
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Notificações de Avaliação
                        </label>
                        <p className="text-sm text-gray-500">
                          Receber notificações quando houver novas avaliações
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Notificações de Cancelamento
                        </label>
                        <p className="text-sm text-gray-500">
                          Receber notificações quando houver cancelamentos
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                      </button>
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

export default BarbershopSettings; 