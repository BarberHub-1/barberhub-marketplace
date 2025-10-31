import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Lock, User, Eye, EyeOff, MapPin, CreditCard, Home, Hash, Map, Building2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Scissors } from "lucide-react";
import api from "@/lib/api";

const signupSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }).max(11, { message: "Telefone inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }).max(14, { message: "CPF inválido" }),
  street: z.string().min(3, { message: "Rua inválida" }),
  number: z.string().min(1, { message: "Número inválido" }),
  neighborhood: z.string().min(2, { message: "Bairro inválido" }),
  city: z.string().min(2, { message: "Cidade inválida" }),
  state: z.string().min(2, { message: "Estado inválido" }),
  zipCode: z.string().min(8, { message: "CEP inválido" }).max(9, { message: "CEP inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  termsAndConditions: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos e condições" }),
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      password: "",
      termsAndConditions: undefined,
    },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
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
      
      // Formata o CPF (remove caracteres não numéricos e garante formato correto)
      const cpfFormatado = data.cpf.replace(/\D/g, '');
      if (cpfFormatado.length !== 11) {
        toast({
          title: "Erro",
          description: "O CPF deve conter 11 dígitos",
          variant: "destructive",
        });
        return;
      }
      const cpfComFormato = `${cpfFormatado.substring(0, 3)}.${cpfFormatado.substring(3, 6)}.${cpfFormatado.substring(6, 9)}-${cpfFormatado.substring(9)}`;
      
      // Prepara os dados do cliente
      const clienteData = {
        nome: data.name,
        email: data.email,
        senha: data.password,
        cpf: cpfComFormato,
        telefone: telefoneComFormato,
        rua: data.street,
        numero: parseInt(data.number),
        bairro: data.neighborhood,
        cidade: data.city,
        estado: data.state,
        cep: data.zipCode
      };

      const response = await api.post('/api/clientes', clienteData);
      
      toast({
        title: "Conta Criada",
        description: `Bem-vindo, ${data.name}! Sua conta foi criada com sucesso.`,
      });
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível criar a conta. Tente novamente.",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Scissors size={28} className="text-barber-900" />
            <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Criar uma conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao BarberHub e descubra os melhores barbeiros da sua região
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="João Silva"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
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
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground"
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
                      <div className="relative">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {estadosBrasileiros.map((estado) => (
                              <SelectItem key={estado.sigla} value={estado.sigla}>
                                {estado.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!termsRead || !privacyRead}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Eu concordo com os{" "}
                      <button
                        type="button"
                        onClick={handleTermsClick}
                        className="text-barber-900 hover:underline"
                      >
                        Termos de Serviço
                      </button>{" "}
                      e{" "}
                      <button
                        type="button"
                        onClick={handlePrivacyClick}
                        className="text-barber-900 hover:underline"
                      >
                        Política de Privacidade
                      </button>
                    </FormLabel>
                    {(!termsRead || !privacyRead) && (
                      <p className="text-sm text-amber-600">
                        Por favor, leia os termos de serviço e a política de privacidade antes de prosseguir
                      </p>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-barber-900 hover:bg-barber-800"
              disabled={!termsRead || !privacyRead}
            >
              Criar conta
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="font-medium text-barber-900 hover:text-barber-800">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
