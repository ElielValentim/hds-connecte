
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type UserRole = 'user' | 'admin' | 'dev-admin';

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
}

interface CompanyInfo {
  name: string;
  logo: string;
  contactLink: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  companyInfo: CompanyInfo;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<boolean>;
}

// Mock implementation - would be replaced with Firebase in a real implementation
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      companyInfo: {
        name: 'ValenSoft Desenvolvimento',
        logo: '/placeholder.svg',
        contactLink: 'https://valensoft.com',
      },
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if it's the dev admin account
          if (email === 'elielvalentim.dev@gmail.com' && password === 'Eliel2003!') {
            set({
              user: {
                id: 'dev-admin-id',
                email,
                name: 'Dev Admin',
                role: 'dev-admin'
              },
              isAuthenticated: true,
              isLoading: false
            });
            toast.success('Login successful!');
            return true;
          }
          
          // For demo, allow any login with password length >= 6
          if (password.length >= 6) {
            set({
              user: {
                id: `user-${Date.now()}`,
                email,
                name: email.split('@')[0],
                role: 'user'
              },
              isAuthenticated: true,
              isLoading: false
            });
            toast.success('Login successful!');
            return true;
          }
          
          toast.error('Invalid credentials');
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Failed to login. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (password.length >= 6) {
            set({
              user: {
                id: `user-${Date.now()}`,
                email,
                name,
                role: 'user'
              },
              isAuthenticated: true,
              isLoading: false
            });
            toast.success('Account created successfully!');
            return true;
          }
          
          toast.error('Password must be at least 6 characters');
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Signup error:', error);
          toast.error('Failed to create account. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
        toast.success('Logged out successfully');
      },
      
      recoverPassword: async (email: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          toast.success('Recovery email sent. Please check your inbox.');
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Password recovery error:', error);
          toast.error('Failed to send recovery email. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true });
        const currentUser = get().user;
        
        if (!currentUser) {
          toast.error('User not authenticated');
          set({ isLoading: false });
          return false;
        }
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            user: {
              ...currentUser,
              ...userData
            },
            isLoading: false
          });
          
          toast.success('Profile updated successfully');
          return true;
        } catch (error) {
          console.error('Profile update error:', error);
          toast.error('Failed to update profile. Please try again.');
          set({ isLoading: false });
          return false;
        }
      },
      
      updateCompanyInfo: async (data: Partial<CompanyInfo>) => {
        set({ isLoading: true });
        const currentUser = get().user;
        
        if (!currentUser || currentUser.role !== 'dev-admin') {
          toast.error('Unauthorized access');
          set({ isLoading: false });
          return false;
        }
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            companyInfo: {
              ...get().companyInfo,
              ...data
            },
            isLoading: false
          });
          
          toast.success('Company information updated successfully');
          return true;
        } catch (error) {
          console.error('Company info update error:', error);
          toast.error('Failed to update company information. Please try again.');
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
