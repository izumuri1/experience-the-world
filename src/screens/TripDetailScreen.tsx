import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../database/DatabaseService';
import type { Experience } from '../types/models';

interface Trip {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  companions?: string;
  purpose?: string;
  notes?: string;
}

interface TripCountry {
  countryCode: string;
  countryName: string;
  firstVisitDate: Date;
}

interface TripDetailScreenProps {
  onClose: () => void;
  onEditTrip: (tripId: string) => void;
  onExperiencePress: (experience: Experience) => void;
  tripId: string;
}

export default function TripDetailScreen({
  onClose,
  onEditTrip,
  onExperiencePress,
  tripId
}: TripDetailScreenProps) {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [countries, setCountries] = useState<TripCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      loadTripData();
    }
  }, [tripId]);

  const loadTripData = async () => {
    try {
      const [tripData, experiencesData, countriesData] = await Promise.all([
        databaseService.appGetTripById(tripId),
        databaseService.getExperiencesByTripId(tripId),
        databaseService.appGetTripCountries(tripId),
      ]);

      setTrip(tripData);
      setExperiences(experiencesData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Failed to load trip data:', error);
      Alert.alert('エラー', '旅行情報の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrip = () => {
    onEditTrip(tripId);
  };

  const handleDeleteTrip = () => {
    Alert.alert(
      '旅行を削除',
      'この旅行を削除しますか？体験は「未分類」に移動されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.appDeleteTrip(tripId);
              onClose();
            } catch (error) {
              console.error('Failed to delete trip:', error);
              Alert.alert('エラー', '旅行の削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const formatDateRange = (startDate: Date, endDate: Date | null) => {
    const start = formatDate(startDate);
    if (!endDate) {
      return `${start}〜`;
    }
    const end = formatDate(endDate);
    return `${start} 〜 ${end}`;
  };

  const renderExperienceCard = ({ item }: { item: Experience }) => {
    const photo = item.mediaFiles?.find((m) => m.fileType === 'photo');

    return (
      <TouchableOpacity
        className="bg-white rounded-xl mb-3 overflow-hidden"
        onPress={() => onExperiencePress(item)}
        activeOpacity={0.7}
      >
        {photo && (
          <Image
            source={{ uri: photo.filePath }}
            className="w-full h-48"
            resizeMode="cover"
          />
        )}
        <View className="p-4">
          <Text className="text-base font-bold text-gray-800 mb-1">
            {item.location?.placeName || '場所情報なし'}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {item.location?.countryCode || '不明'}
            </Text>
            <Text className="text-sm text-gray-400 ml-2">
              {formatDate(item.timestamp)}
            </Text>
          </View>
          {item.textNotes && (
            <Text
              className="text-sm text-gray-600 mt-2"
              numberOfLines={2}
            >
              {item.textNotes}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">読み込み中...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">旅行が見つかりません</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity
            onPress={onClose}
            className="mr-4"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {trip.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleEditTrip}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="create-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* 旅行情報カード */}
        <View className="bg-white m-4 rounded-xl p-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text className="text-base text-gray-700 ml-2">
              {formatDateRange(trip.startDate, trip.endDate)}
            </Text>
          </View>

          {trip.companions && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="people-outline" size={20} color="#6B7280" />
              <Text className="text-base text-gray-700 ml-2">
                {trip.companions}
              </Text>
            </View>
          )}

          {trip.purpose && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="flag-outline" size={20} color="#6B7280" />
              <Text className="text-base text-gray-700 ml-2">
                {trip.purpose}
              </Text>
            </View>
          )}

          {trip.notes && (
            <View className="mt-2 pt-3 border-t border-gray-100">
              <Text className="text-sm text-gray-600">{trip.notes}</Text>
            </View>
          )}
        </View>

        {/* 統計 */}
        <View className="flex-row mx-4 mb-4">
          <View className="flex-1 bg-white rounded-xl p-4 mr-2">
            <Text className="text-2xl font-bold text-blue-600">
              {countries.length}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">訪問国</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 ml-2">
            <Text className="text-2xl font-bold text-green-600">
              {experiences.length}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">体験</Text>
          </View>
        </View>

        {/* 訪問国一覧 */}
        {countries.length > 0 && (
          <View className="bg-white mx-4 mb-4 rounded-xl p-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
              訪問した国
            </Text>
            <View className="flex-row flex-wrap">
              {countries.map((country) => (
                <View
                  key={country.countryCode}
                  className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-sm text-blue-700">
                    {country.countryName}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 体験一覧 */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            体験（{experiences.length}件）
          </Text>
          {experiences.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="images-outline" size={48} color="#D1D5DB" />
              <Text className="text-base text-gray-600 mt-3">
                まだ体験がありません
              </Text>
            </View>
          ) : (
            <FlatList
              data={experiences}
              renderItem={renderExperienceCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* 削除ボタン */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="bg-red-50 rounded-xl p-4 items-center"
            onPress={handleDeleteTrip}
            activeOpacity={0.7}
          >
            <Text className="text-red-600 font-bold">この旅行を削除</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
