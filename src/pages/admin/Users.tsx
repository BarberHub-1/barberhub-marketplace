import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Cliente } from '../../types';
import { useToast } from '../../hooks/use-toast';
import api from '../../lib/axios';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Cliente[]>('/api/clientes');
      const data = response.data.map(cliente => ({
        ...cliente,
        foto: cliente.foto ? `data:image/jpeg;base64,${cliente.foto}` : undefined
      }));
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    return cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <button 
            onClick={() => navigate('/admin/dashboard')}
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
                  placeholder="Buscar usuário..."
                  className="border rounded px-4 py-2 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Carregando usuários...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Telefone</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredClientes.map((cliente) => (
                        <tr key={cliente.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{cliente.nome}</td>
                          <td className="py-3 px-4">{cliente.email}</td>
                          <td className="py-3 px-4">{cliente.telefone}</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => navigate(`/admin/users/${cliente.id}/appointments`)}
                              className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded text-sm"
                            >
                              Agendamentos
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-gray-600">
                    Mostrando {filteredClientes.length} de {clientes.length} resultados
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 