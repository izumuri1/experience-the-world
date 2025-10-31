import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from './AudioPlayer';
import type { Experience } from '../types/models';

interface ExperienceCardProps {
  experience: Experience;
  onPress: () => void;
}

/**
 * タイムラインに表示する体験カード
 *
 * 表示内容:
 * - 写真（タップで詳細画面へ）
 * - 日時
 * - 場所名・住所
 * - 天気アイコン・気温
 * - 音声メモの再生ボタン
 * - テキストメモ
 */
export default function ExperienceCard({ experience, onPress }: ExperienceCardProps) {
  // 日時のフォーマット
  const appFormatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
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

  return (
    <Pressable
      className="bg-white rounded-lg shadow-md mx-4 my-2 overflow-hidden"
      onPress={onPress}
    >
      {/* 写真 */}
      {experience.photos.length > 0 && (
        <Image
          source={{ uri: experience.photos[0] }}
          className="w-full h-64"
          resizeMode="cover"
        />
      )}

      {/* カード本体 */}
      <View className="p-4">
        {/* 日時と天気 */}
        <View className="flex-row items-center justify-between mb-2">
          {/* 日時 */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {appFormatDate(experience.timestamp)}
            </Text>
          </View>

          {/* 天気 */}
          {experience.weather && (
            <View className="flex-row items-center">
              <Ionicons
                name={appGetWeatherIcon(experience.weather.condition)}
                size={16}
                color="#6b7280"
              />
              <Text className="text-gray-600 text-sm ml-1">
                {experience.weather.temperature}°C
              </Text>
            </View>
          )}
        </View>

        {/* 場所 */}
        <View className="flex-row items-start mb-2">
          <Ionicons name="location-outline" size={16} color="#3388ff" />
          <View className="flex-1 ml-1">
            <Text className="text-gray-900 text-base font-bold">
              {experience.location.placeName || '場所不明'}
            </Text>
            {experience.location.address && (
              <Text className="text-gray-600 text-sm">
                {experience.location.address}
              </Text>
            )}
          </View>
        </View>

        {/* テキストメモ */}
        {experience.textNotes && (
          <Text className="text-gray-700 text-base mb-3" numberOfLines={3}>
            {experience.textNotes}
          </Text>
        )}

        {/* 音声メモ */}
        {experience.audioMemos.length > 0 && (
          <View className="mb-2">
            <Text className="text-gray-600 text-sm mb-2">音声メモ</Text>
            <AudioPlayer audioUri={experience.audioMemos[0]} />
          </View>
        )}

        {/* 環境音 */}
        {experience.ambientSounds.length > 0 && (
          <View>
            <Text className="text-gray-600 text-sm mb-2">環境音</Text>
            <AudioPlayer audioUri={experience.ambientSounds[0]} />
          </View>
        )}

        {/* タグ */}
        {experience.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {experience.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-primary-100 px-2 py-1 rounded mr-2 mb-2"
              >
                <Text className="text-primary-700 text-xs">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}
