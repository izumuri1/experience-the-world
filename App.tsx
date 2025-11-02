import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Modal, Text, TouchableOpacity } from 'react-native';
import { db } from './src/database/DatabaseService';
import { mediaService } from './src/services/MediaService';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import ExperienceDetailScreen from './src/screens/ExperienceDetailScreen';
import CountriesScreen from './src/screens/CountriesScreen';
import TripsScreen from './src/screens/TripsScreen';
import TripFormScreen from './src/screens/TripFormScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import type { Experience } from './src/types/models';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // HomeScreenの再読み込み用

  useEffect(() => {
    async function appPrepare() {
      try {
        // データベース初期化
        await db.appInitialize();

        // メディアディレクトリ初期化
        await mediaService.appInitializeDirectories();

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setInitError(error instanceof Error ? error.message : 'アプリの初期化に失敗しました');
      }
    }

    appPrepare();
  }, []);

  // 体験カードをタップしたときの処理
  const handleExperiencePress = (experience: Experience) => {
    // タイムラインを閉じてから詳細画面を開く
    setShowTimeline(false);
    setTimeout(() => {
      setSelectedExperience(experience);
    }, 300);
  };

  // 詳細画面を閉じる
  const handleDetailClose = () => {
    setSelectedExperience(null);
    // タイムラインに戻る
    setShowTimeline(true);
  };

  // 体験を削除した後の処理
  const handleExperienceDelete = () => {
    setSelectedExperience(null);
    setShowTimeline(false);
    // ホーム画面の統計を更新
    setRefreshKey((prev) => prev + 1);
    // タイムラインを再度開く（データを再読み込み）
    setTimeout(() => setShowTimeline(true), 100);
  };

  // カメラを閉じる
  const handleCameraClose = () => {
    setShowCamera(false);
    // ホーム画面の統計を更新
    setRefreshKey((prev) => prev + 1);
  };

  // タイムラインを閉じる
  const handleTimelineClose = () => {
    setShowTimeline(false);
    // ホーム画面の統計を更新
    setRefreshKey((prev) => prev + 1);
  };

  // 訪問国画面を閉じる
  const handleCountriesClose = () => {
    setShowCountries(false);
    // ホーム画面の統計を更新
    setRefreshKey((prev) => prev + 1);
  };

  // 旅行画面を閉じる
  const handleTripsClose = () => {
    setShowTrips(false);
    setRefreshKey((prev) => prev + 1);
  };

  // エラー発生時の表示
  if (initError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          初期化エラー
        </Text>
        <Text className="text-base text-gray-700 text-center mb-8">
          {initError}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setInitError(null);
            setIsReady(false);
            // アプリを再初期化
            db.appInitialize()
              .then(() => mediaService.appInitializeDirectories())
              .then(() => setIsReady(true))
              .catch((error) => {
                setInitError(error instanceof Error ? error.message : 'アプリの初期化に失敗しました');
              });
          }}
          className="bg-primary-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ローディング中の表示
  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={48} color="#3388ff" />
      </View>
    );
  }

  return (
    <>
      {/* ホーム画面 */}
      <HomeScreen
        key={refreshKey}
        onCameraPress={() => setShowCamera(true)}
        onTimelinePress={() => setShowTimeline(true)}
        onCountriesPress={() => setShowCountries(true)}
        onTripsPress={() => setShowTrips(true)}
      />

      {/* カメラモーダル */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraScreen onClose={handleCameraClose} />
      </Modal>

      {/* タイムラインモーダル */}
      <Modal
        visible={showTimeline}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <TimelineScreen
          onExperiencePress={handleExperiencePress}
          onClose={handleTimelineClose}
        />
      </Modal>

      {/* 詳細画面モーダル */}
      <Modal
        visible={selectedExperience !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedExperience && (
          <ExperienceDetailScreen
            experience={selectedExperience}
            onClose={handleDetailClose}
            onDelete={handleExperienceDelete}
          />
        )}
      </Modal>

      {/* 訪問国モーダル */}
      <Modal
        visible={showCountries}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CountriesScreen onClose={handleCountriesClose} />
      </Modal>

      {/* 旅行一覧モーダル */}
      <Modal
        visible={showTrips}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <TripsScreen />
      </Modal>

      {/* 旅行作成・編集モーダル */}
      <Modal
        visible={showTripForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <TripFormScreen />
      </Modal>

      {/* 旅行詳細モーダル */}
      <Modal
        visible={showTripDetail}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedTripId && <TripDetailScreen />}
      </Modal>
    </>
  );
}
