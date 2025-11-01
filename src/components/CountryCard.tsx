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

  // 日付をフォーマット (yyyy/mm/dd形式)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <Pressable
      className="bg-white rounded-2xl mb-4 mx-6 overflow-hidden active:opacity-70"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() => onPress(country)}
    >
      {/* 国旗セクション - グラデーション背景 */}
      <View className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-5 flex-row items-center">
        <View
          className="bg-white rounded-2xl p-3 mr-4"
          style={{
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-6xl">{getFlagEmoji(country.countryCode)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">
            {country.countryName}
          </Text>
          {country.continent && (
            <Text className="text-sm text-gray-600 mt-1 font-medium">
              {country.continent}
            </Text>
          )}
        </View>
      </View>

      {/* 統計情報セクション */}
      <View className="px-6 py-5">
        {/* 2段目: 体験回数・写真枚数 */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-blue-50 rounded-xl p-3 mr-2">
            <Text className="text-xs text-gray-600 mb-1 font-medium">体験回数</Text>
            <Text className="text-2xl font-bold text-primary-600">
              {country.visitCount}
            </Text>
          </View>
          <View className="flex-1 bg-indigo-50 rounded-xl p-3 ml-2">
            <Text className="text-xs text-gray-600 mb-1 font-medium">写真枚数</Text>
            <Text className="text-2xl font-bold text-indigo-600">
              {country.photoCount}
            </Text>
          </View>
        </View>

        {/* 3段目: 初回体験 */}
        <View className="bg-gray-50 rounded-xl px-4 py-2 mb-3">
          <Text className="text-xs text-gray-600 font-medium">
            初回体験: {formatDate(country.firstVisit)}
          </Text>
        </View>

        {/* 4段目: 最終体験 */}
        {country.visitCount > 1 && (
          <View className="bg-gray-50 rounded-xl px-4 py-2">
            <Text className="text-xs text-gray-600 font-medium">
              最終体験: {formatDate(country.lastVisit)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
