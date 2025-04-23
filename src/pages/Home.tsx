
import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Film, User, Bell, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';

// Add pulse highlight animation CSS
const pulseHighlightStyle = `
  @keyframes pulseHighlight {
    0% { background-color: rgba(234, 179, 8, 0.2); }
    50% { background-color: rgba(234, 179, 8, 0.4); }
    100% { background-color: transparent; }
  }
  
  .pulse-highlight {
    animation: pulseHighlight 2s ease-in-out;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const menuItems = [
    {
      name: 'Vídeos',
      description: 'Assista e compartilhe',
      icon: Film,
      path: '/videos',
      color: 'bg-gold-100 dark:bg-gold-900/40',
      iconColor: 'text-gold-600'
    },
    {
      name: 'Perfil',
      description: 'Gerencie seus dados',
      icon: User,
      path: '/profile',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    },
    {
      name: 'Notificações',
      description: 'Veja suas mensagens',
      icon: Bell,
      path: '/notifications',
      color: 'bg-gold-100 dark:bg-gold-900/40',
      iconColor: 'text-gold-600'
    },
  ];
  
  if (user?.role === 'dev-admin') {
    menuItems.push({
      name: 'Dev Admin',
      description: 'Configurações avançadas',
      icon: Settings,
      path: '/dev-admin',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    });
  }
  
  if (user?.role === 'admin') {
    menuItems.push({
      name: 'Admin',
      description: 'Gerenciar conteúdo',
      icon: Settings,
      path: '/admin',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    });
  }
  
  return (
    <AppLayout>
      {/* Add the style for pulse highlight animation */}
      <style dangerouslySetInnerHTML={{ __html: pulseHighlightStyle }} />
      
      <div className="space-y-6">
        <section className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/517237b8-3f79-4b2e-9ada-55197aa95076.png" 
              alt="HDS Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Bem-vindo(a)!</h1>
          <p className="text-muted-foreground">
            Olá, {user?.name || 'Usuário'}. O que você deseja fazer hoje?
          </p>
        </section>
        
        <Card className="bg-yellow-500 text-black overflow-hidden">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-xl mb-2 text-black">Próximo evento</h3>
            <p className="text-gray-800 mb-2 font-semibold">Assembleia Geral Ordinária - AGO</p>
            <div className="bg-white/70 rounded-md p-2 shadow-sm">
              <p className="font-bold text-black text-lg">12 de Dezembro de 2023</p>
              <p className="text-sm text-gray-700 font-medium">Inscrições abertas até 05/12</p>
            </div>
          </CardContent>
        </Card>
        
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-4">Outros recursos</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card
                key={item.path}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow btn-transition"
                onClick={() => navigate(item.path)}
              >
                <CardContent className={`p-6 ${item.color}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${item.iconColor} bg-white/80 dark:bg-white/10 mb-4`}>
                      <item.icon size={28} />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
