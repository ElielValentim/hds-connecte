
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/use-theme';

const AppHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
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
    else setTitle('HDS CONECTE');
    
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 shadow-md">
      <div className="app-container flex justify-between items-center">
        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-white"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white"
            >
              Sair
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && user && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border z-50 shadow-lg animate-fade-in md:hidden">
          <nav className="app-container py-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link 
                  to="/registration" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cadastro
                </Link>
              </li>
              <li>
                <Link 
                  to="/challenge" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gincana
                </Link>
              </li>
              <li>
                <Link 
                  to="/videos" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vídeos
                </Link>
              </li>
              <li>
                <Link 
                  to="/notifications" 
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Notificações
                </Link>
              </li>
              {user.role === 'dev-admin' && (
                <li>
                  <Link 
                    to="/dev-admin" 
                    className="block p-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dev Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
