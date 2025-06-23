import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Scissors, Edit2, Save, X, Plus, Trash2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_SERVICES } from "@/constants/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

interface UsuarioDTO {
    id: number;
    email: string;
}

interface HorarioFuncionamentoDTO {
    id: number;
    diaSemana: string;
    horarioAbertura: string;
    horarioFechamento: string;
}

interface EstabelecimentoDTO extends UsuarioDTO {
    nomeProprietario: string;
    nomeEstabelecimento: string;
    cnpj: string;
    endereco: string;
    cidade: string;
    cep: string;
    telefone: string;
    status: string;
    horario: HorarioFuncionamentoDTO[];
    foto?: string;
}

const barberProfileSchema = z.object({
  shopName: z.string().min(2, { message: "O nome da barbearia deve ter pelo menos 2 caracteres" }),
  ownerName: z.string().min(2, { message: "O nome do proprietário deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  phone: z.string().min(10, { message: "Por favor, insira um número de telefone válido" }),
  address: z.string().min(5, { message: "O endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "A cidade deve ter pelo menos 2 caracteres" }),
  cep: z.string().min(8, { message: "CEP inválido" }).max(9, { message: "CEP inválido" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
});

type BarberProfileFormValues = z.infer<typeof barberProfileSchema>;

interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Service {
  id: number;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  tipo: string;
  estabelecimentoId: number;
}

const BarberProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [shopImage, setShopImage] = useState<string>("https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia");
  const queryClient = useQueryClient();
  
  const { user } = useAuth();
  const establishmentId = user?.id;

  const { data: establishmentData, isLoading: isLoadingEstablishment, isError: isErrorEstablishment, error: errorEstablishment } = useQuery<EstabelecimentoDTO, Error>({
    queryKey: ['establishment', establishmentId],
    queryFn: async () => {
      if (!establishmentId) {
        throw new Error("Establishment ID not available");
      }
      const response = await api.get<EstabelecimentoDTO>(`/api/estabelecimentos/${establishmentId}`);
      return response.data;
    },
    enabled: !!establishmentId,
  });

  const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useQuery<Service[], Error>({
    queryKey: ['services', establishmentId],
    queryFn: async () => {
      if (!establishmentId) {
        throw new Error("Establishment ID not available");
      }
      const response = await api.get<Service[]>(`/api/servicos/barbearia/${establishmentId}`);
      console.log('Serviços recebidos:', response.data);
      return response.data;
    },
    enabled: !!establishmentId,
  });

  const form = useForm<BarberProfileFormValues>({
    resolver: zodResolver(barberProfileSchema),
  });

  useEffect(() => {
    if (establishmentData) {
      form.reset({
        shopName: establishmentData.nomeEstabelecimento || "",
        ownerName: establishmentData.nomeProprietario || "",
        email: establishmentData.email || "",
        phone: establishmentData.telefone || "",
        address: establishmentData.endereco || "",
        city: establishmentData.cidade || "",
        cep: establishmentData.cep || "",
      });
      
      if (establishmentData.horario) {
          const mappedWorkingHours = establishmentData.horario.map(h => ({
              day: h.diaSemana,
              isOpen: true,
              openTime: h.horarioAbertura,
              closeTime: h.horarioFechamento,
          }));
          setWorkingHours(mappedWorkingHours);
      }

      if (establishmentData.foto) {
        if (establishmentData.foto.startsWith('data:image')) {
          setShopImage(establishmentData.foto);
        } else {
          setShopImage(`data:image/jpeg;base64,${establishmentData.foto}`);
        }
      } else {
        setShopImage("https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia");
      }
    }
  }, [establishmentData, form]);

  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({});

  function onSubmit(data: BarberProfileFormValues) {
    console.log(data);
    toast({
      title: "Perfil Atualizado",
      description: "Seu perfil foi atualizado com sucesso!",
    });
    setIsEditing(false);
  }

  const handleWorkingHoursChange = (day: string, field: keyof WorkingHours, value: string | boolean) => {
    setWorkingHours(workingHours.map(wh => 
      wh.day === day ? { ...wh, [field]: value } : wh
    ));
  };

  const handleAddService = async () => {
    try {
      if (!establishmentId) {
        toast({
          title: "Erro",
          description: "ID do estabelecimento não encontrado",
          variant: "destructive",
        });
        return;
      }

      if (newService.descricao && newService.preco && newService.duracaoMinutos && newService.tipo) {
        const serviceData = {
          descricao: newService.descricao,
          preco: newService.preco,
          duracaoMinutos: newService.duracaoMinutos,
          tipo: newService.tipo,
          estabelecimentoId: establishmentId
        };

        const response = await api.post('/api/servicos', serviceData);

        if (response.status === 201) {
          toast({
            title: "Sucesso",
            description: "Serviço adicionado com sucesso!",
          });
          setNewService({});
          // Atualiza a lista de serviços
          queryClient.invalidateQueries({ queryKey: ['services', establishmentId] });
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar serviço. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      const response = await api.delete(`/api/servicos/${serviceId}`);
      
      if (response.status === 200) {
        toast({
          title: "Sucesso",
          description: "Serviço removido com sucesso!",
        });
        // Atualiza a lista de serviços
        queryClient.invalidateQueries({ queryKey: ['services', establishmentId] });
      }
    } catch (error) {
      console.error("Erro ao remover serviço:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover serviço. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setShopImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (data: BarberProfileFormValues) => {
    try {
      if (!establishmentId) {
        toast({
          title: "Erro",
          description: "ID do estabelecimento não encontrado",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("nomeProprietario", data.ownerName);
      formData.append("nomeEstabelecimento", data.shopName);
      formData.append("email", data.email);
      formData.append("telefone", data.phone);
      formData.append("endereco", data.address);
      formData.append("cidade", data.city);
      formData.append("cep", data.cep);

      // Adiciona a foto se foi alterada
      if (shopImage && shopImage !== "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+da+Barbearia") {
        formData.append("foto", shopImage);
      }

      const response = await api.put(`/api/estabelecimentos/${establishmentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!",
        });
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['establishment', establishmentId] });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingEstablishment || isLoadingServices) {
      return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;
  }

  if (isErrorEstablishment || isErrorServices) {
      return <div className="min-h-screen flex items-center justify-center text-red-500">
        Erro ao carregar perfil: {errorEstablishment?.message || errorServices?.message}
      </div>;
  }

  return (
    <div className="min-h-screen bg-barber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Scissors size={28} className="text-barber-900" />
              <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => navigate("/barber/edit-profile")}
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
                  >
                    <Save size={16} />
                    Salvar Alterações
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="relative w-full h-48 md:h-64 lg:h-80">
              <img
                src={shopImage}
                alt="Foto da Barbearia"
                className="w-full h-full object-cover rounded-lg"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="text-white text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <span>Alterar foto</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-barber-900">Perfil da Barbearia</h1>
            <h2 className="text-xl font-semibold text-barber-800 mt-2">{establishmentData?.nomeEstabelecimento}</h2>
            <p className="mt-2 text-barber-600">
              Gerencie as informações do seu perfil e mantenha seus clientes atualizados
            </p>
          </div>

          <Tabs defaultValue="hours" className="space-y-4">
            <TabsList>
              <TabsTrigger value="hours">Horários de Funcionamento</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value="hours">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Horário de Funcionamento</CardTitle>
                    <CardDescription>Configure os horários de funcionamento da sua barbearia.</CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate("/barber/edit-hours")} 
                    className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                  >
                    <Edit2 size={16} />
                    Editar Horários
                  </Button>
                </CardHeader>
                <CardContent>
                  {workingHours.map(dayData => (
                      <div key={dayData.day} className="flex items-center justify-between py-2 border-b">
                          <Label>{dayData.day}</Label>
                          <div className="flex items-center gap-4">
                              {isEditing ? (
                                  <Switch 
                                      checked={dayData.isOpen}
                                      onCheckedChange={(checked) => handleWorkingHoursChange(dayData.day, 'isOpen', checked)}
                                  />
                              ) : (
                                  <span>{dayData.isOpen ? 'Aberto' : 'Fechado'}</span>
                              )}
                              {dayData.isOpen && isEditing && (
                                  <div className="flex gap-2">
                                      <Input 
                                          type="time" 
                                          value={dayData.openTime}
                                          onChange={(e) => handleWorkingHoursChange(dayData.day, 'openTime', e.target.value)}
                                          className="w-24"
                                      />
                                      <span>-</span>
                                      <Input 
                                          type="time" 
                                          value={dayData.closeTime}
                                          onChange={(e) => handleWorkingHoursChange(dayData.day, 'closeTime', e.target.value)}
                                          className="w-24"
                                      />
                                  </div>
                              )}
                              {dayData.isOpen && !isEditing && (
                                  <span>{dayData.openTime} - {dayData.closeTime}</span>
                              )}
                          </div>
                      </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Serviços Oferecidos</CardTitle>
                    <CardDescription>Liste os serviços que sua barbearia oferece.</CardDescription>
                  </div>
                  {isEditing && (
                    <Button 
                      onClick={() => setShowAddService(true)} 
                      className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                    >
                      <Plus size={16} />
                      Adicionar Serviço
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingServices ? (
                    <div>Carregando serviços...</div>
                  ) : isErrorServices ? (
                    <div className="text-red-500">Erro ao carregar serviços: {errorServices?.message}</div>
                  ) : servicesData && servicesData.length > 0 ? (
                    servicesData.map(service => (
                      <div key={service.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                        <div>
                          <div className="font-semibold">{service.descricao}</div>
                          <div className="text-sm text-barber-600">R$ {service.preco.toFixed(2)} - {service.duracaoMinutos} min</div>
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 size={16} className="text-red-500"/>
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-barber-600">Nenhum serviço cadastrado</div>
                  )}

                  {isEditing && showAddService && (
                    <Card className="p-4">
                      <CardTitle className="text-lg mb-4">Adicionar Novo Serviço</CardTitle>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="new-service-type">Tipo de Serviço</Label>
                          <Select
                            value={newService.tipo || ''}
                            onValueChange={(value) => setNewService({...newService, tipo: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CORTE">Corte</SelectItem>
                              <SelectItem value="BARBA">Barba</SelectItem>
                              <SelectItem value="CORTE_E_BARBA">Corte e Barba</SelectItem>
                              <SelectItem value="HIDRATACAO">Hidratação</SelectItem>
                              <SelectItem value="COLORACAO">Coloração</SelectItem>
                              <SelectItem value="PINTURA">Pintura</SelectItem>
                              <SelectItem value="OUTROS">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-service-name">Descrição</Label>
                          <Input 
                            id="new-service-name"
                            value={newService.descricao || ''}
                            onChange={(e) => setNewService({...newService, descricao: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-service-price">Preço (R$)</Label>
                          <Input 
                            id="new-service-price"
                            type="number"
                            value={newService.preco || ''}
                            onChange={(e) => setNewService({...newService, preco: parseFloat(e.target.value) || undefined})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-service-duration">Duração (min)</Label>
                          <Input 
                            id="new-service-duration"
                            type="number"
                            value={newService.duracaoMinutos || ''}
                            onChange={(e) => setNewService({...newService, duracaoMinutos: parseInt(e.target.value) || undefined})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddService(false);
                            setNewService({});
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleAddService} 
                          className="flex items-center gap-2 bg-barber-900 hover:bg-barber-800"
                          disabled={!newService.tipo || !newService.descricao || !newService.preco || !newService.duracaoMinutos}
                        >
                          <Plus size={16} />
                          Adicionar Serviço
                        </Button>
                      </div>
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

export default BarberProfile;