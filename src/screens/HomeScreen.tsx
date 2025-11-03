/**
 * ホーム画面（モーダルベース）
 *
 * 機能:
 * - カメラボタン
 * - タイムラインへのアクセス
 * - 統計情報の表示（訪問国数、総写真数）
 */

import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../database/DatabaseService';
import { useAuth } from '../contexts/AuthContext';
import syncService, { SyncStatus } from '../services/SyncService';

interface HomeScreenProps {
  onCameraPress: () => void;
  onTimelinePress: () => void;
  onCountriesPress: () => void;
  onTripsPress: () => void;
}

export default function HomeScreen({ onCameraPress, onTimelinePress, onCountriesPress, onTripsPress }: HomeScreenProps) {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    experienceCount: 0,
    countryCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState<string>('');

  useEffect(() => {
    appLoadStats();

    // 同期状態を監視
    const unsubscribe = syncService.onStatusChange((status, progress) => {
      setSyncStatus(status);
      setSyncProgress(progress || '');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 統計情報を読み込む
  const appLoadStats = async () => {
    try {
      const experiences = await db.appGetExperiences();
      const countries = await db.appGetVisitedCountries();

      setStats({
        experienceCount: experiences.length,
        countryCount: countries.length,
      });
    } catch (error) {
      console.error('統計情報の読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 同期を実行
  const handleSync = async () => {
    if (!user) return;

    try {
      const result = await syncService.syncAll(user.id);

      if (result.success) {
        Alert.alert(
          '同期完了',
          `アップロード: ${result.uploadedCount}件\nダウンロード: ${result.downloadedCount}件`
        );
        // 統計情報を再読み込み
        await appLoadStats();
      } else {
        Alert.alert('同期エラー', result.error || '同期に失敗しました');
      }
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('同期エラー', '同期に失敗しました');
    }
  };

  // サインアウト
  const handleSignOut = () => {
    Alert.alert(
      'サインアウト',
      'サインアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'サインアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('エラー', 'サインアウトに失敗しました');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={48} color="#3388ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-500">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <View className="pt-16 pb-8 px-6">
          {/* ユーザー情報とサインアウト */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-sm opacity-80">
                {user?.email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-white/20 rounded-full px-3 py-1"
            >
              <Text className="text-white text-sm">サインアウト</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-white text-2xl font-bold mb-2 text-center">
            Experience the World
          </Text>
          <Text className="text-secondary-500 text-lg text-center">
            瞬間を捉える、体験が蘇る
          </Text>

          {/* 同期ボタン */}
          <View className="mt-4">
            <TouchableOpacity
              onPress={handleSync}
              disabled={syncStatus === 'syncing'}
              className={`flex-row items-center justify-center rounded-full py-2 px-4 ${
                syncStatus === 'syncing' ? 'bg-white/30' : 'bg-white/20'
              }`}
            >
              {syncStatus === 'syncing' ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white ml-2 text-sm">{syncProgress}</Text>
                </>
              ) : syncStatus === 'success' ? (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <Text className="text-white ml-2 text-sm">同期完了</Text>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <Ionicons name="alert-circle" size={18} color="white" />
                  <Text className="text-white ml-2 text-sm">同期エラー</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={18} color="white" />
                  <Text className="text-white ml-2 text-sm">クラウドに同期</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 統計カード */}
        <View className="px-6 mb-12">
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="flex-row justify-around">
              {/* 体験数 */}
              <View className="items-center">
                <Ionicons name="camera-outline" size={32} color="#3388ff" />
                <Text className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.experienceCount}
                </Text>
                <Text className="text-gray-600 text-sm">思い出</Text>
              </View>

              {/* 訪問国数 */}
              <View className="items-center">
                <Ionicons name="earth-outline" size={32} color="#3388ff" />
                <Text className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.countryCount}
                </Text>
                <Text className="text-gray-600 text-sm">訪問国</Text>
              </View>
            </View>
          </View>
        </View>

        {/* メインボタン */}
        <View className="px-6">
          {/* カメラボタン */}
          <Pressable
            className="bg-white rounded-2xl py-6 px-8 mb-4 shadow-lg active:opacity-80"
            onPress={onCameraPress}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="camera" size={32} color="#3388ff" />
              <Text className="text-primary-500 text-2xl font-bold ml-4">
                写真を撮る
              </Text>
            </View>
            <Text className="text-gray-600 text-center mt-2">
              新しい体験を記録しましょう
            </Text>
          </Pressable>

          {/* タイムラインボタン */}
          <Pressable
            className="bg-white rounded-2xl py-6 px-8 mb-4 shadow-lg active:opacity-80"
            onPress={onTimelinePress}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="time-outline" size={32} color="#3388ff" />
              <Text className="text-primary-500 text-2xl font-bold ml-4">
                タイムライン
              </Text>
            </View>
            <Text className="text-gray-600 text-center mt-2">
              {stats.experienceCount > 0
                ? '思い出を振り返る'
                : 'まだ記録がありません'}
            </Text>
          </Pressable>

          {/* 訪問国ボタン */}
          <Pressable
            className="bg-white rounded-2xl py-6 px-8 mb-4 shadow-lg active:opacity-80"
            onPress={onCountriesPress}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="earth" size={32} color="#3388ff" />
              <Text className="text-primary-500 text-2xl font-bold ml-4">
                訪問国
              </Text>
            </View>
            <Text className="text-gray-600 text-center mt-2">
              {stats.countryCount > 0
                ? `${stats.countryCount}ヶ国を訪問`
                : 'まだ訪問国がありません'}
            </Text>
          </Pressable>

          {/* 旅行ボタン */}
          <Pressable
            className="bg-white rounded-2xl py-6 px-8 mb-4 shadow-lg active:opacity-80"
            onPress={onTripsPress}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="airplane" size={32} color="#3388ff" />
              <Text className="text-primary-500 text-2xl font-bold ml-4">
                旅行
              </Text>
            </View>
            <Text className="text-gray-600 text-center mt-2">
              旅行ごとに体験を整理
            </Text>
          </Pressable>
        </View>

        {/* フッター */}
        <View className="pt-8 px-6">
          <Text className="text-primary-100 text-center text-sm">
            Phase 2 - クラウド同期対応
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
