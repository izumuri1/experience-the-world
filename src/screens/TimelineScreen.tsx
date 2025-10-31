import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExperienceCard from '../components/ExperienceCard';
import { db } from '../database/DatabaseService';
import type { Experience } from '../types/models';

interface TimelineScreenProps {
  onExperiencePress: (experience: Experience) => void;
  onClose: () => void;
}

/**
 * タイムライン画面
 *
 * 機能:
 * - DBからExperience一覧を時系列で取得
 * - FlatListで表示
 * - ExperienceCardをタップすると詳細画面へ
 */
export default function TimelineScreen({
  onExperiencePress,
  onClose,
}: TimelineScreenProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // 体験記録を読み込む
  const appLoadExperiences = async () => {
    try {
      setLoading(true);
      const data = await db.appGetExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('体験記録の読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };
  // 初回読み込み
  useEffect(() => {
    appLoadExperiences();
  }, []);

  // 日付セパレーター
  const appRenderDateSeparator = (date: Date): JSX.Element => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return (
      <View className="px-4 py-2 bg-gray-100">
        <Text className="text-gray-700 text-sm font-bold">
          {year}年{month}月{day}日
        </Text>
      </View>
    );
  };

  // 日付が異なるかチェック
  const appIsDifferentDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  };

  // アイテムのレンダリング
  const appRenderItem = ({ item, index }: { item: Experience; index: number }) => {
    // 前の体験と日付が異なる場合、日付セパレーターを表示
    const showDateSeparator =
      index === 0 ||
      (index > 0 && appIsDifferentDay(item.timestamp, experiences[index - 1].timestamp));

    return (
      <View>
        {showDateSeparator && appRenderDateSeparator(item.timestamp)}
        <ExperienceCard
          experience={item}
          onPress={() => onExperiencePress(item)}
        />
      </View>
    );
  };

  // ローディング中
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3388ff" />
        <Text className="text-gray-600 text-base mt-4">読み込み中...</Text>
      </View>
    );
  }

  // 空の状態
  if (experiences.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        {/* ヘッダー */}
        <View className="bg-primary-500 px-4 py-4 flex-row items-center">
          <Pressable className="flex-row items-center flex-1" onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={28} color="#ffffff" />
            <Text className="text-white text-xl font-bold ml-3">タイムライン</Text>
          </Pressable>
        </View>

        {/* 空の状態 */}
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="camera-outline" size={80} color="#d1d5db" />
          <Text className="text-gray-600 text-lg font-bold mt-4">
            まだ体験が記録されていません
          </Text>
          <Text className="text-gray-500 text-base text-center mt-2">
            写真を撮影して、旅の思い出を残しましょう
          </Text>
        </View>
      </View>
    );
  }

  // タイムライン表示
  return (
    <View className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-primary-500 px-4 py-4 flex-row items-center">
        <Pressable className="flex-row items-center" onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={28} color="#ffffff" />
          <Text className="text-white text-xl font-bold ml-3">タイムライン</Text>
        </Pressable>
        <View className="flex-1" />
        <Text className="text-white text-sm">
          {experiences.length}件の思い出
        </Text>
      </View>

      {/* 体験リスト */}
      <FlatList
        data={experiences}
        keyExtractor={(item) => item.id}
        renderItem={appRenderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
