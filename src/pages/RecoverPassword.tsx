
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { recoverPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const validateForm = () => {
    if (!email) {
      setError('Email é obrigatório');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await recoverPassword(email);
    if (success) {
      setIsSubmitted(true);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">HDS CONECTE</h1>
          <p className="text-muted-foreground">Recupere sua senha</p>
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
              <CardTitle>Recuperar Senha</CardTitle>
            </div>
            <CardDescription>
              {isSubmitted
                ? 'Enviamos um email com instruções para recuperar sua senha.'
                : 'Digite seu email para receber instruções de recuperação.'}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></span>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar instruções'
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
                <p>Verifique seu email para instruções sobre como redefinir sua senha.</p>
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
        </Card>
      </div>
    </div>
  );
};

export default RecoverPassword;
