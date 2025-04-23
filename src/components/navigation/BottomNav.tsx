
import { Home, User, Bell, Film, Trophy, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  const navItems = [
    {
      name: 'Início',
      icon: Home,
      path: '/',
    },
    {
      name: 'Equipes',
      icon: Users,
      path: '/teams',
    },
    {
      name: 'Gincana',
      icon: Trophy,
      path: '/challenge',
    },
    {
      name: 'Vídeos',
      icon: Film,
      path: '/videos',
    },
    {
      name: 'Perfil',
      icon: User,
      path: '/profile',
    },
  ];
  
  if (user.role === 'admin' || user.role === 'dev-admin') {
    navItems.splice(1, 0, {
      name: 'Admin',
      icon: Bell,
      path: '/team-management',
    });
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="app-container grid grid-cols-5 text-xs font-medium">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-3 transition-colors',
              location.pathname === item.path
                ? 'text-gold-600'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon size={24} className="mb-1" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
