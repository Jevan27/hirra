import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api/client';

export type OAuthProvider = 'google' | 'linkedin_oidc';

export interface AuthUser {
  uid: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  profileCompleted?: boolean;
  profile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authError: string | null;
  connectingProvider: OAuthProvider | null;
  openAuthModal: (options?: { returnUrl?: string }) => void;
  closeAuthModal: () => void;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const RETURN_URL_KEY = 'hirra_auth_return_url';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<OAuthProvider | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const syncUserWithBackend = useCallback(async (token: string): Promise<AuthUser | null> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          uid: string;
          email: string;
          role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
          profile?: any;
        };
      }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && response.data?.data) {
        const { uid, email, role, profile } = response.data.data;
        return {
          uid,
          email,
          role: role || 'CANDIDATE',
          firstName: profile?.firstName || null,
          lastName: profile?.lastName || null,
          avatarUrl: profile?.avatarUrl || null,
          profileCompleted: Boolean(profile?.profileCompleted),
          profile,
        };
      }
    } catch (err: any) {
      console.warn('[AuthContext] Backend sync fallback to Supabase session metadata:', err?.message);
    }
    return null;
  }, []);

  const refreshUserData = useCallback(async (currentSession: Session | null, forceSync = true) => {
    if (!currentSession?.access_token || !currentSession.user) {
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      setIsLoading(false);
      return;
    }

    setSession(currentSession);
    setSupabaseUser(currentSession.user);

    // Only hit the backend if this is a real auth event (sign in, initial load, explicit refresh)
    // Skip for TOKEN_REFRESHED to avoid flooding the backend on every tab focus
    if (forceSync) {
      const backendUser = await syncUserWithBackend(currentSession.access_token);

      if (backendUser) {
        setUser(backendUser);
      } else {
        // Graceful fallback if backend is momentarily unreachable
        const meta = currentSession.user.user_metadata || {};
        setUser({
          uid: currentSession.user.id,
          email: currentSession.user.email || '',
          role: meta.role || 'CANDIDATE',
          firstName: meta.first_name || meta.given_name || meta.name || null,
          lastName: meta.last_name || meta.family_name || null,
          avatarUrl: meta.avatar_url || meta.picture || null,
        });
      }
    }

    setIsLoading(false);
  }, [syncUserWithBackend]);

  useEffect(() => {
    let mounted = true;

    // Check active session on mount (this IS a real auth event — sync with backend)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        refreshUserData(initialSession, true);
      }
    });

    // Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        // Full reset
        startTransition(() => {
          refreshUserData(null, true);
        });
      } else if (event === 'SIGNED_IN') {
        // Real sign-in — sync with backend
        startTransition(() => {
          refreshUserData(newSession, true);
        });
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refresh on tab focus — just update session reference silently
        // Do NOT call backend again; keep existing user data
        startTransition(() => {
          if (newSession) {
            setSession(newSession);
            setSupabaseUser(newSession.user);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  const openAuthModal = (options?: { returnUrl?: string }) => {
    if (options?.returnUrl) {
      try {
        sessionStorage.setItem(RETURN_URL_KEY, options.returnUrl);
      } catch {
        // fallback ignore
      }
    }
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    if (!connectingProvider) {
      setIsAuthModalOpen(false);
      setAuthError(null);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    try {
      setConnectingProvider(provider);
      setAuthError(null);

      const callbackUrl = `${window.location.origin}/auth/callback`;

      const options: {
        redirectTo: string;
        queryParams?: Record<string, string>;
      } = {
        redirectTo: callbackUrl,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      };

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      });

      if (error) {
        setAuthError(error.message || `Failed to initialize ${provider} login.`);
        setConnectingProvider(null);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during login initialization.');
      setConnectingProvider(null);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    await refreshUserData(currentSession);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        isAuthModalOpen,
        authError,
        connectingProvider,
        openAuthModal,
        closeAuthModal,
        signInWithOAuth,
        signOut,
        clearAuthError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
