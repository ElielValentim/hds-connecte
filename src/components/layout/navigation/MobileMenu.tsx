
import { Link } from 'react-router-dom';
import { NavItem } from './navItems';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  adminItems: NavItem[];
  currentPath: string;
  onLogout: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  adminItems, 
  currentPath, 
  onClose, 
  onLogout 
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 left-0 right-0 bg-yellow-500 border-b border-yellow-600 z-50 shadow-lg animate-fade-in md:hidden">
      <nav className="app-container py-4">
        <ul className="space-y-0">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`block py-3 px-4 text-base transition-colors ${
                  currentPath === item.path 
                    ? 'bg-yellow-600 font-semibold text-white' 
                    : 'hover:bg-yellow-600 text-white'
                }`}
                onClick={onClose}
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
                  currentPath === item.path 
                    ? 'bg-yellow-600 font-semibold text-white' 
                    : 'hover:bg-yellow-600 text-white'
                }`}
                onClick={onClose}
              >
                {item.name}
              </Link>
            </li>
          ))}
          
          <li>
            <button 
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="block w-full text-left py-3 px-4 text-base text-white hover:bg-yellow-600 transition-colors"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
