import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../database/DatabaseService';

interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
}

interface TripSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectTrip: (tripId: string) => void;
  currentTripId?: string;
}

export default function TripSelector({
  visible,
  onClose,
  onSelectTrip,
  currentTripId,
}: TripSelectorProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadTrips();
    }
  }, [visible]);

  const loadTrips = async () => {
    try {
      const allTrips = await databaseService.getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = (tripId: string) => {
    onSelectTrip(tripId);
    onClose();
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

  const renderTripItem = ({ item }: { item: Trip }) => {
    const isSelected = item.id === currentTripId;

    return (
      <TouchableOpacity
        className={`p-4 border-b border-gray-100 ${
          isSelected ? 'bg-blue-50' : 'bg-white'
        }`}
        onPress={() => handleSelectTrip(item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className={`text-base font-bold mb-1 ${
                isSelected ? 'text-blue-600' : 'text-gray-800'
              }`}
            >
              {item.title}
            </Text>
            <Text className="text-sm text-gray-600">
              {formatDateRange(item.start_date, item.end_date)}
            </Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <View className="px-4 pt-4 pb-3 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-800">
                旅行を選択
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 旅行一覧 */}
          <View style={{ maxHeight: 400 }}>
            {loading ? (
              <View className="p-8 items-center">
                <Text className="text-gray-600">読み込み中...</Text>
              </View>
            ) : trips.length === 0 ? (
              <View className="p-8 items-center">
                <Ionicons name="airplane-outline" size={48} color="#D1D5DB" />
                <Text className="text-base text-gray-600 mt-3">
                  旅行がありません
                </Text>
              </View>
            ) : (
              <FlatList
                data={trips}
                renderItem={renderTripItem}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>

          {/* 未分類オプション */}
          <TouchableOpacity
            className="p-4 border-t border-gray-200 bg-gray-50"
            onPress={() => handleSelectTrip('')}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-700">
                  未分類の体験
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  旅行に紐付けない
                </Text>
              </View>
              {!currentTripId && (
                <Ionicons name="checkmark-circle" size={24} color="#6B7280" />
              )}
            </View>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
