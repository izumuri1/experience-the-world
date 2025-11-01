/**
 * データベース行型（Row Types）
 * SQLiteから取得した生データの型定義
 */

/**
 * tripsテーブルの行型
 */
export interface TripRow {
  id: string;
  user_id: string;
  title: string;
  start_date: number; // Unix timestamp（秒）
  end_date: number | null; // Unix timestamp（秒）
  companions: string | null;
  purpose: string | null;
  notes: string | null;
  created_at: number;
  updated_at: number;
}

/**
 * trip_countriesテーブルの行型
 */
export interface TripCountryRow {
  trip_id: string;
  country_code: string;
  country_name: string;
  continent: string | null;
  first_visit_date: number; // Unix timestamp（秒）
}

/**
 * experiencesテーブルの行型
 */
export interface ExperienceRow {
  id: string;
  user_id: string;
  trip_id: string | null;
  timestamp: number; // Unix timestamp（秒）
  latitude: number;
  longitude: number;
  address: string | null;
  place_name: string | null;
  country_code: string | null;
  weather_condition: string | null;
  weather_temperature: number | null;
  weather_icon: string | null;
  text_notes: string | null;
  tags: string | null; // JSON文字列
  sync_status: 'pending' | 'synced' | 'error';
  created_at: number;
  updated_at: number;
}

/**
 * media_filesテーブルの行型
 */
export interface MediaFileRow {
  id: string;
  experience_id: string;
  file_type: 'photo' | 'audio_memo' | 'ambient_sound';
  file_path: string;
  file_size: number | null;
  duration: number | null;
  created_at: number;
}

/**
 * visited_countriesテーブルの行型
 */
export interface VisitedCountryRow {
  country_code: string;
  country_name: string;
  continent: string | null;
  first_visit: number;
  last_visit: number;
  visit_count: number;
  photo_count: number;
  created_at: number;
  updated_at: number;
}
