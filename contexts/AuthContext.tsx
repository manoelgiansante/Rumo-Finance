import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { CrossAppService, CrossAppSubscription } from '@/lib/crossApp';

// =====================================================
// AUTH CONTEXT - Rumo Finance
// Gerencia autenticação e assinatura do usuário
// =====================================================

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  subscription: CrossAppSubscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  hasOperacionalBonus: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  skipLogin: () => Promise<void>;
  activateSubscription: (plan: 'basic' | 'intermediate' | 'premium') => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@rumo_finance_user',
  SKIPPED_LOGIN: '@rumo_finance_skipped_login',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<CrossAppSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [skippedLogin, setSkippedLogin] = useState(false);

  // Carregar estado inicial
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Carregar assinatura quando user mudar
  useEffect(() => {
    if (user?.email) {
      loadSubscription(user.email);
    } else {
      setSubscription(null);
    }
  }, [user?.email]);

  const loadStoredUser = async () => {
    try {
      const [storedUser, skipped] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.SKIPPED_LOGIN),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (skipped === 'true') {
        setSkippedLogin(true);
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubscription = async (email: string) => {
    const sub = await CrossAppService.getSubscriptionStatus(email);
    setSubscription(sub);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const newUser: User = {
        id: data.user?.id || email,
        email: data.user?.email || email,
        name: data.user?.user_metadata?.name,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      await AsyncStorage.removeItem(STORAGE_KEYS.SKIPPED_LOGIN);
      
      setUser(newUser);
      setSkippedLogin(false);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Login simplificado apenas com email (sem senha)
      // Para app de uso simples onde não precisa de autenticação forte
      const newUser: User = {
        id: email,
        email: email,
        name: email.split('@')[0],
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      await AsyncStorage.removeItem(STORAGE_KEYS.SKIPPED_LOGIN);
      
      setUser(newUser);
      setSkippedLogin(false);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.SKIPPED_LOGIN]);
      setUser(null);
      setSubscription(null);
      setSkippedLogin(false);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const skipLogin = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.SKIPPED_LOGIN, 'true');
    setSkippedLogin(true);
    setIsLoading(false);
  };

  const activateSubscription = async (plan: 'basic' | 'intermediate' | 'premium'): Promise<boolean> => {
    if (!user?.email) return false;
    
    const success = await CrossAppService.activateFinanceSubscription(user.email, plan);
    
    if (success) {
      await loadSubscription(user.email);
    }
    
    return success;
  };

  const refreshSubscription = async () => {
    if (user?.email) {
      await loadSubscription(user.email);
    }
  };

  const isPremium = subscription 
    ? subscription.rumoFinancePlan === 'premium' || subscription.rumoFinancePlan === 'intermediate'
    : false;

  const hasOperacionalBonus = subscription?.hasBonus || false;

  const value: AuthContextValue = {
    user,
    subscription,
    isLoading,
    isAuthenticated: !!user || skippedLogin,
    isPremium,
    hasOperacionalBonus,
    login,
    loginWithEmail,
    logout,
    skipLogin,
    activateSubscription,
    refreshSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
