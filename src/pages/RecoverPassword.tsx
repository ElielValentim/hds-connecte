
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuthStore();
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
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
              Acesse com sua conta Google para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md">
              <p>Para recuperar seu acesso, utilize o login com Google.</p>
            </div>
            
            <Button 
              onClick={handleGoogleSignIn} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
              </svg>
              Entrar com Google
            </Button>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RecoverPassword;
