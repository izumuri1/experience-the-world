import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface AudioPlayerProps {
  audioUri: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

export default function AudioPlayer({
  audioUri,
  showDeleteButton = false,
  onDelete,
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
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        setSound(newSound);

        // 再生時間を取得
        const status = await newSound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          setDuration(status.durationMillis);
        }
      } catch (error) {
        console.error('音声読み込みエラー:', error);
      }
    };

    loadSound();

    // クリーンアップ
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
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
          // 一時停止
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          // 再生開始または再開
          if (position >= duration) {
            // 最後まで再生済みの場合は最初から
            await sound.setPositionAsync(0);
          }
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('再生エラー:', error);
    }
  };

  // 削除ボタン
  const handleDelete = () => {
    if (sound) {
      sound.unloadAsync();
    }
    if (onDelete) {
      onDelete();
    }
  };

  // 進捗バーの割合
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View className="bg-white/10 rounded-lg p-3 flex-row items-center">
      {/* 再生/一時停止ボタン */}
      <Pressable
        className="w-10 h-10 rounded-full bg-secondary-500 items-center justify-center mr-3"
        onPress={togglePlayback}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={20}
          color="#ffffff"
        />
      </Pressable>

      {/* 進捗バーと時間表示 */}
      <View className="flex-1">
        {/* 進捗バー */}
        <View className="h-1 bg-white/20 rounded-full overflow-hidden mb-1">
          <View
            className="h-full bg-secondary-500"
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* 時間表示 */}
        <Text className="text-white text-xs">
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>

      {/* 削除ボタン（オプション） */}
      {showDeleteButton && (
        <Pressable
          className="w-10 h-10 rounded-full bg-red-500/80 items-center justify-center ml-3"
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={18} color="#ffffff" />
        </Pressable>
      )}
    </View>
  );
}
