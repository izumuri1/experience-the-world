import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface AudioPlayerProps {
  audioUri: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  variant?: 'light' | 'dark'; // light: 白背景用、dark: 黒背景用
}

export default function AudioPlayer({
  audioUri,
  showDeleteButton = false,
  onDelete,
  variant = 'dark',
}: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const positionUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  // 時間を秒単位でフォーマット
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // サウンドの読み込み
  useEffect(() => {
    let isMounted = true;
    let currentSound: Audio.Sound | null = null;

    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false },
          (status) => {
            if (!isMounted) return;
            onPlaybackStatusUpdate(status);
          }
        );

        if (!isMounted) {
          // コンポーネントがアンマウントされていたらサウンドを解放
          await newSound.unloadAsync();
          return;
        }

        currentSound = newSound;
        setSound(newSound);

        // 再生時間を取得
        const status = await newSound.getStatusAsync();
        if (isMounted && status.isLoaded && status.durationMillis) {
          setDuration(status.durationMillis);
        }
      } catch (error) {
        console.error('音声読み込みエラー:', error);
      }
    };

    loadSound();

    // クリーンアップ
    return () => {
      isMounted = false;

      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
        positionUpdateInterval.current = null;
      }

      if (currentSound) {
        currentSound.stopAsync().catch(() => {});
        currentSound.unloadAsync().catch(() => {});
      }
    };
  }, [audioUri]);

  // 再生状態の更新
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying || false);

      // 再生終了時
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        if (positionUpdateInterval.current) {
          clearInterval(positionUpdateInterval.current);
          positionUpdateInterval.current = null;
        }
      }
    }
  };

  // 再生/一時停止
  const togglePlayback = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        if (isPlaying) {
          // 停止（一時停止して先頭に戻す）
          await sound.stopAsync();
          await sound.setPositionAsync(0);
          setIsPlaying(false);
          setPosition(0);
        } else {
          // 再生開始
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('再生エラー:', error);
    }
  };

  // 削除ボタン
  const handleDelete = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error('音声削除エラー:', error);
      }
    }
    if (onDelete) {
      onDelete();
    }
  };

  // 進捗バーの割合
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  // バリアントに応じた色設定
  const colors = variant === 'light'
    ? {
        background: 'rgba(0, 0, 0, 0.05)',
        text: '#1f2937',
        progressBg: 'rgba(0, 0, 0, 0.1)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        progressBg: 'rgba(255, 255, 255, 0.2)',
      };

  return (
    <View className="rounded-lg p-3 flex-row items-center" style={{ backgroundColor: colors.background }}>
      {/* 再生/停止ボタン */}
      <Pressable
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          isPlaying ? 'bg-red-500' : 'bg-secondary-500'
        }`}
        onPress={togglePlayback}
      >
        <Ionicons
          name={isPlaying ? 'stop' : 'play'}
          size={20}
          color="#ffffff"
        />
      </Pressable>

      {/* 進捗バーと時間表示 */}
      <View className="flex-1">
        {/* 進捗バー */}
        <View className="h-1 rounded-full overflow-hidden mb-1" style={{ backgroundColor: colors.progressBg }}>
          <View
            className="h-full bg-secondary-500"
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* 時間表示 */}
        <Text className="text-xs" style={{ color: colors.text }}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>

      {/* 削除ボタン（オプション） */}
      {showDeleteButton && (
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center ml-3"
          onPress={handleDelete}
          style={{
            backgroundColor: '#dc2626',
          }}
        >
          <Ionicons name="trash" size={20} color="#ffffff" />
        </Pressable>
      )}
    </View>
  );
}
