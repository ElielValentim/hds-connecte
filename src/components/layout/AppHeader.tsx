
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/use-theme';
import { navItems, getAdminItems } from './navigation/navItems';
import MobileMenu from './navigation/MobileMenu';
import DesktopNav from './navigation/DesktopNav';
import UserMenu from './navigation/UserMenu';

const AppHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();
  
  const [title, setTitle] = useState('HDS CONECTE');
  
  useEffect(() => {
    // Update title based on current route
    const path = location.pathname;
    if (path === '/') setTitle('HDS CONECTE');
    else if (path === '/profile') setTitle('Meu Perfil');
    else if (path === '/registration') setTitle('Cadastro');
    else if (path === '/challenge') setTitle('Gincana');
    else if (path === '/videos') setTitle('Vídeos');
    else if (path === '/notifications') setTitle('Notificações');
    else if (path === '/dev-admin') setTitle('Dev Admin');
    else if (path === '/teams') setTitle('Equipes');
    else setTitle('HDS CONECTE');
    
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Get admin items if user has admin role
  const adminItems = user ? getAdminItems(user.role) : [];
  
  return (
    <header className="bg-yellow-500 text-white py-4 px-4 shadow-md">
      <div className="app-container flex justify-between items-center">
        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/517237b8-3f79-4b2e-9ada-55197aa95076.png" 
              alt="HDS Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
          </div>
        </div>
        
        {/* Desktop Navigation Menu */}
        {user && (
          <DesktopNav 
            navItems={navItems} 
            adminItems={adminItems}
            currentPath={location.pathname} 
          />
        )}
        
        <div className="flex items-center gap-2">
          {user && <UserMenu onLogout={logout} />}
        </div>
      </div>
      
      {/* Mobile menu */}
      {user && (
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          navItems={navItems}
          adminItems={adminItems}
          currentPath={location.pathname}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={logout}
        />
      )}
    </header>
  );
};

export default AppHeader;
