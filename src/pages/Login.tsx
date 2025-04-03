
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithEmail, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signInWithEmail(values.email, values.password);
      
      if (result.success) {
        toast.success('Login bem-sucedido');
        navigate('/', { replace: true });
      } else if (result.error) {
        toast.error(result.error || 'Ocorreu um erro durante o login. Tente novamente.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">HDS CONECTE</h1>
          <p className="text-muted-foreground">Conectando a Família HDS</p>
        </div>
        
        <Card className="bg-card animate-scale-in">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="Email" 
                            {...field} 
                            className="pl-10" 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Senha" 
                            {...field} 
                            className="pl-10 pr-10" 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Button 
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></span>
                      Entrando...
                    </span>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link to="/recover-password" className="text-sm text-primary hover:underline text-center">
                Esqueceu sua senha?
              </Link>
              <Link to="/signup" className="text-sm text-primary hover:underline text-center">
                Não tem uma conta? Cadastre-se
              </Link>
            </div>
          </CardContent>
          
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Ao entrar, você concorda com os termos e políticas do HDS CONECTE
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
