/**
 * アプリケーション設定定数
 */

import { documentDirectory } from 'expo-file-system/legacy';

/**
 * データベース設定
 */
export const DB_NAME = 'experience-the-world.db';
export const DB_VERSION = 1;

/**
 * ファイルストレージ設定
 */
export const MEDIA_DIR = `${documentDirectory}media/`;
export const PHOTOS_DIR = `${MEDIA_DIR}photos/`;
export const AUDIO_MEMOS_DIR = `${MEDIA_DIR}audio_memos/`;
export const AMBIENT_SOUNDS_DIR = `${MEDIA_DIR}ambient_sounds/`;

/**
 * 環境音録音設定
 */
export const AMBIENT_SOUND_DURATION = 3000; // 3秒（ミリ秒）

/**
 * 音声メモ設定
 */
export const AUDIO_MEMO_MAX_DURATION = 180000; // 3分（ミリ秒）

/**
 * 外部API設定
 */
export const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
export const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * ユーザーID（Phase 1では固定）
 */
export const DEFAULT_USER_ID = 'default_user';
