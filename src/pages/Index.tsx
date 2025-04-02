
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, refreshSession } = useAuthStore();
  
  useEffect(() => {
    // Only attempt to refresh the session once
    const checkAuth = async () => {
      await refreshSession();
      
      // After refreshing, check authentication status
      if (!isLoading) {
        if (isAuthenticated) {
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    };
    
    checkAuth();
  }, [isLoading, isAuthenticated, navigate, refreshSession]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">HDS CONECTE</h1>
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-lg text-muted-foreground mt-4">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
