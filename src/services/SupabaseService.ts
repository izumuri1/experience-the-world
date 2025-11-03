/**
 * Supabaseクライアント初期化サービス
 *
 * 機能:
 * - Supabaseクライアントのシングルトンインスタンス提供
 * - 環境変数からURL・APIキーを読み込み
 * - 認証状態の監視
 */

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// 環境変数の型定義
interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig | null = null;

  /**
   * Supabaseクライアントを初期化
   */
  initialize(): SupabaseClient {
    if (this.client) {
      return this.client;
    }

    // 環境変数から設定を取得
    const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
                        process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
                            process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or Anon Key is not defined in environment variables');
    }

    this.config = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    };

    // Supabaseクライアントを作成
    this.client = createClient(this.config.url, this.config.anonKey, {
      auth: {
        // React Nativeではセッション永続化にAsyncStorageを使用
        storage: undefined, // デフォルトのlocalStorageは使えないため、後でカスタム実装
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    console.log('[SupabaseService] Initialized successfully');
    return this.client;
  }

  /**
   * Supabaseクライアントを取得
   */
  getClient(): SupabaseClient {
    if (!this.client) {
      return this.initialize();
    }
    return this.client;
  }

  /**
   * 現在のセッションを取得
   */
  async getSession(): Promise<Session | null> {
    const client = this.getClient();
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.error('[SupabaseService] Failed to get session:', error);
      return null;
    }

    return data.session;
  }

  /**
   * 現在のユーザーを取得
   */
  async getUser(): Promise<User | null> {
    const session = await this.getSession();
    return session?.user || null;
  }

  /**
   * 認証状態の変化を監視
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    const client = this.getClient();

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        console.log('[SupabaseService] Auth state changed:', event);
        callback(session);
      }
    );

    return subscription;
  }

  /**
   * サインアップ（メールアドレス + パスワード）
   */
  async signUp(email: string, password: string) {
    const client = this.getClient();

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('[SupabaseService] Sign up failed:', error);
      console.error('[SupabaseService] Error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
      });
      throw error;
    }

    console.log('[SupabaseService] Sign up successful');
    return data;
  }

  /**
   * サインイン（メールアドレス + パスワード）
   */
  async signIn(email: string, password: string) {
    const client = this.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[SupabaseService] Sign in failed:', error);
      throw error;
    }

    console.log('[SupabaseService] Sign in successful');
    return data;
  }

  /**
   * サインアウト
   */
  async signOut() {
    const client = this.getClient();

    const { error } = await client.auth.signOut();

    if (error) {
      console.error('[SupabaseService] Sign out failed:', error);
      throw error;
    }

    console.log('[SupabaseService] Sign out successful');
  }

  /**
   * パスワードリセットメール送信
   */
  async resetPassword(email: string) {
    const client = this.getClient();

    const { error } = await client.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('[SupabaseService] Password reset failed:', error);
      throw error;
    }

    console.log('[SupabaseService] Password reset email sent');
  }

  /**
   * プロフィール作成または更新
   */
  async upsertProfile(userId: string, profile: {
    email?: string;
    display_name?: string;
    avatar_url?: string;
  }) {
    const client = this.getClient();

    const { data, error } = await client
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
      })
      .select()
      .single();

    if (error) {
      console.error('[SupabaseService] Profile upsert failed:', error);
      throw error;
    }

    console.log('[SupabaseService] Profile upserted successfully');
    return data;
  }

  /**
   * プロフィール取得
   */
  async getProfile(userId: string) {
    const client = this.getClient();

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[SupabaseService] Failed to get profile:', error);
      throw error;
    }

    return data;
  }
}

// シングルトンインスタンス
export const supabaseService = new SupabaseService();
export default supabaseService;
