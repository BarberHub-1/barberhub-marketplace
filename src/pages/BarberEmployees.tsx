import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Scissors, Plus, Pencil, Trash2, User, Mail, Phone, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Profissional {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  foto?: string;
  estabelecimentoId: number;
  servicosIds?: number[];
  servicos?: Servico[];
}

interface Servico {
  id: number;
  tipo: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
}

const BarberEmployees = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Profissional | null>(null);
  const [newEmployee, setNewEmployee] = useState<Partial<Profissional>>({});
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [showServicosDialog, setShowServicosDialog] = useState(false);

  const { data: profissionais, isLoading, refetch } = useQuery<Profissional[]>({
    queryKey: ['profissionais', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log('Buscando profissionais para o estabelecimento:', user.id);
        const response = await api.get<Profissional[]>(`/api/profissionais/estabelecimento/${user.id}`);
        console.log('Resposta da API:', response.data);

        // Buscar serviços para cada profissional e garantir o estabelecimentoId
        const profissionaisComServicos = await Promise.all(
          response.data.map(async (profissional) => {
            try {
              const servicosResponse = await api.get<Servico[]>(`/api/servicos/profissional/${profissional.id}`);
              return {
                ...profissional,
                estabelecimentoId: user.id, // Garantindo que o estabelecimentoId seja o ID do usuário atual
                servicos: servicosResponse.data,
                servicosIds: servicosResponse.data.map(s => s.id) // Mapeando os IDs dos serviços
              };
            } catch (error) {
              console.error('Erro ao buscar serviços do profissional:', error);
              return {
                ...profissional,
                estabelecimentoId: user.id, // Garantindo que o estabelecimentoId seja o ID do usuário atual
                servicos: [],
                servicosIds: []
              };
            }
          })
        );

        return profissionaisComServicos;
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const { data: servicos } = useQuery<Servico[]>({
    queryKey: ['servicos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log('Buscando serviços da barbearia:', user.id);
        const response = await api.get<Servico[]>(`/api/servicos/barbearia/${user.id}`);
        console.log('Serviços encontrados:', response.data);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const handleAddEmployee = async () => {
    try {
      if (!newEmployee.nome || !newEmployee.email || !newEmployee.telefone) {
        toast({
          title: "Erro",
          description: "Todos os campos são obrigatórios",
          variant: "destructive",
        });
        return;
      }

      // Formatar o telefone para o padrão (99) 99999-9999
      const telefoneFormatado = newEmployee.telefone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      const profissionalData = {
        ...newEmployee,
        telefone: telefoneFormatado,
        estabelecimentoId: user?.id,
        servicosIds: [] // Lista vazia de serviços por enquanto
      };

      console.log('Adicionando profissional:', profissionalData);

      const response = await api.post<Profissional>('/api/profissionais', profissionalData);
      
      if (response.data) {
        setNewEmployee({});
        setShowAddEmployee(false);
        refetch();
        toast({
          title: "Sucesso",
          description: "Profissional adicionado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error('Erro ao adicionar profissional:', error.response?.data || error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível adicionar o profissional.",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async () => {
    if (!editingEmployee) return;

    try {
      // Formatar o telefone para o padrão (99) 99999-9999
      const telefoneFormatado = editingEmployee.telefone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      const profissionalData = {
        ...editingEmployee,
        telefone: telefoneFormatado,
        estabelecimentoId: user?.id,
        servicosIds: editingEmployee.servicosIds || []
      };

      console.log('Atualizando profissional:', profissionalData);
      
      const response = await api.put<Profissional>(`/api/profissionais/${editingEmployee.id}`, profissionalData);
      
      if (response.data) {
        setEditingEmployee(null);
        setShowAddEmployee(false);
        refetch();
        toast({
          title: "Sucesso",
          description: "Profissional atualizado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar profissional:', error.response?.data || error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar o profissional.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await api.delete(`/api/profissionais/${id}`);
      refetch();
      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível remover o profissional.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (profissional: Profissional) => {
    setEditingEmployee(profissional);
    setShowAddEmployee(true);
  };

  const handleServicosChange = async (servicoId: number, checked: boolean) => {
    if (!selectedProfissional || !user?.id) return;

    try {
      // Manter os serviços existentes ou usar array vazio se não houver
      const servicosAtuais = selectedProfissional.servicosIds || [];
      
      const novosServicosIds = checked
        ? [...servicosAtuais, servicoId]
        : servicosAtuais.filter(id => id !== servicoId);

      console.log('Atualizando serviços do profissional:', {
        profissionalId: selectedProfissional.id,
        servicosAtuais,
        novosServicosIds
      });

      // Formatar o telefone para o padrão (99) 99999-9999
      const telefoneFormatado = selectedProfissional.telefone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

      const response = await api.put<Profissional>(`/api/profissionais/${selectedProfissional.id}`, {
        id: selectedProfissional.id,
        nome: selectedProfissional.nome,
        email: selectedProfissional.email,
        telefone: telefoneFormatado,
        estabelecimentoId: user.id, // Usando o ID do usuário atual
        servicosIds: novosServicosIds
      });

      console.log('Resposta da API:', response.data);

      if (response.data) {
        // Atualizar o profissional selecionado com os novos serviços
        const profissionalAtualizado = {
          ...response.data,
          estabelecimentoId: user.id, // Garantindo que o estabelecimentoId seja o ID do usuário atual
          servicosIds: novosServicosIds
        };
        setSelectedProfissional(profissionalAtualizado);
        refetch();
        toast({
          title: "Sucesso",
          description: "Serviços atualizados com sucesso!",
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar serviços:', error.response?.data || error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar os serviços.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-barber-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <p>Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Scissors size={28} className="text-barber-900" />
              <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
            </div>
            <h1 className="text-3xl font-bold text-barber-900">Profissionais</h1>
            <p className="mt-2 text-barber-600">
              Gerencie os profissionais da sua barbearia
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profissionais</CardTitle>
                <CardDescription>Gerencie os profissionais da sua barbearia.</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddEmployee(true)} 
                className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
              >
                <Plus size={16} />
                Adicionar Profissional
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profissionais && profissionais.length > 0 ? (
                <div className="grid gap-4">
                  {profissionais.map((profissional) => (
                    <Card key={profissional.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-semibold">{profissional.nome}</div>
                          <div className="text-sm text-barber-600">
                            <Mail size={14} className="inline mr-1" />
                            {profissional.email}
                          </div>
                          <div className="text-sm text-barber-600">
                            <Phone size={14} className="inline mr-1" />
                            {profissional.telefone}
                          </div>
                          {profissional.servicos && profissional.servicos.length > 0 ? (
                            <div className="text-sm text-barber-600">
                              <Wrench size={14} className="inline mr-1" />
                              Serviços:
                              <ul className="ml-6 mt-1 list-disc">
                                {profissional.servicos.map(servico => (
                                  <li key={servico.id}>
                                    {servico.descricao} - R$ {servico.preco.toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="text-sm text-barber-600">
                              <Wrench size={14} className="inline mr-1" />
                              Nenhum serviço associado
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedProfissional(profissional);
                              setShowServicosDialog(true);
                            }}
                            className="text-barber-900 hover:text-barber-700"
                          >
                            <Wrench size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(profissional)}
                            className="text-barber-900 hover:text-barber-700"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteEmployee(profissional.id?.toString() || '')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-barber-600 py-4">
                  Nenhum profissional cadastrado
                </div>
              )}

              {showAddEmployee && (
                <Card className="p-4">
                  <CardTitle className="text-lg mb-4">
                    {editingEmployee ? 'Editar Profissional' : 'Adicionar Novo Profissional'}
                  </CardTitle>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editingEmployee) {
                      handleEditEmployee();
                    } else {
                      handleAddEmployee();
                    }
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input 
                          id="nome"
                          value={editingEmployee?.nome || newEmployee.nome || ''}
                          onChange={(e) => {
                            if (editingEmployee) {
                              setEditingEmployee({...editingEmployee, nome: e.target.value});
                            } else {
                              setNewEmployee({...newEmployee, nome: e.target.value});
                            }
                          }}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={editingEmployee?.email || newEmployee.email || ''}
                          onChange={(e) => {
                            if (editingEmployee) {
                              setEditingEmployee({...editingEmployee, email: e.target.value});
                            } else {
                              setNewEmployee({...newEmployee, email: e.target.value});
                            }
                          }}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input 
                          id="telefone"
                          value={editingEmployee?.telefone || newEmployee.telefone || ''}
                          onChange={(e) => {
                            if (editingEmployee) {
                              setEditingEmployee({...editingEmployee, telefone: e.target.value});
                            } else {
                              setNewEmployee({...newEmployee, telefone: e.target.value});
                            }
                          }}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          setShowAddEmployee(false);
                          setNewEmployee({});
                          setEditingEmployee(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                        disabled={
                          editingEmployee 
                            ? !editingEmployee.nome || !editingEmployee.email || !editingEmployee.telefone
                            : !newEmployee.nome || !newEmployee.email || !newEmployee.telefone
                        }
                      >
                        {editingEmployee ? (
                          <>
                            <Pencil size={16} />
                            Atualizar Profissional
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Adicionar Profissional
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showServicosDialog} onOpenChange={setShowServicosDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Serviços do Profissional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {servicos?.map((servico) => (
              <div key={servico.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`servico-${servico.id}`}
                  checked={selectedProfissional?.servicosIds?.includes(servico.id)}
                  onCheckedChange={(checked) => handleServicosChange(servico.id, checked as boolean)}
                />
                <label
                  htmlFor={`servico-${servico.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {servico.descricao} - R$ {servico.preco.toFixed(2)}
                </label>
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowServicosDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-barber-900 hover:bg-barber-800"
                onClick={() => {
                  refetch();
                  setShowServicosDialog(false);
                  toast({
                    title: "Sucesso",
                    description: "Serviços atualizados com sucesso!",
                  });
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarberEmployees; 