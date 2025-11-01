import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { locationService } from '../services/LocationService';
import { weatherService } from '../services/WeatherService';
import { db } from '../database/DatabaseService';
import { mediaService } from '../services/MediaService';
import { AMBIENT_SOUND_DURATION } from '../constants/config';
import type { Location as AppLocation, Weather } from '../types/models';

interface CameraScreenProps {
  onClose: () => void;
}

export default function CameraScreen({ onClose }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // カメラパーミッションのチェック
  if (!permission) {
    return (
      <View className="flex-1 bg-neutral-900 items-center justify-center">
        <ActivityIndicator size={48} color="#3388ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-neutral-900 items-center justify-center p-6">
        <Text className="text-white text-center text-lg mb-6">
          カメラへのアクセス許可が必要です
        </Text>
        <Pressable
          className="bg-primary-500 px-6 py-3 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">許可する</Text>
        </Pressable>
      </View>
    );
  }

  // カメラの前後切り替え
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // 環境音を3秒間録音
  const recordAmbientSound = async (): Promise<string | null> => {
    try {
      // 音声パーミッションのリクエスト
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('音声録音の許可がありません');
        return null;
      }

      // 録音設定
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 録音開始
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      // 3秒間録音
      await new Promise((resolve) => setTimeout(resolve, AMBIENT_SOUND_DURATION));

      // 録音停止
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      return uri;
    } catch (error) {
      console.error('環境音の録音エラー:', error);
      return null;
    }
  };

  // 写真撮影とデータ保存
  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      // 1. 写真を撮影
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo) {
        throw new Error('写真の撮影に失敗しました');
      }

      // 2. 位置情報を取得
      const locationPermission = await locationService.appRequestPermission();
      let locationData: AppLocation | null = null;

      if (locationPermission) {
        try {
          locationData = await locationService.appGetLocationWithAddress();
        } catch (error) {
          console.error('位置情報の取得エラー:', error);
        }
      }

      // 3. 天気情報を取得（位置情報がある場合のみ）
      let weatherData: Weather | null = null;
      if (locationData) {
        try {
          weatherData = await weatherService.appGetWeather(
            locationData.latitude,
            locationData.longitude
          );
        } catch (error) {
          console.error('天気情報の取得エラー:', error);
        }
      }

      // 4. 環境音を3秒間録音（シャッター音を避けるため1秒待機）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const ambientSoundUri = await recordAmbientSound();

      // 5. Experienceをデータベースに作成
      const experienceId = await db.appCreateExperience({
        timestamp: new Date(),
        location: locationData || undefined,
        weather: weatherData || undefined,
        textNotes: undefined,
        tags: [],
      });

      // 6. 写真を保存
      const photoPath = await mediaService.appSavePhoto(experienceId, photo.uri);
      await db.appCreateMediaFile(experienceId, 'photo', photoPath);

      // 7. 環境音を保存（録音できた場合）
      if (ambientSoundUri) {
        const soundPath = await mediaService.appSaveAudio(
          experienceId,
          ambientSoundUri,
          'ambient_sound'
        );
        await db.appCreateMediaFile(experienceId, 'ambient_sound', soundPath);
      }

      // 8. 訪問国を記録（位置情報がある場合）
      if (locationData && locationData.countryCode) {
        await db.appUpsertVisitedCountry(locationData.countryCode);
      }

      // 成功メッセージ
      Alert.alert(
        '✅ 保存完了',
        '写真と体験が記録されました！',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('写真撮影エラー:', error);
      Alert.alert(
        '❌ エラー',
        '写真の保存に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        {/* 撮影中のオーバーレイ */}
        {isCapturing && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <ActivityIndicator size={48} color="#ffffff" />
            <View className="flex-row items-center mt-4">
              <Ionicons name="camera" size={24} color="#ffffff" />
              <Text className="text-white text-lg ml-2">記録中...</Text>
            </View>
            <Text className="text-white text-sm mt-2">
              位置情報・天気・環境音を取得しています
            </Text>
          </View>
        )}

        {/* コントロール */}
        {!isCapturing && (
          <View className="absolute bottom-0 left-0 right-0 pb-12">
            {/* カメラ切り替えボタン */}
            <View className="items-center mb-8">
              <Pressable
                className="bg-neutral-800/70 w-12 h-12 rounded-full items-center justify-center"
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={28} color="#ffffff" />
              </Pressable>
            </View>

            {/* シャッターボタン */}
            <View className="items-center">
              <Pressable
                className="w-20 h-20 rounded-full bg-white border-4 border-neutral-300 items-center justify-center"
                onPress={handleTakePhoto}
              >
                <View className="w-16 h-16 rounded-full bg-white" />
              </Pressable>
            </View>

            {/* 説明テキスト */}
            <View className="flex-row items-center justify-center mt-6 opacity-70">
              <Ionicons name="location" size={14} color="#ffffff" />
              <Text className="text-white text-xs mx-1">位置情報</Text>
              <Text className="text-white text-xs mx-1">•</Text>
              <Ionicons name="partly-sunny" size={14} color="#ffffff" />
              <Text className="text-white text-xs mx-1">天気</Text>
              <Text className="text-white text-xs mx-1">•</Text>
              <Ionicons name="musical-notes" size={14} color="#ffffff" />
              <Text className="text-white text-xs mx-1">環境音</Text>
            </View>
          </View>
        )}
      </CameraView>
    </View>
  );
}
