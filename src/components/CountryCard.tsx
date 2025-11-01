import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { VisitedCountry } from '../types/models';

interface CountryCardProps {
  country: VisitedCountry;
  onPress: (country: VisitedCountry) => void;
}

export default function CountryCard({ country, onPress }: CountryCardProps) {
  // 国コードから国旗の絵文字を取得
  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // 日付をフォーマット
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <Pressable
      className="bg-white rounded-2xl p-6 mb-4 mx-6 active:opacity-70"
      onPress={() => onPress(country)}
    >
      {/* 国旗と国名 */}
      <View className="flex-row items-center mb-4">
        <Text className="text-5xl mr-3">{getFlagEmoji(country.countryCode)}</Text>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            {country.countryName}
          </Text>
          {country.continent && (
            <Text className="text-sm text-gray-500 mt-1">
              {country.continent}
            </Text>
          )}
        </View>
      </View>

      {/* 統計情報 */}
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-xs text-gray-500 mb-1">体験回数</Text>
          <Text className="text-lg font-semibold text-primary-600">
            {country.visitCount}回
          </Text>
        </View>
        <View className="flex-1 mx-2">
          <Text className="text-xs text-gray-500 mb-1">写真枚数</Text>
          <Text className="text-lg font-semibold text-primary-600">
            {country.photoCount}枚
          </Text>
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-xs text-gray-500 mb-1">初回訪問</Text>
          <Text className="text-sm font-medium text-gray-700">
            {formatDate(country.firstVisit)}
          </Text>
        </View>
      </View>

      {/* 最終訪問日 */}
      {country.visitCount > 1 && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500">
            最終訪問: {formatDate(country.lastVisit)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
