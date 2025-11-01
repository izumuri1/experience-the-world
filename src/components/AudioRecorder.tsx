import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  maxDuration?: number; // ミリ秒
  textColor?: string; // テキストの色（デフォルト: white）
  backgroundColor?: string; // 背景色（デフォルト: transparent）
}

export default function AudioRecorder({
  onRecordingComplete,
  maxDuration = 180000, // デフォルト3分
  textColor = '#ffffff',
  backgroundColor = 'transparent',
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
    <View className="items-center py-4" style={{ backgroundColor }}>
      {/* 録音中の表示 */}
      {isRecording && (
        <View className="mb-6 px-6 py-3 rounded-full flex-row items-center" style={{ backgroundColor: textColor === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: '#ef4444' }}
            />
          </Animated.View>
          <Text className="text-lg font-bold" style={{ color: textColor }}>
            {formatDuration(recordingDuration)}
          </Text>
        </View>
      )}

      {/* 録音前 - マイクボタンのみ */}
      {!isRecording && (
        <View className="items-center">
          <Pressable
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            onPress={startRecording}
            style={{
              backgroundColor: '#eab308',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="mic" size={40} color="#ffffff" />
          </Pressable>
          <Text className="text-sm font-semibold mb-1" style={{ color: textColor }}>
            録音開始
          </Text>
          <Text className="text-xs opacity-70" style={{ color: textColor }}>
            マイクボタンをタップ
          </Text>
        </View>
      )}

      {/* 録音中 - 停止とキャンセルボタン */}
      {isRecording && (
        <View className="items-center">
          <View className="flex-row items-center mb-6">
            {/* 停止ボタン */}
            <View className="items-center mx-3">
              <Pressable
                className="w-20 h-20 rounded-full items-center justify-center mb-2"
                onPress={stopRecording}
                style={{
                  backgroundColor: '#ef4444',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="stop" size={40} color="#ffffff" />
              </Pressable>
              <Text className="text-sm font-semibold" style={{ color: textColor }}>
                停止して保存
              </Text>
            </View>

            {/* キャンセルボタン */}
            <View className="items-center mx-3">
              <Pressable
                className="w-20 h-20 rounded-full items-center justify-center mb-2"
                onPress={cancelRecording}
                style={{
                  backgroundColor: '#525252',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="close" size={40} color="#ffffff" />
              </Pressable>
              <Text className="text-sm font-semibold" style={{ color: textColor }}>
                キャンセル
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
