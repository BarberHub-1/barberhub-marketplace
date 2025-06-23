import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { estabelecimentoService } from '../../services/estabelecimento.service';
import { Estabelecimento } from '../../types';
import { useToast } from '../../hooks/use-toast';

const AdminBarbershops = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadEstabelecimentos();
  }, []);

  const loadEstabelecimentos = async () => {
    try {
      setLoading(true);
      const data = await estabelecimentoService.getAll();
      setEstabelecimentos(data);
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os estabelecimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await estabelecimentoService.aprovar(id);
      toast({
        title: "Sucesso",
        description: "Estabelecimento aprovado com sucesso!",
      });
      loadEstabelecimentos(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao aprovar estabelecimento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o estabelecimento.",
        variant: "destructive",
      });
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      await estabelecimentoService.rejeitar(id);
      toast({
        title: "Sucesso",
        description: "Estabelecimento rejeitado com sucesso!",
      });
      loadEstabelecimentos(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao rejeitar estabelecimento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o estabelecimento.",
        variant: "destructive",
      });
    }
  };

  const handleDesativar = async (id: number) => {
    try {
      console.log('Tentando desativar estabelecimento com ID:', id);
      await estabelecimentoService.desativar(id);
      console.log('Estabelecimento desativado com sucesso');
      toast({
        title: "Sucesso",
        description: "Estabelecimento desativado com sucesso!",
      });
      loadEstabelecimentos(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao desativar estabelecimento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar o estabelecimento.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJEITADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return 'Aprovado';
      case 'PENDENTE':
        return 'Pendente';
      case 'REJEITADO':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const filteredEstabelecimentos = estabelecimentos.filter(estabelecimento => {
    const matchesSearch = estabelecimento.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estabelecimento.nomeProprietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estabelecimento.cnpj.includes(searchTerm);
    const matchesStatus = !statusFilter || estabelecimento.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Barbearias</h1>
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
                  placeholder="Buscar estabelecimento..."
                  className="border rounded px-4 py-2 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="border rounded px-4 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="REJEITADO">Rejeitado</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Carregando estabelecimentos...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Endereço</th>
                      <th className="text-left py-3 px-4">Proprietário</th>
                      <th className="text-left py-3 px-4">CNPJ</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstabelecimentos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhum estabelecimento encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredEstabelecimentos.map((estabelecimento) => (
                        <tr key={estabelecimento.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{estabelecimento.nomeEstabelecimento}</td>
                          <td className="py-3 px-4">
                            {estabelecimento.rua}, {estabelecimento.numero} - {estabelecimento.bairro}, {estabelecimento.cidade}/{estabelecimento.estado}
                          </td>
                          <td className="py-3 px-4">{estabelecimento.nomeProprietario}</td>
                          <td className="py-3 px-4">{estabelecimento.cnpj}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(estabelecimento.status)}`}>
                              {getStatusText(estabelecimento.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {estabelecimento.status === 'PENDENTE' && (
                                <>
                                  <button className="text-green-600 hover:text-green-800" onClick={() => handleAprovar(estabelecimento.id)}>Aprovar</button>
                                  <button className="text-red-600 hover:text-red-800" onClick={() => handleRejeitar(estabelecimento.id)}>Rejeitar</button>
                                </>
                              )}
                              {estabelecimento.status === 'APROVADO' && (
                                <button className="text-red-600 hover:text-red-800" onClick={() => handleDesativar(estabelecimento.id)}>Desativar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-gray-600">
                    Mostrando {filteredEstabelecimentos.length} de {estabelecimentos.length} resultados
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

export default AdminBarbershops; 