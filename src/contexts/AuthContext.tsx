import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabaseService from '../services/SupabaseService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回セッション取得
    initializeAuth();

    // 認証状態の変更を監視
    const subscription = supabaseService.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const currentSession = await supabaseService.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (error) {
      console.error('[AuthContext] Failed to initialize auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await supabaseService.signUp(email, password);

      // プロファイル作成（Supabase側でトリガーで自動作成されるため、一時的にコメントアウト）
      // if (newUser) {
      //   await supabaseService.upsertProfile(newUser.id, {
      //     email,
      //     display_name: email.split('@')[0], // デフォルトはメールアドレスのローカル部分
      //   });
      // }

      setUser(newUser);
      setSession(newSession);
    } catch (error) {
      console.error('[AuthContext] Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: signedInUser, session: newSession } = await supabaseService.signIn(email, password);
      setUser(signedInUser);
      setSession(newSession);
    } catch (error) {
      console.error('[AuthContext] Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('[AuthContext] Sign out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await supabaseService.resetPassword(email);
    } catch (error) {
      console.error('[AuthContext] Password reset failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
