/**
 * 型変換ヘルパー関数
 * データベースの行型とアプリケーション層の型を相互変換
 */

import {
  ExperienceRow,
  MediaFileRow,
  VisitedCountryRow,
  Experience,
  VisitedCountry,
} from '../types';

/**
 * ExperienceRow → Experience
 * データベースの行データをアプリケーション層のモデルに変換
 */
export function appMapExperienceRowToModel(
  row: ExperienceRow,
  mediaFiles: MediaFileRow[]
): Experience {
  return {
    id: row.id,
    timestamp: new Date(row.timestamp * 1000),
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
      address: row.address || '',
      placeName: row.place_name || '',
      countryCode: row.country_code || '',
    },
    weather: row.weather_condition
      ? {
          condition: row.weather_condition,
          temperature: row.weather_temperature || 0,
          icon: row.weather_icon || '',
        }
      : null,
    photos: mediaFiles
      .filter((m) => m.file_type === 'photo')
      .map((m) => m.file_path),
    audioMemos: mediaFiles
      .filter((m) => m.file_type === 'audio_memo')
      .map((m) => m.file_path),
    ambientSounds: mediaFiles
      .filter((m) => m.file_type === 'ambient_sound')
      .map((m) => m.file_path),
    textNotes: row.text_notes || undefined,
    tags: row.tags ? JSON.parse(row.tags) : [],
    syncStatus: row.sync_status,
  };
}

/**
 * VisitedCountryRow → VisitedCountry
 * データベースの行データをアプリケーション層のモデルに変換
 */
export function appMapVisitedCountryRowToModel(
  row: VisitedCountryRow
): VisitedCountry {
  return {
    countryCode: row.country_code,
    countryName: row.country_name,
    continent: row.continent || '',
    firstVisit: new Date(row.first_visit * 1000),
    lastVisit: new Date(row.last_visit * 1000),
    visitCount: row.visit_count,
    photoCount: row.photo_count,
  };
}
