import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Lock, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const message = location.state?.message;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  // UseEffect para lidar com o redirecionamento após o login bem-sucedido
  useEffect(() => {
    if (user) {
      // Tentar obter o from de diferentes formas
      const fromPathname = location.state?.from?.pathname;
      const fromString = location.state?.from;
      const from = fromPathname || (typeof fromString === 'string' ? fromString : null);
      
      console.log('Login - location.state:', location.state);
      console.log('Login - fromPathname:', fromPathname);
      console.log('Login - fromString:', fromString);
      console.log('Login - from final:', from);
      console.log('Login - user tipo:', user.tipo);
      
      let redirectTo = '/';

      // Se há from específico, usa ele (com validações)
      if (from) {
        console.log('Login - há from, redirecionando para:', from);
        
        // Verificar se o usuário tem permissão para acessar a rota
        if (from.startsWith('/agendamento/') && user.tipo !== 'CLIENTE') {
          toast({
            title: "Acesso restrito",
            description: "Apenas clientes podem realizar agendamentos.",
            variant: "destructive",
          });
          redirectTo = '/client/profile';
        } else if (from.startsWith('/barbershops/')) {
          // Para páginas de barbearia, qualquer usuário pode acessar
          redirectTo = from;
        } else {
          // Para outras rotas, usar o from
          redirectTo = from;
        }
      } else {
        // Se não há from, usa a lógica padrão por tipo de usuário
        console.log('Login - não há from, usando redirecionamento padrão');
        switch (user.tipo) {
          case 'CLIENTE':
            redirectTo = '/client/profile';
            break;
          case 'ESTABELECIMENTO':
            redirectTo = '/barber/profile';
            break;
          case 'ADMINISTRADOR':
            redirectTo = '/admin/dashboard';
            break;
          default:
            redirectTo = '/';
        }
      }
      
      console.log('Login - redirecionamento final para:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location.state, toast]); // Dependências: user, navigate, location.state, toast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password); // useAuth() state update triggers useEffect
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });

      // Redirecionamento agora é tratado no useEffect

    } catch (err) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Acesso Necessário</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
