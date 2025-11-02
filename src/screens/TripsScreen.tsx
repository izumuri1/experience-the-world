import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { databaseService } from '../database/DatabaseService';

interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  companions: string | null;
  purpose: string | null;
  notes: string | null;
  experience_count?: number;
}

export default function TripsScreen() {
  const navigation = useNavigation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const allTrips = await databaseService.getAllTrips();

      // 各旅行の体験数を取得
      const tripsWithCount = await Promise.all(
        allTrips.map(async (trip) => {
          const experiences = await databaseService.getExperiencesByTripId(trip.id);
          return {
            ...trip,
            experience_count: experiences.length,
          };
        })
      );

      setTrips(tripsWithCount);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const handleCreateTrip = () => {
    navigation.navigate('TripForm' as never);
  };

  const handleTripPress = (trip: Trip) => {
    navigation.navigate('TripDetail' as never, { tripId: trip.id } as never);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    if (!endDate) {
      return `${start}〜`;
    }
    const end = formatDate(endDate);
    return `${start} 〜 ${end}`;
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
      onPress={() => handleTripPress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-lg font-bold text-gray-800 flex-1">
          {item.title}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>

      <View className="flex-row items-center mb-1">
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-600 ml-2">
          {formatDateRange(item.start_date, item.end_date)}
        </Text>
      </View>

      {item.companions && (
        <View className="flex-row items-center mb-1">
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">{item.companions}</Text>
        </View>
      )}

      {item.purpose && (
        <View className="flex-row items-center mb-1">
          <Ionicons name="flag-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">{item.purpose}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="images-outline" size={16} color="#3B82F6" />
          <Text className="text-sm text-blue-600 ml-1 font-medium">
            {item.experience_count || 0} 件の体験
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Ionicons name="airplane-outline" size={64} color="#D1D5DB" />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        旅行の記録がありません
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        旅行を作成して、体験を整理しましょう
      </Text>
      <TouchableOpacity
        className="bg-blue-600 rounded-full px-6 py-3"
        onPress={handleCreateTrip}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">最初の旅行を作成</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">読み込み中...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800">旅行</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center"
            onPress={handleCreateTrip}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 旅行一覧 */}
      {trips.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
