import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  maxDuration?: number; // ミリ秒
}

export default function AudioRecorder({
  onRecordingComplete,
  maxDuration = 180000, // デフォルト3分
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // 録音時間を秒単位でフォーマット
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 録音開始
  const startRecording = async () => {
    try {
      // パーミッションリクエスト
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('音声録音の許可が必要です');
        return;
      }

      // オーディオモード設定
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

      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // アニメーション開始（0.7→1.3のスケールで脈打つ）
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();

      // タイマー開始
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 100;
        setRecordingDuration(elapsed);

        // 最大時間に達したら自動停止
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 100);
    } catch (error) {
      console.error('録音開始エラー:', error);
    }
  };

  // 録音停止
  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      // タイマー停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // アニメーション停止
      if (animationRef.current) {
        animationRef.current.stop();
      }
      scaleAnim.setValue(1);

      // 録音停止
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // URIがある場合は親コンポーネントに通知
      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (error) {
      console.error('録音停止エラー:', error);
    }
  };

  // キャンセル（録音を破棄）
  const cancelRecording = async () => {
    if (!recordingRef.current) return;

    try {
      // タイマー停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // アニメーション停止
      if (animationRef.current) {
        animationRef.current.stop();
      }
      scaleAnim.setValue(1);

      // 録音停止（破棄）
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      recordingRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);
    } catch (error) {
      console.error('録音キャンセルエラー:', error);
    }
  };

  return (
    <View className="items-center">
      {/* 録音中の表示 */}
      {isRecording && (
        <View className="mb-4 bg-white/10 px-4 py-2 rounded-full flex-row items-center">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: '#ef4444' }}
            />
          </Animated.View>
          <Text className="text-white font-bold">
            {formatDuration(recordingDuration)}
          </Text>
        </View>
      )}

      {/* 録音ボタン */}
      <View className="flex-row items-center">
        {/* キャンセルボタン（録音中のみ表示） */}
        {isRecording && (
          <Pressable
            className="bg-neutral-800/70 w-14 h-14 rounded-full items-center justify-center mr-4"
            onPress={cancelRecording}
          >
            <Ionicons name="close" size={28} color="#ffffff" />
          </Pressable>
        )}

        {/* メイン録音ボタン */}
        <Pressable
          className={`w-16 h-16 rounded-full items-center justify-center ${
            isRecording ? 'bg-red-500' : 'bg-secondary-500'
          }`}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isRecording && recordingDuration >= maxDuration}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={32}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {/* 説明テキスト */}
      {!isRecording && (
        <Text className="text-white text-xs mt-4 opacity-70">
          タップして録音開始
        </Text>
      )}
      {isRecording && (
        <Text className="text-white text-xs mt-4 opacity-70">
          停止ボタンまたはキャンセルボタンをタップ
        </Text>
      )}
    </View>
  );
}
