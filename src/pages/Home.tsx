
import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Film, User, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const menuItems = [
    {
      name: 'Cadastro',
      description: 'Inscreva-se para eventos',
      icon: FileText,
      path: '/registration',
      color: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-500'
    },
    {
      name: 'Gincana',
      description: 'Participe dos desafios',
      icon: Trophy,
      path: '/challenge',
      color: 'bg-amber-100 dark:bg-amber-900',
      iconColor: 'text-amber-500'
    },
    {
      name: 'Vídeos',
      description: 'Assista e compartilhe',
      icon: Film,
      path: '/videos',
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-500'
    },
    {
      name: 'Perfil',
      description: 'Gerencie seus dados',
      icon: User,
      path: '/profile',
      color: 'bg-emerald-100 dark:bg-emerald-900',
      iconColor: 'text-emerald-500'
    },
    {
      name: 'Notificações',
      description: 'Veja suas mensagens',
      icon: Bell,
      path: '/notifications',
      color: 'bg-rose-100 dark:bg-rose-900',
      iconColor: 'text-rose-500'
    },
  ];
  
  // Add Dev Admin option if user is dev-admin
  if (user?.role === 'dev-admin') {
    menuItems.push({
      name: 'Dev Admin',
      description: 'Configurações avançadas',
      icon: User,
      path: '/dev-admin',
      color: 'bg-indigo-100 dark:bg-indigo-900',
      iconColor: 'text-indigo-500'
    });
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-8">
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
          <Card className="bg-purple-500 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2">Próximo evento</h3>
              <p className="opacity-90 mb-4">Assembleia Geral Ordinária - AGO</p>
              <div className="bg-white/20 rounded-md p-3 text-center">
                <p className="font-bold">12 de Dezembro de 2023</p>
                <p className="text-sm opacity-90">Inscrições abertas até 05/12</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
