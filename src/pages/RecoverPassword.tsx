
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const recoverSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
});

type RecoverFormValues = z.infer<typeof recoverSchema>;

const RecoverPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { recoverPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const form = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: RecoverFormValues) => {
    try {
      const result = await recoverPassword(values.email);
      
      if (result.success) {
        setIsSubmitted(true);
      } else if (result.error) {
        toast.error(result.error || 'Ocorreu um erro ao enviar o email de recuperação. Tente novamente.');
      }
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">HDS CONECTE</h1>
          <p className="text-muted-foreground">Recupere seu acesso</p>
        </div>
        
        <Card className="bg-card animate-scale-in">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/login')}
                className="mr-2 -ml-2"
              >
                <ArrowLeft size={20} />
              </Button>
              <CardTitle>Recuperar Acesso</CardTitle>
            </div>
            <CardDescription>
              {isSubmitted
                ? 'Iniciamos o processo de recuperação de acesso.'
                : 'Informe seu email para recuperar sua senha.'}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
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
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></span>
                        Processando...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar instruções
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          ) : (
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
                <p>Verifique seu email para instruções de recuperação de senha.</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/login')}
              >
                Voltar para o login
              </Button>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Lembrou sua senha?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RecoverPassword;
