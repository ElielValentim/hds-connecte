
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import BottomNav from '@/components/navigation/BottomNav';
import { useAuthStore } from '@/store/authStore';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AppLayout = ({ children, requireAuth = true }: AppLayoutProps) => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 pb-28 pt-4"> {/* Increased bottom padding to prevent overlap */}
        <div className="app-container container-padding">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
