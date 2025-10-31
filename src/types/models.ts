/**
 * アプリケーション層の型定義（Domain Models）
 * アプリケーション内で使用する、よりTypeScriptらしい型定義
 */

/**
 * 位置情報
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  placeName: string;
  countryCode: string;
}

/**
 * 天気情報
 */
export interface Weather {
  condition: string;
  temperature: number;
  icon: string;
}

/**
 * 体験記録（アプリケーション層）
 */
export interface Experience {
  id: string;
  timestamp: Date;
  location: Location;
  weather: Weather | null;
  photos: string[]; // file_pathの配列
  audioMemos: string[];
  ambientSounds: string[];
  textNotes?: string;
  tags: string[];
  syncStatus: 'pending' | 'synced' | 'error';
}

/**
 * メディアファイル
 */
export interface MediaFile {
  id: string;
  experienceId: string;
  fileType: 'photo' | 'audio_memo' | 'ambient_sound';
  filePath: string;
  fileSize?: number;
  duration?: number; // 秒数
  createdAt: Date;
}

/**
 * 訪問国
 */
export interface VisitedCountry {
  countryCode: string;
  countryName: string;
  continent: string;
  firstVisit: Date;
  lastVisit: Date;
  visitCount: number;
  photoCount: number;
}
