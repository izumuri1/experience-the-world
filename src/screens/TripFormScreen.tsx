import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { databaseService } from '../database/DatabaseService';

export default function TripFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tripId = (route.params as any)?.tripId;
  const isEdit = !!tripId;

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [companions, setCompanions] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const trip = await databaseService.appGetTripById(tripId);
      if (trip) {
        setTitle(trip.title);
        setStartDate(trip.startDate);
        setEndDate(trip.endDate || null);
        setCompanions(trip.companions || '');
        setPurpose(trip.purpose || '');
        setNotes(trip.notes || '');
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      Alert.alert('エラー', '旅行情報の読み込みに失敗しました');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }

    if (endDate && endDate < startDate) {
      Alert.alert('入力エラー', '終了日は開始日以降にしてください');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        // 更新処理（後で実装）
        Alert.alert('未実装', '旅行の更新機能は次のバージョンで実装されます');
      } else {
        await databaseService.appCreateTrip({
          title: title.trim(),
          startDate,
          endDate: endDate || undefined,
          companions: companions.trim() || undefined,
          purpose: purpose.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
      Alert.alert('エラー', '旅行の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 flex-1">
            {isEdit ? '旅行を編集' : '新しい旅行'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || !title.trim()}
            className={`px-4 py-2 rounded-lg ${
              saving || !title.trim() ? 'bg-gray-300' : 'bg-blue-600'
            }`}
          >
            <Text
              className={`font-bold ${
                saving || !title.trim() ? 'text-gray-500' : 'text-white'
              }`}
            >
              {saving ? '保存中...' : '保存'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* タイトル */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 mb-2">
            タイトル <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="例: 2025年夏ヨーロッパ旅行"
            className="text-base text-gray-800 border border-gray-300 rounded-lg px-3 py-2"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 日付 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 mb-3">
            期間 <Text className="text-red-500">*</Text>
          </Text>

          {/* 開始日 */}
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-2">開始日</Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3"
            >
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text className="text-base text-gray-800 ml-2">
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 終了日 */}
          <View>
            <Text className="text-sm text-gray-600 mb-2">
              終了日（オプション）
            </Text>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3"
            >
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text className="text-base text-gray-800 ml-2">
                {endDate ? formatDate(endDate) : '終了日を選択'}
              </Text>
            </TouchableOpacity>
            {endDate && (
              <TouchableOpacity
                onPress={() => setEndDate(null)}
                className="mt-2"
              >
                <Text className="text-sm text-blue-600">終了日をクリア</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 同行者 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 mb-2">
            同行者（オプション）
          </Text>
          <TextInput
            value={companions}
            onChangeText={setCompanions}
            placeholder="例: 家族、友人、一人旅"
            className="text-base text-gray-800 border border-gray-300 rounded-lg px-3 py-2"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 目的 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 mb-2">
            目的（オプション）
          </Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="例: 観光、仕事、帰省"
            className="text-base text-gray-800 border border-gray-300 rounded-lg px-3 py-2"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* メモ */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-bold text-gray-700 mb-2">
            メモ（オプション）
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="旅行についての自由なメモ"
            multiline
            numberOfLines={4}
            className="text-base text-gray-800 border border-gray-300 rounded-lg px-3 py-2"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* DateTimePicker: 開始日 */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {/* DateTimePicker: 終了日 */}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startDate}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
