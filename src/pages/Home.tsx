import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Film, User, Bell, Settings, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const menuItems = [
    {
      name: 'Equipes',
      description: 'Participe de uma equipe',
      icon: Users,
      path: '/teams',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    },
    {
      name: 'Gincana',
      description: 'Participe dos desafios',
      icon: Trophy,
      path: '/challenge',
      color: 'bg-gold-100 dark:bg-gold-900/40',
      iconColor: 'text-gold-600'
    },
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
        
        <section>
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
        
        <section className="pt-6">
          <Card className="bg-gold-500 text-black">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2 text-black">Próximo evento</h3>
              <p className="text-gray-800 mb-4 font-semibold">Assembleia Geral Ordinária - AGO</p>
              <div className="bg-white/70 rounded-md p-3 text-center shadow-sm">
                <p className="font-bold text-black text-lg">12 de Dezembro de 2023</p>
                <p className="text-sm text-gray-700 font-medium">Inscrições abertas até 05/12</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
