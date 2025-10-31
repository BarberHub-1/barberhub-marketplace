import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Scissors, MapPin, User, Mail, Phone, Store, Clock, Image, Calendar, Upload, Building2, Hash, Home, Map, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AVAILABLE_SERVICES } from "@/constants/services";
import { estabelecimentoService } from "@/services/estabelecimento.service";
import api from "@/lib/axios";

interface EstabelecimentoResponse {
  id: number;
  nomeEstabelecimento: string;
  nomeProprietario: string;
  cnpj: string;
  email: string;
  telefone: string;
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  descricao: string;
  foto: string;
  status: string;
  horario: Array<{
    diaSemana: string;
    horarioAbertura: string;
    horarioFechamento: string;
  }>;
}

const barberShopSchema = z.object({
  shopName: z.string().min(2, { message: "O nome da barbearia deve ter pelo menos 2 caracteres" }),
  ownerName: z.string().min(2, { message: "O nome do proprietário deve ter pelo menos 2 caracteres" }),
  cnpj: z.string().min(14, { message: "CNPJ inválido" }).max(18, { message: "CNPJ inválido" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  phone: z.string().min(10, { message: "Por favor, insira um número de telefone válido" }),
  street: z.string().min(3, { message: "Rua inválida" }),
  number: z.string().min(1, { message: "Número inválido" }),
  neighborhood: z.string().min(2, { message: "Bairro inválido" }),
  city: z.string().min(2, { message: "Cidade inválida" }),
  state: z.string().min(2, { message: "Estado inválido" }),
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

const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'] as const;

const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
] as const;

const BarberSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [termsRead, setTermsRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shopImage, setShopImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const form = useForm<BarberShopFormValues>({
    resolver: zodResolver(barberShopSchema),
    defaultValues: {
      shopName: "",
      ownerName: "",
      cnpj: "",
      email: "",
      password: "",
      phone: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      description: "",
      services: [],
      horarios: []
    },
  });

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
        setShopImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: BarberShopFormValues) {
    if (!shopImage) {
      toast({
        title: "Erro",
        description: "Por favor, adicione uma foto da sua barbearia",
        variant: "destructive",
      });
      return;
    }

    try {
      // Converte a imagem para base64
      const base64Image = shopImage.split(',')[1];
      
      // Formata o telefone (remove caracteres não numéricos e garante formato correto)
      const telefoneFormatado = data.phone.replace(/\D/g, '');
      if (telefoneFormatado.length !== 11) {
        toast({
          title: "Erro",
          description: "O telefone deve conter 11 dígitos (DDD + número)",
          variant: "destructive",
        });
        return;
      }
      const telefoneComFormato = `(${telefoneFormatado.substring(0, 2)}) ${telefoneFormatado.substring(2, 7)}-${telefoneFormatado.substring(7)}`;
      
      // Formata o CNPJ (remove caracteres não numéricos e garante formato correto)
      const cnpjFormatado = data.cnpj.replace(/\D/g, '');
      if (cnpjFormatado.length !== 14) {
        toast({
          title: "Erro",
          description: "O CNPJ deve conter 14 dígitos",
          variant: "destructive",
        });
        return;
      }
      const cnpjComFormato = `${cnpjFormatado.substring(0, 2)}.${cnpjFormatado.substring(2, 5)}.${cnpjFormatado.substring(5, 8)}/${cnpjFormatado.substring(8, 12)}-${cnpjFormatado.substring(12)}`;
      
      // Prepara os dados do estabelecimento
      const estabelecimentoData = {
        nomeEstabelecimento: data.shopName,
        nomeProprietario: data.ownerName,
        cnpj: cnpjComFormato,
        email: data.email,
        senha: data.password,
        telefone: telefoneComFormato,
        rua: data.street,
        numero: parseInt(data.number),
        bairro: data.neighborhood,
        cidade: data.city,
        estado: data.state,
        cep: data.zipCode,
        descricao: data.description,
        foto: base64Image,
        servicos: data.services,
        horario: data.horarios.map(horario => ({
          diaSemana: horario.diaSemana,
          horarioAbertura: horario.horarioAbertura,
          horarioFechamento: horario.horarioFechamento
        }))
      };

      const response = await api.post<EstabelecimentoResponse>('/api/estabelecimentos', estabelecimentoData);
      
      toast({
        title: "Inscrição Enviada",
        description: "Obrigado por se inscrever! Analisaremos suas informações e entraremos em contato em breve.",
      });
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível realizar o cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  const handleTermsClick = () => {
    setTermsRead(true);
    window.open("/termsofservice", "_blank");
  };

  const handlePrivacyClick = () => {
    setPrivacyRead(true);
    window.open("/privacypolicy", "_blank");
  };

  return (
    <div className="min-h-screen bg-barber-50 pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Scissors size={28} className="text-barber-900" />
              <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
            </Link>
            <h1 className="text-3xl font-bold text-barber-900">Inscreva-se no BarberHub</h1>
            <p className="mt-2 text-barber-600">
              Preencha o formulário abaixo para se juntar à nossa rede de barbeiros profissionais
            </p>
          </div>

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
                    />
                  </div>
                  <div className="w-full max-w-md">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-barber-300 border-dashed rounded-lg cursor-pointer bg-barber-50 hover:bg-barber-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-1 text-barber-500" />
                        <p className="mb-2 text-sm text-barber-700">
                          <span className="font-semibold">Clique para adicionar uma foto</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-barber-500">PNG, JPG ou WEBP (MÁX. 5MB)</p>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha" 
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <div className="relative">
                          <Hash className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Número"
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
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Nome do bairro"
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
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Nome da cidade"
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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {estadosBrasileiros.map((estado) => (
                                <SelectItem key={estado.sigla} value={estado.sigla}>
                                  {estado.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <div className="relative">
                          <Map className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="00000-000"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Serviços Oferecidos</h3>
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AVAILABLE_SERVICES.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={field.value?.includes(service.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), service.id]
                                  : (field.value || []).filter(id => id !== service.id);
                                field.onChange(newValue);
                              }}
                            />
                            <label
                              htmlFor={service.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {service.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Horários de Funcionamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diasSemana.map((dia) => (
                    <div key={dia} className="space-y-2">
                      <FormField
                        control={form.control}
                        name="horarios"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{dia}</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="Abertura"
                                  onChange={(e) => {
                                    const horarios = field.value || [];
                                    const index = horarios.findIndex(h => h.diaSemana === dia);
                                    if (index >= 0) {
                                      horarios[index].horarioAbertura = e.target.value;
                                    } else {
                                      horarios.push({
                                        diaSemana: dia,
                                        horarioAbertura: e.target.value,
                                        horarioFechamento: ''
                                      });
                                    }
                                    field.onChange(horarios);
                                  }}
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="Fechamento"
                                  onChange={(e) => {
                                    const horarios = field.value || [];
                                    const index = horarios.findIndex(h => h.diaSemana === dia);
                                    if (index >= 0) {
                                      horarios[index].horarioFechamento = e.target.value;
                                    } else {
                                      horarios.push({
                                        diaSemana: dia,
                                        horarioAbertura: '',
                                        horarioFechamento: e.target.value
                                      });
                                    }
                                    field.onChange(horarios);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Termos e Condições</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsRead}
                      onCheckedChange={(checked) => setTermsRead(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Li e concordo com os{" "}
                      <button
                        type="button"
                        onClick={handleTermsClick}
                        className="text-barber-900 hover:underline"
                      >
                        Termos de Serviço
                      </button>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={privacyRead}
                      onCheckedChange={(checked) => setPrivacyRead(checked as boolean)}
                    />
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Li e concordo com a{" "}
                      <button
                        type="button"
                        onClick={handlePrivacyClick}
                        className="text-barber-900 hover:underline"
                      >
                        Política de Privacidade
                      </button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/barbers")}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-barber-900 hover:bg-barber-800"
                  disabled={!termsRead || !privacyRead}
                >
                  Enviar Inscrição
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BarberSignup;
