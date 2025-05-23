
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Define nav items for better organization
  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Meu Perfil', path: '/profile' },
    { name: 'Cadastro', path: '/registration' },
    { name: 'Gincana', path: '/challenge' },
    { name: 'Vídeos', path: '/videos' },
    { name: 'Notificações', path: '/notifications' },
    { name: 'Equipes', path: '/teams' },
  ];
  
  // Add admin items conditionally
  const adminItems = [
    ...(user?.role === 'dev-admin' ? [{ name: 'Dev Admin', path: '/dev-admin' }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];
  
  return (
    <header className="bg-gold-500 text-primary-foreground py-4 px-4 shadow-md">
      <div className="app-container flex justify-between items-center">
        <div className="flex items-center gap-2">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-black"
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
            <h1 className="text-xl md:text-2xl font-bold text-black">{title}</h1>
          </div>
        </div>
        
        {/* Desktop Navigation Menu - Always visible on MD screens and larger */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-gold-600 text-white' 
                    : 'text-black hover:bg-gold-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin dropdown only if user has admin privileges */}
            {adminItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black border-gold-600 bg-gold-300 hover:bg-gold-400"
                  >
                    Admin <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-white">
                  {adminItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="w-full">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-black border-gold-600 bg-gold-300 hover:bg-gold-400"
                >
                  Opções <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white">
                <DropdownMenuItem onClick={logout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Mobile menu - Full width, easy to read */}
      {isMobileMenuOpen && user && (
        <div className="absolute top-16 left-0 right-0 bg-gold-50 border-b border-gold-200 z-50 shadow-lg animate-fade-in md:hidden">
          <nav className="app-container py-4">
            <ul className="space-y-0">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block py-3 px-4 text-base transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-gold-300 font-semibold text-black' 
                        : 'hover:bg-gold-200 text-black'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {adminItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block py-3 px-4 text-base font-medium transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-gold-300 font-semibold text-black' 
                        : 'hover:bg-gold-200 text-black'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              <li>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-base text-red-600 hover:bg-gold-200 transition-colors"
                >
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
