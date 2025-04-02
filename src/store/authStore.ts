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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  recoverPassword: (email: string) => Promise<boolean>;
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
              .single();
            
            set({
              session,
              supabaseUser,
              profile: profileData || null,
              user: mapSupabaseUser(supabaseUser, profileData),
              isAuthenticated: true
            });
          } else {
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
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            toast.error(error.message);
            set({ isLoading: false });
            return false;
          }
          
          const { session, user: supabaseUser } = data;
          
          // Fetch profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
          
          set({
            session,
            supabaseUser,
            profile: profileData || null,
            user: mapSupabaseUser(supabaseUser, profileData),
            isAuthenticated: true,
            isLoading: false
          });
          
          toast.success('Login realizado com sucesso!');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Falha ao fazer login. Por favor, tente novamente.');
          set({ isLoading: false });
          return false;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name
              },
              // No emailRedirectTo option here, as we don't want email confirmation
            }
          });
          
          if (error) {
            toast.error(error.message);
            set({ isLoading: false });
            return false;
          }
          
          const { session, user: supabaseUser } = data;
          
          if (supabaseUser) {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({ 
                id: supabaseUser.id, 
                name 
              });
              
            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
          }
          
          // Immediately log the user in
          if (session) {
            set({
              session,
              supabaseUser,
              profile: { id: supabaseUser?.id || '', name },
              user: mapSupabaseUser(supabaseUser, { id: supabaseUser?.id || '', name }),
              isAuthenticated: true,
              isLoading: false
            });
            
            toast.success('Conta criada com sucesso! Você está logado.');
            return true;
          } else {
            // If we still don't have a session, try to log in manually
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (loginError) {
              toast.error('Conta criada, mas não foi possível fazer login automaticamente. Por favor, faça login manualmente.');
              set({ isLoading: false });
              return true; // Return true because the account was created
            }
            
            set({
              session: loginData.session,
              supabaseUser: loginData.user,
              profile: { id: loginData.user?.id || '', name },
              user: mapSupabaseUser(loginData.user, { id: loginData.user?.id || '', name }),
              isAuthenticated: true,
              isLoading: false
            });
            
            toast.success('Conta criada com sucesso! Você está logado.');
            return true;
          }
        } catch (error) {
          console.error('Signup error:', error);
          toast.error('Falha ao criar conta. Por favor, tente novamente.');
          set({ isLoading: false });
          return false;
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
      
      recoverPassword: async (email: string) => {
        set({ isLoading: true });
        
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          
          if (error) {
            toast.error(error.message);
            set({ isLoading: false });
            return false;
          }
          
          toast.success('Email de recuperação enviado. Por favor, verifique sua caixa de entrada.');
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Password recovery error:', error);
          toast.error('Falha ao enviar email de recuperação. Por favor, tente novamente.');
          set({ isLoading: false });
          return false;
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
  const { refreshSession } = useAuthStore.getState();
  await refreshSession();

  // Set up auth state listener
  supabase.auth.onAuthStateChange(async () => {
    await refreshSession();
  });
};

initializeAuth();
