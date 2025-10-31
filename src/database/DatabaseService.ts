/**
 * データベースサービスクラス
 * Expo SQLiteを使用したローカルデータベース管理
 */

import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import {
  ExperienceRow,
  MediaFileRow,
  VisitedCountryRow,
  Experience,
  VisitedCountry,
  Location,
  Weather,
} from '../types';
import { appMapExperienceRowToModel, appMapVisitedCountryRowToModel } from './mappers';
import { DB_NAME, DEFAULT_USER_ID } from '../constants';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * データベースの初期化
   */
  async appInitialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    await this.appCreateTables();
    await this.appRunMigrations();
  }

  /**
   * テーブル作成
   */
  private async appCreateTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // experiencesテーブル
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT,
        place_name TEXT,
        country_code TEXT,
        weather_condition TEXT,
        weather_temperature REAL,
        weather_icon TEXT,
        text_notes TEXT,
        tags TEXT,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_experiences_timestamp
        ON experiences(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_experiences_country
        ON experiences(country_code);
      CREATE INDEX IF NOT EXISTS idx_experiences_sync
        ON experiences(sync_status);
    `);

    // media_filesテーブル
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS media_files (
        id TEXT PRIMARY KEY NOT NULL,
        experience_id TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        duration INTEGER,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (experience_id)
          REFERENCES experiences(id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_media_experience
        ON media_files(experience_id);
      CREATE INDEX IF NOT EXISTS idx_media_type
        ON media_files(file_type);
    `);

    // visited_countriesテーブル
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS visited_countries (
        country_code TEXT PRIMARY KEY NOT NULL,
        country_name TEXT NOT NULL,
        continent TEXT,
        first_visit INTEGER NOT NULL,
        last_visit INTEGER NOT NULL,
        visit_count INTEGER NOT NULL DEFAULT 1,
        photo_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_countries_continent
        ON visited_countries(continent);
    `);
  }

  /**
   * マイグレーション実行
   */
  private async appRunMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // バージョン管理テーブル作成
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY NOT NULL
      );
    `);

    // 現在のバージョンを取得
    const result = await this.db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
    );
    const currentVersion = result?.version || 0;

    // 現在はバージョン1のみ（将来的にマイグレーションを追加）
    if (currentVersion < 1) {
      await this.db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        [1]
      );
    }
  }

  /**
   * 体験記録を作成
   */
  async appCreateExperience(data: {
    timestamp?: Date;
    location?: Location;
    weather?: Weather;
    textNotes?: string;
    tags?: string[];
  }): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const timestamp = data.timestamp
      ? Math.floor(data.timestamp.getTime() / 1000)
      : now;

    await this.db.runAsync(
      `INSERT INTO experiences (
        id, user_id, timestamp, latitude, longitude,
        address, place_name, country_code,
        weather_condition, weather_temperature, weather_icon,
        text_notes, tags, sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        DEFAULT_USER_ID,
        timestamp,
        data.location?.latitude || null,
        data.location?.longitude || null,
        data.location?.address || null,
        data.location?.placeName || null,
        data.location?.countryCode || null,
        data.weather?.condition || null,
        data.weather?.temperature || null,
        data.weather?.icon || null,
        data.textNotes || null,
        JSON.stringify(data.tags || []),
        'pending',
        now,
        now,
      ]
    );

    // 訪問国を更新（位置情報がある場合のみ）
    if (data.location?.countryCode) {
      await this.appUpsertVisitedCountry(
        data.location.countryCode,
        data.location.placeName || data.location.countryCode
      );
    }

    return id;
  }

  /**
   * メディアファイルを作成
   */
  async appCreateMediaFile(
    experienceId: string,
    fileType: 'photo' | 'audio_memo' | 'ambient_sound',
    filePath: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await this.db.runAsync(
      `INSERT INTO media_files (
        id, experience_id, file_type, file_path,
        file_size, duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, experienceId, fileType, filePath, null, null, now]
    );
  }

  /**
   * 体験記録を取得
   */
  async appGetExperiences(filters?: {
    startDate?: Date;
    endDate?: Date;
    countryCode?: string;
  }): Promise<Experience[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM experiences WHERE 1=1';
    const params: any[] = [];

    if (filters?.startDate) {
      query += ' AND timestamp >= ?';
      params.push(Math.floor(filters.startDate.getTime() / 1000));
    }
    if (filters?.endDate) {
      query += ' AND timestamp <= ?';
      params.push(Math.floor(filters.endDate.getTime() / 1000));
    }
    if (filters?.countryCode) {
      query += ' AND country_code = ?';
      params.push(filters.countryCode);
    }

    query += ' ORDER BY timestamp DESC';

    const rows = await this.db.getAllAsync<ExperienceRow>(query, params);

    // メディアファイルを取得
    const experiences: Experience[] = [];
    for (const row of rows) {
      const mediaFiles = await this.db.getAllAsync<MediaFileRow>(
        'SELECT * FROM media_files WHERE experience_id = ?',
        [row.id]
      );
      experiences.push(appMapExperienceRowToModel(row, mediaFiles));
    }

    return experiences;
  }

  /**
   * 体験記録を削除
   */
  async appDeleteExperience(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // ON DELETE CASCADEにより、media_filesも自動削除される
    await this.db.runAsync('DELETE FROM experiences WHERE id = ?', [id]);
  }

  /**
   * 訪問国をUPSERT
   */
  async appUpsertVisitedCountry(
    countryCode: string,
    countryName: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Math.floor(Date.now() / 1000);

    const existing = await this.db.getFirstAsync<VisitedCountryRow>(
      'SELECT * FROM visited_countries WHERE country_code = ?',
      [countryCode]
    );

    if (existing) {
      // 更新
      await this.db.runAsync(
        `UPDATE visited_countries
         SET last_visit = ?, visit_count = visit_count + 1, updated_at = ?
         WHERE country_code = ?`,
        [now, now, countryCode]
      );
    } else {
      // 新規作成
      await this.db.runAsync(
        `INSERT INTO visited_countries (
          country_code, country_name, continent,
          first_visit, last_visit, visit_count, photo_count,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [countryCode, countryName, null, now, now, 1, 0, now, now]
      );
    }
  }

  /**
   * 訪問国一覧を取得
   */
  async appGetVisitedCountries(): Promise<VisitedCountry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<VisitedCountryRow>(
      'SELECT * FROM visited_countries ORDER BY first_visit DESC'
    );

    return rows.map(appMapVisitedCountryRowToModel);
  }
}

// シングルトンインスタンス
export const db = new DatabaseService();
