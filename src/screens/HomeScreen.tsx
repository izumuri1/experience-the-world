/**
 * ホーム画面（モーダルベース）
 *
 * 機能:
 * - カメラボタン
 * - タイムラインへのアクセス
 * - 統計情報の表示（訪問国数、総写真数）
 */

import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../database/DatabaseService';

interface HomeScreenProps {
  onCameraPress: () => void;
  onTimelinePress: () => void;
}

export default function HomeScreen({ onCameraPress, onTimelinePress }: HomeScreenProps) {
  const [stats, setStats] = useState({
    experienceCount: 0,
    countryCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appLoadStats();
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

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={48} color="#3388ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-500">
      {/* ヘッダー */}
      <View className="pt-16 pb-8 px-6">
        <Text className="text-white text-2xl font-bold mb-2 text-center">
          Experience the World
        </Text>
        <Text className="text-secondary-500 text-lg text-center">
          瞬間を捉える、体験が蘇る
        </Text>
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
      <View className="flex-1 px-6 justify-center">
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
          className="bg-white rounded-2xl py-6 px-8 shadow-lg active:opacity-80"
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
      </View>

      {/* フッター */}
      <View className="pb-8 px-6">
        <Text className="text-primary-100 text-center text-sm">
          Phase 1 MVP - ローカルストレージ版
        </Text>
      </View>
    </View>
  );
}
