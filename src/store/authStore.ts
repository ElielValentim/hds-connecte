import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export type UserRole = 'user' | 'admin' | 'dev-admin';

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
}

interface Profile {
  id: string;
  name: string;
  phone?: string;
  church?: string;
  responsible_pastor?: string;
  photo_url?: string;
}

interface CompanyInfo {
  name: string;
  logo: string;
  contactLink: string;
}

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  companyInfo: CompanyInfo;
  
  // Actions
  signInWithGoogle: () => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<Profile>) => Promise<boolean>;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

// Function to map Supabase user to our User interface
const mapSupabaseUser = (supabaseUser: SupabaseUser | null, profile: Profile | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.email?.split('@')[0] || '',
    photoURL: profile?.photo_url,
    role: supabaseUser.email === 'elielvalentim.dev@gmail.com' ? 'dev-admin' : 'user'
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      companyInfo: {
        name: 'ValenSoft Desenvolvimento',
        logo: '/placeholder.svg',
        contactLink: 'https://valensoft.com',
      },

      refreshSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { user: supabaseUser } = session;
            
            // Fetch profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .maybeSingle();
            
            set({
              session,
              supabaseUser,
              profile: profileData || null,
              user: mapSupabaseUser(supabaseUser, profileData),
              isAuthenticated: true
            });
            
            console.log('Session refreshed successfully:', {
              user: supabaseUser.email,
              isAuthenticated: true
            });
          } else {
            console.log('No active session found');
            set({
              session: null,
              supabaseUser: null,
              profile: null,
              user: null,
              isAuthenticated: false
            });
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      },
      
      signInWithGoogle: async () => {
        set({ isLoading: true });
        
        try {
          console.log('Attempting login with Google');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/login`,
            }
          });
          
          if (error) {
            console.error('Google login error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          
          // For OAuth, we don't need to set session here as it will be handled by the redirect
          console.log('Google authentication initiated:', data);
          
          return { success: true };
        } catch (error: any) {
          console.error('Google login error:', error);
          set({ isLoading: false });
          return { success: false, error: error?.message || 'Falha ao fazer login com Google. Por favor, tente novamente.' };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await supabase.auth.signOut();
          
          set({
            user: null,
            supabaseUser: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false
          });
          
          toast.success('Logout realizado com sucesso');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Falha ao fazer logout. Por favor, tente novamente.');
          set({ isLoading: false });
        }
      },
      
      updateProfile: async (userData: Partial<Profile>) => {
        set({ isLoading: true });
        const { supabaseUser, profile } = get();
        
        if (!supabaseUser) {
          toast.error('Usuário não autenticado');
          set({ isLoading: false });
          return false;
        }
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', supabaseUser.id);
          
          if (error) {
            toast.error(error.message);
            set({ isLoading: false });
            return false;
          }
          
          const updatedProfile = {
            ...profile,
            ...userData
          } as Profile;
          
          set({
            profile: updatedProfile,
            user: mapSupabaseUser(supabaseUser, updatedProfile),
            isLoading: false
          });
          
          toast.success('Perfil atualizado com sucesso');
          return true;
        } catch (error) {
          console.error('Profile update error:', error);
          toast.error('Falha ao atualizar perfil. Por favor, tente novamente.');
          set({ isLoading: false });
          return false;
        }
      },
      
      updateCompanyInfo: async (data: Partial<CompanyInfo>) => {
        set({ isLoading: true });
        const currentUser = get().user;
        
        if (!currentUser || currentUser.role !== 'dev-admin') {
          toast.error('Acesso não autorizado');
          set({ isLoading: false });
          return false;
        }
        
        try {
          // In a real implementation, this would be saved to Supabase
          set({
            companyInfo: {
              ...get().companyInfo,
              ...data
            },
            isLoading: false
          });
          
          toast.success('Informações da empresa atualizadas com sucesso');
          return true;
        } catch (error) {
          console.error('Company info update error:', error);
          toast.error('Falha ao atualizar informações da empresa. Por favor, tente novamente.');
          set({ isLoading: false });
          return false;
        }
      }
    }),
    {
      name: 'hds-conecte-auth'
    }
  )
);

// Initialize auth state on app load
const initializeAuth = async () => {
  console.log('Initializing auth state...');
  const { refreshSession } = useAuthStore.getState();
  await refreshSession();

  // Set up auth state listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);
    await refreshSession();
  });
};

initializeAuth();
