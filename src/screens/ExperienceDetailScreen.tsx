import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../components/AudioPlayer';
import { db } from '../database/DatabaseService';
import { mediaService } from '../services/MediaService';
import type { Experience } from '../types/models';

interface ExperienceDetailScreenProps {
  experience: Experience;
  onClose: () => void;
  onDelete: () => void;
}

/**
 * 体験詳細画面
 *
 * 機能:
 * - 写真の拡大表示
 * - すべての情報を表示（位置、天気、音声、テキスト）
 * - 編集・削除ボタン
 */
export default function ExperienceDetailScreen({
  experience,
  onClose,
  onDelete,
}: ExperienceDetailScreenProps) {
  const [deleting, setDeleting] = useState(false);
  // 日時のフォーマット
  const appFormatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  // 天気アイコンの取得
  const appGetWeatherIcon = (condition: string): string => {
    const weatherMap: { [key: string]: string } = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Snow': 'snow',
      'Thunderstorm': 'thunderstorm',
      'Drizzle': 'rainy',
      'Mist': 'cloud',
      'Fog': 'cloud',
    };
    return weatherMap[condition] || 'cloud';
  };

  // 削除処理
  const appHandleDelete = () => {
    Alert.alert(
      '削除確認',
      'この体験記録を削除しますか?',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);

              // メディアファイルを削除
              await mediaService.appDeleteExperienceFiles(experience.id);

              // DBから削除
              await db.appDeleteExperience(experience.id);

              // 削除完了後、画面を閉じる
              onDelete();
            } catch (error) {
              console.error('削除エラー:', error);
              Alert.alert('エラー', '削除に失敗しました');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-primary-500 px-4 py-4 flex-row items-center">
        <Pressable className="flex-row items-center flex-1" onPress={onClose} hitSlop={8}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
          <Text className="text-white text-xl font-bold ml-3">詳細</Text>
        </Pressable>
        <Pressable onPress={appHandleDelete} disabled={deleting} hitSlop={8}>
          <Ionicons name="trash-outline" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* コンテンツ */}
      <ScrollView className="flex-1">
        {/* 写真 */}
        {experience.photos.length > 0 && (
          <View>
            {experience.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                className="w-full h-96"
                resizeMode="contain"
              />
            ))}
          </View>
        )}

        <View className="p-4">
          {/* 日時 */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="time-outline" size={20} color="#3388ff" />
            <Text className="text-gray-900 text-base ml-2 font-bold">
              {appFormatDate(experience.timestamp)}
            </Text>
          </View>

          {/* 場所 */}
          {experience.location && (
            <View className="flex-row items-start mb-4">
              <Ionicons name="location-outline" size={20} color="#3388ff" />
              <View className="flex-1 ml-2">
                <Text className="text-gray-900 text-lg font-bold">
                  {experience.location.placeName || '場所不明'}
                </Text>
                {experience.location.address && (
                  <Text className="text-gray-600 text-base mt-1">
                    {experience.location.address}
                  </Text>
                )}
                <Text className="text-gray-500 text-sm mt-1">
                  緯度: {experience.location.latitude.toFixed(6)}
                </Text>
                <Text className="text-gray-500 text-sm">
                  経度: {experience.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}
          {/* 天気 */}
          {experience.weather && (
            <View className="flex-row items-center mb-4">
              <Ionicons
                name={appGetWeatherIcon(experience.weather.condition)}
                size={20}
                color="#3388ff"
              />
              <Text className="text-gray-900 text-base ml-2">
                {experience.weather.condition} - {experience.weather.temperature}°C
              </Text>
            </View>
          )}

          {/* テキストメモ */}
          {experience.textNotes && (
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-bold mb-2">メモ</Text>
              <Text className="text-gray-900 text-base leading-6">
                {experience.textNotes}
              </Text>
            </View>
          )}

          {/* 音声メモ */}
          {experience.audioMemos.length > 0 && (
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-bold mb-2">音声メモ</Text>
              {experience.audioMemos.map((audio, index) => (
                <View key={index} className="mb-2">
                  <AudioPlayer audioUri={audio} />
                </View>
              ))}
            </View>
          )}

          {/* 環境音 */}
          {experience.ambientSounds.length > 0 && (
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-bold mb-2">環境音</Text>
              {experience.ambientSounds.map((sound, index) => (
                <View key={index} className="mb-2">
                  <AudioPlayer audioUri={sound} />
                </View>
              ))}
            </View>
          )}

          {/* タグ */}
          {experience.tags.length > 0 && (
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-bold mb-2">タグ</Text>
              <View className="flex-row flex-wrap">
                {experience.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-primary-100 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-primary-700 text-sm">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 同期ステータス */}
          <View className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-gray-500 text-xs">
              同期状態: {experience.syncStatus}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
