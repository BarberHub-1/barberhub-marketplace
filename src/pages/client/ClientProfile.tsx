import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Scissors, User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Navigation from '@/components/Navigation';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rua: number | null;
  numero: number | null;
  bairro: string;
  cidade: string;
  estado: string;
  foto?: string;
}

const clientProfileSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  telefone: z.string().min(10, { message: "Por favor, insira um número de telefone válido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  rua: z.string().min(1, { message: "Rua inválida" }),
  numero: z.string().min(1, { message: "Número inválido" }),
  bairro: z.string().min(2, { message: "Bairro inválido" }),
  cidade: z.string().min(2, { message: "A cidade deve ter pelo menos 2 caracteres" }),
  estado: z.string().min(2, { message: "Estado inválido" }),
});

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

interface ClienteFormData extends Omit<ClientProfileFormValues, 'rua' | 'numero'> {
  rua: number | null;
  numero: number | null;
}

const ClientProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: cliente, isLoading, error } = useQuery({
    queryKey: ['cliente', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('ID do usuário não disponível');
      }
      try {
        const response = await api.get<Cliente>(`/api/clientes/${user.id}`);
        if (!response.data) {
          throw new Error('Dados do cliente não encontrados');
        }
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ClienteFormData) => {
      if (!user?.id) {
        throw new Error('ID do usuário não disponível');
      }
      const response = await api.put(`/api/clientes/${user.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente', user?.id] });
      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive"
      });
    }
  });
  
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  useEffect(() => {
    if (cliente && Object.keys(cliente).length > 0) {
      try {
        form.reset({
          nome: cliente.nome || "",
          email: cliente.email || "",
          telefone: cliente.telefone || "",
          cpf: cliente.cpf || "",
          rua: cliente.rua?.toString() || "",
          numero: cliente.numero?.toString() || "",
          bairro: cliente.bairro || "",
          cidade: cliente.cidade || "",
          estado: cliente.estado || "",
        });
      } catch (error) {
        console.error('Erro ao preencher formulário:', error);
        toast({
          title: "Erro ao Carregar Dados",
          description: "Não foi possível carregar seus dados. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    }
  }, [cliente, form, toast]);

  function onSubmit(data: ClientProfileFormValues) {
    try {
      const formData: ClienteFormData = {
        ...data,
        rua: parseInt(data.rua) || null,
        numero: parseInt(data.numero) || null
      };
      updateMutation.mutate(formData);
    } catch (error) {
      console.error('Erro ao preparar dados do formulário:', error);
      toast({
        title: "Erro ao Enviar Dados",
        description: "Não foi possível processar seus dados. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-barber-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center text-red-600">Usuário não autenticado</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-barber-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-barber-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center text-red-600">
              Erro ao carregar perfil: {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-barber-50 pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center text-red-600">Dados do cliente não encontrados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-50">
      <Navigation />
      <div className="pt-24 pb-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-end mb-8">
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} />
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setIsEditing(false)}
                    >
                      <X size={16} />
                      Cancelar
                    </Button>
                    <Button 
                      className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={updateMutation.isPending}
                    >
                      <Save size={16} />
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-barber-900">Meu Perfil</h1>
              <p className="mt-2 text-barber-600">
                Gerencie suas informações pessoais
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Seu nome completo" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="seu@email.com" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="(11) 98765-4321" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="000.000.000-00" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Nome da rua" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Número" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Seu bairro" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Sua cidade" className="pl-10" {...field} disabled={!isEditing} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Seu estado" className="pl-10" {...field} disabled={!isEditing} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 