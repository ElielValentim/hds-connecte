
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
  signInWithEmail: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signInWithGoogle: () => Promise<{success: boolean, error?: string}>;
  signup: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  recoverPassword: (email: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<Profile>) => Promise<boolean>;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

// Function to map Supabase user to our User interface
const mapSupabaseUser = (supabaseUser: SupabaseUser | null, profile: Profile | null): User | null => {
  if (!supabaseUser) return null;
  
  // Check for admin email - we'll consider these emails as admins
  const adminEmails = [
    'elielvalentim.dev@gmail.com',
    'hdsoficial2022@gmail.com'  // Added the new admin email
  ];
  
  const role = adminEmails.includes(supabaseUser.email || '') ? 'dev-admin' : 'user';
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.email?.split('@')[0] || '',
    photoURL: profile?.photo_url,
    role: role
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
      isLoading: true,
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
              isAuthenticated: true,
              isLoading: false
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
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
          set({ isLoading: false });
        }
      },
      
      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          console.log('Attempting login with email and password');
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            console.error('Email login error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          
          const { session, user: supabaseUser } = data;
          
          // Fetch profile data if user was authenticated successfully
          if (supabaseUser) {
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
              isAuthenticated: true,
              isLoading: false
            });
          }
          
          console.log('Email login successful:', supabaseUser?.email);
          return { success: true };
        } catch (error: any) {
          console.error('Email login error:', error);
          set({ isLoading: false });
          return { success: false, error: error?.message || 'Falha ao fazer login. Por favor, tente novamente.' };
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
      
      signup: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          console.log('Attempting signup with email and password');
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) {
            console.error('Signup error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          
          if (data.user) {
            toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
          } else {
            toast.info('Por favor, verifique seu email para confirmar seu cadastro.');
          }
          
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          console.error('Signup error:', error);
          set({ isLoading: false });
          return { success: false, error: error?.message || 'Falha ao criar conta. Por favor, tente novamente.' };
        }
      },
      
      recoverPassword: async (email: string) => {
        set({ isLoading: true });
        
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          
          if (error) {
            console.error('Password recovery error:', error.message);
            toast.error(error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          
          toast.success('Email de recuperação enviado. Por favor, verifique sua caixa de entrada.');
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          console.error('Password recovery error:', error);
          set({ isLoading: false });
          return { success: false, error: error?.message || 'Falha ao enviar email de recuperação. Por favor, tente novamente.' };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Clear state first to prevent UI flashing
          set({
            user: null,
            supabaseUser: null,
            session: null,
            profile: null,
            isAuthenticated: false
          });
          
          // Then sign out from Supabase authentication
          await supabase.auth.signOut({ scope: 'global' });
          
          // Show success message
          toast.success('Logout realizado com sucesso');
          
          // Complete the loading state
          set({ isLoading: false });
          
          // Redirect after toast displays
          setTimeout(() => {
            window.location.href = '/login';
          }, 800);
          
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

// Function to initialize auth that can be called from components
export const initializeAuth = async () => {
  console.log('Initializing auth state...');
  const { refreshSession } = useAuthStore.getState();
  
  try {
    // First refresh the session to get the current state
    await refreshSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        // Immediately update the state when user signs out
        useAuthStore.setState({
          user: null,
          supabaseUser: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false
        });
      } else {
        // For other events, refresh the session
        await refreshSession();
      }
    });
    
    // Return the cleanup function
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    // Make sure isLoading is set to false in case of error
    useAuthStore.setState({ isLoading: false });
  }
};
