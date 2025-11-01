import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Modal } from 'react-native';
import { db } from './src/database/DatabaseService';
import { mediaService } from './src/services/MediaService';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import ExperienceDetailScreen from './src/screens/ExperienceDetailScreen';
import CountriesScreen from './src/screens/CountriesScreen';
import type { Experience } from './src/types/models';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

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
    // タイムラインを再度開く（データを再読み込み）
    setTimeout(() => setShowTimeline(true), 100);
  };

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
        onCameraPress={() => setShowCamera(true)}
        onTimelinePress={() => setShowTimeline(true)}
        onCountriesPress={() => setShowCountries(true)}
      />

      {/* カメラモーダル */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraScreen onClose={() => setShowCamera(false)} />
      </Modal>

      {/* タイムラインモーダル */}
      <Modal
        visible={showTimeline}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <TimelineScreen
          onExperiencePress={handleExperiencePress}
          onClose={() => setShowTimeline(false)}
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
        <CountriesScreen onClose={() => setShowCountries(false)} />
      </Modal>
    </>
  );
}
