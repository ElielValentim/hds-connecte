
import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon?: ReactNode;
}

// Define nav items for better organization
export const navItems: NavItem[] = [
  { name: 'Início', path: '/' },
  { name: 'Meu Perfil', path: '/profile' },
  { name: 'Cadastro', path: '/registration' },
  { name: 'Gincana', path: '/challenge' },
  { name: 'Vídeos', path: '/videos' },
  { name: 'Notificações', path: '/notifications' },
  { name: 'Equipes', path: '/teams' },
];

// Get admin items based on user role
export const getAdminItems = (role?: string): NavItem[] => {
  if (!role) return [];
  
  const adminItems: NavItem[] = [];
  
  if (role === 'dev-admin') {
    adminItems.push({ name: 'Dev Admin', path: '/dev-admin' });
  } else if (role === 'admin') {
    adminItems.push({ name: 'Admin', path: '/admin' });
  }
  
  return adminItems;
};
