import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Scissors } from "lucide-react";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  code: z.string().min(6, { message: "O código deve ter 6 dígitos" }),
  newPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const { toast } = useToast();
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEmailSubmit = async (data: Pick<ResetPasswordFormValues, 'email'>) => {
    // Em uma aplicação real, isso chamaria uma API para enviar o código
    console.log("Enviando código para:", data.email);
    toast({
      title: "Código enviado",
      description: "Enviamos um código de verificação para seu e-mail.",
    });
    setStep('reset');
  };

  const handleResetSubmit = async (data: ResetPasswordFormValues) => {
    // Em uma aplicação real, isso chamaria uma API para resetar a senha
    console.log("Resetando senha:", data);
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Scissors size={28} className="text-barber-900" />
            <span className="text-xl font-semibold tracking-tight text-barber-900">BarberHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'email' ? 'Recuperar Senha' : 'Redefinir Senha'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'email' 
              ? 'Digite seu e-mail para receber o código de verificação'
              : 'Digite o código recebido e sua nova senha'}
          </p>
        </div>

        {step === 'email' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-6">
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
              
              <Button type="submit" className="w-full bg-barber-900 hover:bg-barber-800">
                Enviar Código
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Verificação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o código de 6 dígitos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
              
              <Button type="submit" className="w-full bg-barber-900 hover:bg-barber-800">
                Redefinir Senha
              </Button>
            </form>
          </Form>
        )}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{" "}
            <Link to="/login" className="font-medium text-barber-900 hover:text-barber-800">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 