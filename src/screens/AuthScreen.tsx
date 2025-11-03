import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../utils/validation';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function AuthScreen() {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // デバッグ用：モードが変更されたときにログ出力
  const handleModeChange = (newMode: AuthMode) => {
    console.log(`[AuthScreen] Mode changed from ${mode} to ${newMode}`);
    setMode(newMode);
  };

  const handleSubmit = async () => {
    // メールアドレスのバリデーション
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert('入力エラー', emailValidation.error!);
      return;
    }

    if (mode === 'reset') {
      // パスワードリセット
      try {
        await resetPassword(email.trim());
        Alert.alert(
          '送信完了',
          'パスワードリセット用のメールを送信しました。メールをご確認ください。',
          [{ text: 'OK', onPress: () => handleModeChange('signin') }]
        );
      } catch (error: any) {
        Alert.alert('エラー', error.message || 'パスワードリセットに失敗しました');
      }
      return;
    }

    // パスワードのバリデーション
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('入力エラー', passwordValidation.error!);
      return;
    }

    if (mode === 'signup') {
      // パスワード確認のバリデーション
      const passwordConfirmValidation = validatePasswordConfirmation(password, confirmPassword);
      if (!passwordConfirmValidation.isValid) {
        Alert.alert('入力エラー', passwordConfirmValidation.error!);
        return;
      }

      try {
        await signUp(email.trim(), password);
        Alert.alert(
          'アカウント作成完了',
          'アカウントが作成されました。確認メールを送信しましたので、メールアドレスを確認してください。'
        );
      } catch (error: any) {
        let errorMessage = error.message || 'アカウント作成に失敗しました';

        // メールアドレスのフォーマットエラーの場合、よりわかりやすいメッセージに
        if (error.message?.includes('Unable to validate email address')) {
          errorMessage = 'このメールアドレスは使用できません。別のメールアドレスをお試しください。';
        }

        Alert.alert('エラー', errorMessage);
      }
    } else {
      try {
        await signIn(email.trim(), password);
      } catch (error: any) {
        Alert.alert('エラー', error.message || 'サインインに失敗しました');
      }
    }
  };

  const renderSignIn = () => {
    console.log('[AuthScreen] Rendering SignIn form');
    return (
      <>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            メールアドレス
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            パスワード
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 8,
          }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="パスワード"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
              }}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-lg py-4 mb-4 ${loading ? 'bg-secondary-300' : 'bg-secondary-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-base">
              サインイン
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mb-4">
          <TouchableOpacity onPress={() => handleModeChange('reset')}>
            <Text className="text-primary-500 text-sm">
              パスワードを忘れた場合
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600 text-sm mr-2">アカウントをお持ちでない方</Text>
          <TouchableOpacity onPress={() => handleModeChange('signup')}>
            <Text className="text-primary-500 text-sm font-bold">新規登録</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderSignUp = () => {
    console.log('[AuthScreen] Rendering SignUp form');
    return (
      <>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            メールアドレス
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            パスワード（6文字以上）
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 8,
          }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="パスワード"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
              }}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            パスワード（確認）
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="パスワードを再入力"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-lg py-4 mb-4 ${loading ? 'bg-secondary-300' : 'bg-secondary-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-base">
              アカウント作成
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600 text-sm mr-2">すでにアカウントをお持ちの方</Text>
          <TouchableOpacity onPress={() => handleModeChange('signin')}>
            <Text className="text-primary-500 text-sm font-bold">サインイン</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderReset = () => {
    console.log('[AuthScreen] Rendering Reset form');
    return (
      <>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
            メールアドレス
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholderTextColor="#9CA3AF"
          />
          <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 8 }}>
            パスワードリセット用のリンクをメールで送信します
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-lg py-4 mb-4 ${loading ? 'bg-secondary-300' : 'bg-secondary-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-base">
              リセットメールを送信
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center">
          <TouchableOpacity onPress={() => handleModeChange('signin')}>
            <Text className="text-primary-500 text-sm">サインイン画面に戻る</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  // デバッグ用：現在のモードをログ出力
  console.log('[AuthScreen] Current mode:', mode);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary-500"
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: 48, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <View className="items-center mb-8">
          <View className="bg-white/20 rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="earth" size={40} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2 text-center">
            Experience the World
          </Text>
          <Text className="text-secondary-500 text-lg text-center">
            {mode === 'signin' && 'アカウントにサインイン'}
            {mode === 'signup' && 'アカウントを新規作成'}
            {mode === 'reset' && 'パスワードをリセット'}
          </Text>
        </View>

        {/* フォームエリア */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {mode === 'signin' && renderSignIn()}
          {mode === 'signup' && renderSignUp()}
          {mode === 'reset' && renderReset()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
