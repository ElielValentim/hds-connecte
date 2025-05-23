
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavItem } from './navItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopNavProps {
  navItems: NavItem[];
  adminItems: NavItem[];
  currentPath: string;
}

const DesktopNav = ({ navItems, adminItems, currentPath }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPath === item.path 
              ? 'bg-yellow-600 text-white' 
              : 'text-white hover:bg-yellow-600'
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
              className="text-white border-yellow-400 bg-yellow-600 hover:bg-yellow-700"
            >
              Admin <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-yellow-500">
            {adminItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className="w-full text-white hover:bg-yellow-600">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DesktopNav;
