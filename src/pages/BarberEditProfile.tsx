import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Scissors, MapPin, User, Mail, Phone, Store, Clock, Image, Calendar, Upload, Building2, Hash, Home, Map, Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_SERVICES } from "@/constants/services";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface HorarioFuncionamentoDTO {
  id: number;
  diaSemana: string;
  horarioAbertura: string;
  horarioFechamento: string;
}

interface EstabelecimentoDTO {
  id: number;
  nomeProprietario: string;
  nomeEstabelecimento: string;
  cnpj: string;
  rua: string;
  bairro: string;
  numero: number;
  cidade: string;
  cep: string;
  telefone: string;
  email: string;
  foto?: string;
  status: string;
  horario: HorarioFuncionamentoDTO[];
  descricao?: string;
  servicos?: string[];
}

interface NewService {
  tipo?: string;
  descricao?: string;
  preco?: number;
  duracaoMinutos?: number;
}

interface Servico {
  id?: number;
  tipo: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  estabelecimentoId?: number;
}

const barberShopSchema = z.object({
  shopName: z.string().min(2, { message: "O nome da barbearia deve ter pelo menos 2 caracteres" }),
  ownerName: z.string().min(2, { message: "O nome do proprietário deve ter pelo menos 2 caracteres" }),
  cnpj: z.string().min(14, { message: "CNPJ inválido" }).max(18, { message: "CNPJ inválido" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  phone: z.string().min(10, { message: "Por favor, insira um número de telefone válido" }),
  street: z.string().min(3, { message: "Rua inválida" }),
  number: z.string().min(1, { message: "Número inválido" }),
  neighborhood: z.string().min(2, { message: "Bairro inválido" }),
  city: z.string().min(2, { message: "Cidade inválida" }),
  zipCode: z.string().min(8, { message: "CEP inválido" }).max(9, { message: "CEP inválido" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
  services: z.array(z.string()).min(1, { message: "Selecione pelo menos um serviço" }),
  horarios: z.array(z.object({
    diaSemana: z.string(),
    horarioAbertura: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "Formato inválido (HH:mm)"),
    horarioFechamento: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "Formato inválido (HH:mm)")
  }))
});

type BarberShopFormValues = z.infer<typeof barberShopSchema>;

enum TipoServico {
  CORTE_DE_CABELO = "CORTE_DE_CABELO",
  BARBA = "BARBA",
  SOBRANCELHA = "SOBRANCELHA",
  HIDRATACAO = "HIDRATACAO",
  LUZES = "LUZES"
}

const BarberEditProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shopImage, setShopImage] = useState<string | null>("https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<NewService>({});
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isErrorServices, setIsErrorServices] = useState(false);
  const [errorServices, setErrorServices] = useState(null);
  const [servicesData, setServicesData] = useState<Servico[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [editingService, setEditingService] = useState<Servico | null>(null);
  
  const form = useForm<BarberShopFormValues>({
    resolver: zodResolver(barberShopSchema),
    defaultValues: {
      shopName: "",
      ownerName: "",
      cnpj: "",
      email: "",
      phone: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      zipCode: "",
      description: "",
      services: [],
      horarios: [],
    },
  });

  const { data: estabelecimento, isLoading } = useQuery<EstabelecimentoDTO | undefined>({
    queryKey: ['estabelecimento', user?.id],
    queryFn: async () => {
      if (!user?.id) return undefined;
      const response = await api.get<EstabelecimentoDTO>(`/api/estabelecimentos/${user.id}`);
      console.log('Dados do estabelecimento:', response.data);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ['servicos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log('Buscando serviços para o estabelecimento:', user.id);
        const response = await api.get<Servico[]>(`/api/servicos/barbearia/${user.id}`);
        console.log('Resposta da API:', response.data);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    console.log('Serviços recebidos:', servicos);
    if (servicos) {
      setServicesData(servicos);
    }
  }, [servicos]);

  const updateMutation = useMutation({
    mutationFn: async (data: BarberShopFormValues) => {
      const formData = new FormData();
      
      // Adiciona os dados do estabelecimento como JSON
      const estabelecimentoData = {
        nomeEstabelecimento: data.shopName,
        nomeProprietario: data.ownerName,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.phone,
        rua: data.street,
        numero: parseInt(data.number),
        bairro: data.neighborhood,
        cidade: data.city,
        cep: data.zipCode,
        descricao: data.description,
        horario: data.horarios
      };
      
      console.log('Dados do estabelecimento:', estabelecimentoData);
      
      formData.append('estabelecimento', new Blob([JSON.stringify(estabelecimentoData)], {
        type: 'application/json'
      }));
      
      // Adiciona a foto se existir
      if (imageFile) {
        formData.append('foto', imageFile);
      }

      const response = await api.put(`/api/estabelecimentos/${user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
      navigate("/barber/profile");
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar:', error.response?.data || error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (estabelecimento) {
      console.log('Foto do estabelecimento:', estabelecimento.foto);
      console.log('Serviços do estabelecimento:', estabelecimento.servicos);
      
      form.reset({
        shopName: estabelecimento.nomeEstabelecimento || "",
        ownerName: estabelecimento.nomeProprietario || "",
        cnpj: estabelecimento.cnpj || "",
        email: estabelecimento.email || "",
        phone: estabelecimento.telefone || "",
        street: estabelecimento.rua || "",
        number: estabelecimento.numero?.toString() || "",
        neighborhood: estabelecimento.bairro || "",
        city: estabelecimento.cidade || "",
        zipCode: estabelecimento.cep || "",
        description: estabelecimento.descricao || "",
        services: estabelecimento.servicos || [],
        horarios: estabelecimento.horario?.map(h => ({
          diaSemana: h.diaSemana,
          horarioAbertura: h.horarioAbertura,
          horarioFechamento: h.horarioFechamento,
        })) || [],
      });
      if (estabelecimento.foto) {
        setShopImage(estabelecimento.foto);
      }
    }
  }, [estabelecimento, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setShopImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: BarberShopFormValues) {
    console.log('Dados do formulário:', data);
    try {
      // Formatar CNPJ e Telefone para o formato esperado pelo backend
      const formattedData = {
        ...data,
        cnpj: data.cnpj.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
        phone: data.phone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'),
        // Remover o campo services do formulário principal
        services: undefined
      };
      console.log('Dados formatados:', formattedData);
      updateMutation.mutate(formattedData);
    } catch (error) {
      console.error('Erro ao formatar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao formatar os dados. Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  }

  const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];

  const handleAddService = async () => {
    setIsLoadingServices(true);
    setIsErrorServices(false);
    try {
      // Validação do tamanho da descrição
      if (!newService.descricao || newService.descricao.length < 10 || newService.descricao.length > 500) {
        toast({
          title: "Erro",
          description: "A descrição deve ter entre 10 e 500 caracteres",
          variant: "destructive",
        });
        setIsLoadingServices(false);
        return;
      }

      // Validação dos campos obrigatórios
      if (!newService.tipo || !newService.descricao || !newService.preco || !newService.duracaoMinutos) {
        toast({
          title: "Erro",
          description: "Todos os campos são obrigatórios",
          variant: "destructive",
        });
        setIsLoadingServices(false);
        return;
      }

      const servicoData = {
        tipo: newService.tipo,
        descricao: newService.descricao,
        preco: Number(newService.preco),
        duracaoMinutos: Number(newService.duracaoMinutos),
        estabelecimentoId: user?.id
      };

      console.log('Enviando dados do serviço:', servicoData);
      
      const response = await api.post<Servico>('/api/servicos', servicoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta do servidor:', response.data);
      
      if (response.data) {
        // Atualizar a lista de serviços após adicionar
        const updatedServices = [...servicesData, response.data];
        setServicesData(updatedServices);
        
        setNewService({});
        setShowAddService(false);
        toast({
          title: "Sucesso",
          description: "Serviço adicionado com sucesso!",
        });
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error.response?.data || error);
      setIsErrorServices(true);
      setErrorServices(error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível adicionar o serviço. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      console.log('Deletando serviço:', id);
      const response = await api.delete(`/api/servicos/${id}`);
      console.log('Resposta da deleção:', response.data);
      
      if (response.status === 200 || response.status === 204) {
        setServicesData(servicesData.filter(service => service.id?.toString() !== id));
        toast({
          title: "Sucesso",
          description: "Serviço removido com sucesso!",
        });
      } else {
        throw new Error('Erro ao deletar serviço');
      }
    } catch (error: any) {
      console.error('Erro ao deletar serviço:', error.response?.data || error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível remover o serviço. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async () => {
    if (!editingService) return;
    
    setIsLoadingServices(true);
    setIsErrorServices(false);
    try {
      // Validação do tamanho da descrição
      if (!editingService.descricao || editingService.descricao.length < 10 || editingService.descricao.length > 500) {
        toast({
          title: "Erro",
          description: "A descrição deve ter entre 10 e 500 caracteres",
          variant: "destructive",
        });
        setIsLoadingServices(false);
        return;
      }

      const servicoData = {
        tipo: editingService.tipo,
        descricao: editingService.descricao,
        preco: Number(editingService.preco),
        duracaoMinutos: Number(editingService.duracaoMinutos),
        estabelecimentoId: user?.id
      };

      console.log('Atualizando serviço:', servicoData);
      
      const response = await api.put<Servico>(`/api/servicos/${editingService.id}`, servicoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta do servidor:', response.data);
      
      if (response.data) {
        // Atualizar a lista de serviços
        const updatedServices = servicesData.map(service => 
          service.id === editingService.id ? response.data : service
        );
        setServicesData(updatedServices);
        
        setEditingService(null);
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar serviço:', error.response?.data || error);
      setIsErrorServices(true);
      setErrorServices(error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar o serviço. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleEditClick = (service: Servico) => {
    setEditingService(service);
    setShowAddService(true);
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
            <h1 className="text-3xl font-bold text-barber-900">Editar Perfil da Barbearia</h1>
            <p className="mt-2 text-barber-600">
              Atualize as informações do seu perfil para manter seus clientes informados
            </p>
          </div>

          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Dados da Barbearia</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Foto da Barbearia</h3>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border-2 border-barber-200">
                        <img
                          src={shopImage || "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia"}
                          alt="Foto da Barbearia"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem:', e);
                            e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia";
                          }}
                        />
                      </div>
                      <div className="w-full max-w-md">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-barber-300 border-dashed rounded-lg cursor-pointer bg-barber-50 hover:bg-barber-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-1 text-barber-500" />
                            <p className="mb-2 text-sm text-barber-700">
                              <span className="font-semibold">Clique para alterar a foto</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-barber-500">PNG, JPG ou WEBP (MÁX. 5MB cada)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Barbearia</FormLabel>
                          <div className="relative">
                            <Store className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="Nome da sua Barbearia" className="pl-10" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Proprietário</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="Nome Completo" className="pl-10" {...field} />
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
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="00.000.000/0000-00" className="pl-10" {...field} />
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
                          <FormLabel>Endereço de E-mail</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="seu@email.com" className="pl-10" {...field} />
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Telefone</FormLabel>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="(55) 12345-6789" className="pl-10" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Endereço</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Rua</FormLabel>
                            <div className="relative">
                              <Home className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder="Nome da rua"
                                  className="pl-10"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Centro"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sua cidade"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00000-000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Negócio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sobre sua barbearia, especialidades, experiência, etc."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/barber/profile")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-barber-900 hover:bg-barber-800"
                      disabled={updateMutation.isPending || !form.formState.isValid}
                    >
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Serviços Oferecidos</CardTitle>
                    <CardDescription>Gerencie os serviços que sua barbearia oferece.</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowAddService(true)} 
                    className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                  >
                    <Plus size={16} />
                    Adicionar Serviço
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingServicos ? (
                    <div className="text-center py-4">Carregando serviços...</div>
                  ) : servicesData && servicesData.length > 0 ? (
                    <div className="grid gap-4">
                      {servicesData.map((service) => (
                        <Card key={service.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-semibold">{service.descricao}</div>
                              <div className="text-sm text-barber-600">
                                Tipo: {service.tipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className="text-sm text-barber-600">
                                R$ {service.preco.toFixed(2)} - {service.duracaoMinutos} min
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditClick(service)}
                                className="text-barber-900 hover:text-barber-700"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteService(service.id?.toString() || '')}
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
                      Nenhum serviço cadastrado
                    </div>
                  )}

                  {showAddService && (
                    <Card className="p-4">
                      <CardTitle className="text-lg mb-4">
                        {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                      </CardTitle>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingService) {
                          handleEditService();
                        } else {
                          handleAddService();
                        }
                      }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de Serviço</Label>
                            <Select
                              value={editingService?.tipo || newService.tipo || ''}
                              onValueChange={(value) => {
                                if (editingService) {
                                  setEditingService({...editingService, tipo: value});
                                } else {
                                  setNewService({...newService, tipo: value});
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(TipoServico).map((tipo) => (
                                  <SelectItem key={tipo} value={tipo}>
                                    {tipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input 
                              id="descricao"
                              value={editingService?.descricao || newService.descricao || ''}
                              onChange={(e) => {
                                if (editingService) {
                                  setEditingService({...editingService, descricao: e.target.value});
                                } else {
                                  setNewService({...newService, descricao: e.target.value});
                                }
                              }}
                              placeholder="Ex: Corte na máquina com tesoura e máquina"
                              minLength={10}
                              maxLength={500}
                            />
                            <p className="text-xs text-barber-500">
                              A descrição deve ter entre 10 e 500 caracteres
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="preco">Preço (R$)</Label>
                            <Input 
                              id="preco"
                              type="number"
                              step="0.01"
                              value={editingService?.preco || newService.preco || ''}
                              onChange={(e) => {
                                if (editingService) {
                                  setEditingService({...editingService, preco: parseFloat(e.target.value) || undefined});
                                } else {
                                  setNewService({...newService, preco: parseFloat(e.target.value) || undefined});
                                }
                              }}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duracao">Duração (min)</Label>
                            <Input 
                              id="duracao"
                              type="number"
                              value={editingService?.duracaoMinutos || newService.duracaoMinutos || ''}
                              onChange={(e) => {
                                if (editingService) {
                                  setEditingService({...editingService, duracaoMinutos: parseInt(e.target.value) || undefined});
                                } else {
                                  setNewService({...newService, duracaoMinutos: parseInt(e.target.value) || undefined});
                                }
                              }}
                              placeholder="30"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => {
                              setShowAddService(false);
                              setNewService({});
                              setEditingService(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                            disabled={
                              editingService 
                                ? !editingService.tipo || !editingService.descricao || !editingService.preco || !editingService.duracaoMinutos
                                : !newService.tipo || !newService.descricao || !newService.preco || !newService.duracaoMinutos
                            }
                          >
                            {editingService ? (
                              <>
                                <Pencil size={16} />
                                Atualizar Serviço
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                Adicionar Serviço
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BarberEditProfile; 