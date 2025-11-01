import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { VisitedCountry } from '../types/models';
import { db } from '../database/DatabaseService';
import CountryCard from '../components/CountryCard';

interface CountriesScreenProps {
  onClose: () => void;
  onCountryPress?: (country: VisitedCountry) => void;
}

export default function CountriesScreen({ onClose, onCountryPress }: CountriesScreenProps) {
  const [countries, setCountries] = useState<VisitedCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await db.appGetVisitedCountries();
      setCountries(data);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryPress = (country: VisitedCountry) => {
    // Phase 1では、タップしても詳細画面への遷移は実装しない
    // Phase 2で国ごとの体験一覧画面を実装予定
    if (onCountryPress) {
      onCountryPress(country);
    }
  };

  return (
    <View className="flex-1 bg-primary-500">
      {/* ヘッダー */}
      <View className="pt-16 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={onClose}
            className="active:opacity-70"
          >
            <Text className="text-white text-lg">✕ 訪問国</Text>
          </Pressable>
          <Text className="text-white text-lg font-semibold">
            {countries.length}ヶ国
          </Text>
        </View>
      </View>

      {/* コンテンツ */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={48} color="#FFFFFF" />
        </View>
      ) : countries.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">🌍</Text>
          <Text className="text-white text-xl font-semibold mb-2 text-center">
            まだ訪問した国がありません
          </Text>
          <Text className="text-primary-100 text-base text-center">
            写真を撮って、世界中の体験を記録しましょう
          </Text>
        </View>
      ) : (
        <FlatList
          data={countries}
          keyExtractor={(item) => item.countryCode}
          renderItem={({ item }) => (
            <CountryCard country={item} onPress={handleCountryPress} />
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
