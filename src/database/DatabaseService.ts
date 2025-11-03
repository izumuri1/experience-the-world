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
  TripRow,
  TripCountryRow,
  Experience,
  VisitedCountry,
  Trip,
  TripCountry,
  Location,
  Weather,
} from '../types';
import { appMapExperienceRowToModel, appMapVisitedCountryRowToModel } from './mappers';
import { DB_NAME, DEFAULT_USER_ID } from '../constants';
import { getCountryName, getContinent } from '../utils/countries';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * データベースの初期化
   */
  async appInitialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);

    // 開発中: データベースを削除して再作成
    // TODO: 本番環境では削除
    // await this.appResetDatabase();

    await this.appCreateTables();
    await this.appRunMigrations();
  }

  /**
   * データベースを削除して再作成（開発用）
   */
  private async appResetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    console.log('🗑️ データベースをリセットしています...');

    // 全テーブルを削除
    await this.db.execAsync(`
      DROP TABLE IF EXISTS media_files;
      DROP TABLE IF EXISTS experiences;
      DROP TABLE IF EXISTS trip_countries;
      DROP TABLE IF EXISTS trips;
      DROP TABLE IF EXISTS visited_countries;
      DROP TABLE IF EXISTS schema_version;
    `);

    console.log('✅ データベースをリセットしました');
  }

  /**
   * テーブル作成
   */
  private async appCreateTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // tripsテーブル（旅行）
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER,
        companions TEXT,
        purpose TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_trips_start_date
        ON trips(start_date DESC);
      CREATE INDEX IF NOT EXISTS idx_trips_user
        ON trips(user_id);
    `);

    // experiencesテーブル
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        trip_id TEXT,
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
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (trip_id)
          REFERENCES trips(id)
          ON DELETE SET NULL
      );

      CREATE INDEX IF NOT EXISTS idx_experiences_timestamp
        ON experiences(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_experiences_country
        ON experiences(country_code);
      CREATE INDEX IF NOT EXISTS idx_experiences_sync
        ON experiences(sync_status);
      CREATE INDEX IF NOT EXISTS idx_experiences_trip
        ON experiences(trip_id);
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

    // trip_countriesテーブル（旅行-国の中間テーブル）
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS trip_countries (
        trip_id TEXT NOT NULL,
        country_code TEXT NOT NULL,
        country_name TEXT NOT NULL,
        continent TEXT,
        first_visit_date INTEGER NOT NULL,
        PRIMARY KEY (trip_id, country_code),
        FOREIGN KEY (trip_id)
          REFERENCES trips(id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_trip_countries_country
        ON trip_countries(country_code);
      CREATE INDEX IF NOT EXISTS idx_trip_countries_trip
        ON trip_countries(trip_id);
    `);

    // visited_countriesテーブル（統計用・後方互換性のため残す）
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

    // バージョン1: 初期マイグレーション
    if (currentVersion < 1) {
      await this.db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        [1]
      );
    }

    // バージョン2: 訪問国の国名と大陸を更新
    if (currentVersion < 2) {
      const countries = await this.db.getAllAsync<VisitedCountryRow>(
        'SELECT * FROM visited_countries'
      );

      for (const country of countries) {
        const countryName = getCountryName(country.country_code);
        const continent = getContinent(country.country_code);

        await this.db.runAsync(
          `UPDATE visited_countries
           SET country_name = ?, continent = ?
           WHERE country_code = ?`,
          [countryName, continent, country.country_code]
        );
      }

      await this.db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        [2]
      );
    }

    // バージョン3: 旅行機能の追加（trips, trip_countries）
    if (currentVersion < 3) {
      await this.appMigrateToTripsSchema();
      await this.db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        [3]
      );
    }
  }

  /**
   * バージョン3マイグレーション: 旅行機能の追加
   * 既存のexperiencesを「未分類の旅行」として扱う
   */
  private async appMigrateToTripsSchema(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // 既存のexperiencesテーブルにtrip_idカラムを追加
    try {
      await this.db.execAsync(`
        ALTER TABLE experiences ADD COLUMN trip_id TEXT;
      `);
      console.log('✅ experiencesテーブルにtrip_idカラムを追加しました');
    } catch (error) {
      // カラムが既に存在する場合はエラーになるが、無視する
      console.log('trip_idカラムは既に存在します');
    }

    // 既存のexperiencesがあるかチェック
    const experienceCount = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM experiences'
    );

    if (!experienceCount || experienceCount.count === 0) {
      // 既存データがない場合は何もしない
      return;
    }

    // 「未分類の旅行」を作成
    const unclassifiedTripId = 'trip_unclassified';
    const now = Math.floor(Date.now() / 1000);

    // 最初のexperienceのタイムスタンプを取得
    const firstExperience = await this.db.getFirstAsync<ExperienceRow>(
      'SELECT timestamp FROM experiences ORDER BY timestamp ASC LIMIT 1'
    );

    const startDate = firstExperience?.timestamp || now;

    await this.db.runAsync(
      `INSERT INTO trips (id, user_id, title, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [unclassifiedTripId, DEFAULT_USER_ID, '未分類の体験', startDate, null, now, now]
    );

    // 既存のexperiencesを未分類の旅行に紐付け
    await this.db.runAsync(
      'UPDATE experiences SET trip_id = ? WHERE trip_id IS NULL',
      [unclassifiedTripId]
    );

    // trip_countriesを生成（experiencesから国コードを抽出）
    const countriesInTrip = await this.db.getAllAsync<{
      country_code: string;
      min_timestamp: number;
    }>(
      `SELECT country_code, MIN(timestamp) as min_timestamp
       FROM experiences
       WHERE trip_id = ? AND country_code IS NOT NULL
       GROUP BY country_code`,
      [unclassifiedTripId]
    );

    for (const country of countriesInTrip) {
      const countryName = getCountryName(country.country_code);
      const continent = getContinent(country.country_code);

      await this.db.runAsync(
        `INSERT INTO trip_countries (trip_id, country_code, country_name, continent, first_visit_date)
         VALUES (?, ?, ?, ?, ?)`,
        [
          unclassifiedTripId,
          country.country_code,
          countryName,
          continent,
          country.min_timestamp,
        ]
      );
    }

    console.log(
      `✅ マイグレーション完了: ${experienceCount.count}件の体験を「未分類の旅行」に移行しました`
    );
  }

  /**
   * 体験記録を作成
   */
  async appCreateExperience(data: {
    id?: string; // 同期時に既存IDを指定可能
    timestamp?: Date;
    location?: Location;
    weather?: Weather;
    textNotes?: string;
    tags?: string[];
    tripId?: string; // 旅行IDを指定可能に
    mediaFiles?: any[]; // 同期時にメディアファイル情報を渡す
  }): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = data.id || Crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const timestamp = data.timestamp
      ? Math.floor(data.timestamp.getTime() / 1000)
      : now;

    // tripIdが指定されていない場合、デフォルトの旅行を探す
    let tripId = data.tripId;
    if (!tripId) {
      // 「未分類の体験」旅行を取得または作成
      const unclassifiedTrip = await this.db.getFirstAsync<TripRow>(
        'SELECT id FROM trips WHERE title = ? LIMIT 1',
        ['未分類の体験']
      );

      if (unclassifiedTrip) {
        tripId = unclassifiedTrip.id;
      } else {
        // 未分類の旅行を作成
        tripId = await this.appCreateTrip({
          title: '未分類の体験',
          startDate: new Date(timestamp * 1000),
        });
      }
    }

    await this.db.runAsync(
      `INSERT INTO experiences (
        id, user_id, trip_id, timestamp, latitude, longitude,
        address, place_name, country_code,
        weather_condition, weather_temperature, weather_icon,
        text_notes, tags, sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        DEFAULT_USER_ID,
        tripId,
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

    // 旅行に国を追加（位置情報がある場合のみ）
    if (data.location?.countryCode && tripId) {
      await this.appAddCountryToTrip(
        tripId,
        data.location.countryCode,
        new Date(timestamp * 1000)
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

    // 写真の場合、該当する国のphoto_countを更新
    if (fileType === 'photo') {
      const experience = await this.db.getFirstAsync<ExperienceRow>(
        'SELECT country_code FROM experiences WHERE id = ?',
        [experienceId]
      );

      if (experience?.country_code) {
        await this.db.runAsync(
          `UPDATE visited_countries
           SET photo_count = photo_count + 1, updated_at = ?
           WHERE country_code = ?`,
          [now, experience.country_code]
        );
      }
    }
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
   * IDで体験記録を取得
   */
  async getExperienceById(id: string): Promise<Experience | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync<ExperienceRow>(
      'SELECT * FROM experiences WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    // メディアファイルを取得
    const mediaFiles = await this.db.getAllAsync<MediaFileRow>(
      'SELECT * FROM media_files WHERE experience_id = ?',
      [row.id]
    );

    return appMapExperienceRowToModel(row, mediaFiles);
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
   * 訪問国をUPSERT（後方互換性のため残す、内部では再計算を呼ぶ）
   * @deprecated 新しいコードではappRecalculateVisitedCountriesを使用してください
   */
  async appUpsertVisitedCountry(_countryCode: string): Promise<void> {
    // 旅行機能導入後は、visited_countriesは常にtrip_countriesから計算する
    // このメソッドは後方互換性のため残すが、何もしない
    // 必要に応じてappRecalculateVisitedCountriesを呼ぶ
    console.warn('appUpsertVisitedCountry is deprecated. Use appRecalculateVisitedCountries instead.');
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

  /**
   * 訪問国の統計を再計算（trip_countriesから集計）
   */
  async appRecalculateVisitedCountries(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // visited_countriesを全削除
    await this.db.runAsync('DELETE FROM visited_countries');

    // trip_countriesから集計
    const aggregated = await this.db.getAllAsync<{
      country_code: string;
      country_name: string;
      continent: string | null;
      visit_count: number;
      first_visit: number;
      last_visit: number;
    }>(
      `SELECT
         country_code,
         country_name,
         continent,
         COUNT(*) as visit_count,
         MIN(first_visit_date) as first_visit,
         MAX(first_visit_date) as last_visit
       FROM trip_countries
       GROUP BY country_code`
    );

    const now = Math.floor(Date.now() / 1000);

    // 写真枚数を計算
    for (const country of aggregated) {
      // その国に関連するexperiencesの写真枚数を取得
      const photoCountResult = await this.db.getFirstAsync<{ photo_count: number }>(
        `SELECT COUNT(*) as photo_count
         FROM media_files mf
         INNER JOIN experiences e ON e.id = mf.experience_id
         WHERE e.country_code = ? AND mf.file_type = 'photo'`,
        [country.country_code]
      );

      const photoCount = photoCountResult?.photo_count || 0;

      // visited_countriesに挿入
      await this.db.runAsync(
        `INSERT INTO visited_countries (
           country_code, country_name, continent,
           first_visit, last_visit, visit_count, photo_count,
           created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          country.country_code,
          country.country_name,
          country.continent,
          country.first_visit,
          country.last_visit,
          country.visit_count,
          photoCount,
          now,
          now,
        ]
      );
    }
  }

  // ========== 旅行関連メソッド ==========

  /**
   * 旅行を作成
   */
  async appCreateTrip(data: {
    id?: string; // 同期時に既存IDを指定可能
    title: string;
    startDate: Date;
    endDate?: Date;
    companions?: string;
    purpose?: string;
    notes?: string;
  }): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = data.id || Crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const startDate = Math.floor(data.startDate.getTime() / 1000);
    const endDate = data.endDate ? Math.floor(data.endDate.getTime() / 1000) : null;

    await this.db.runAsync(
      `INSERT INTO trips (
        id, user_id, title, start_date, end_date,
        companions, purpose, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        DEFAULT_USER_ID,
        data.title,
        startDate,
        endDate,
        data.companions || null,
        data.purpose || null,
        data.notes || null,
        now,
        now,
      ]
    );

    return id;
  }

  /**
   * 旅行一覧を取得
   */
  async appGetTrips(): Promise<Trip[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<TripRow>(
      'SELECT * FROM trips ORDER BY start_date DESC'
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      startDate: new Date(row.start_date * 1000),
      endDate: row.end_date ? new Date(row.end_date * 1000) : null,
      companions: row.companions || undefined,
      purpose: row.purpose || undefined,
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000),
    }));
  }

  /**
   * 旅行一覧を取得（UIコンポーネント用のシンプルな型）
   */
  async getAllTrips(): Promise<Array<{
    id: string;
    title: string;
    start_date: string;
    end_date: string | null;
    companions: string | null;
    purpose: string | null;
    notes: string | null;
  }>> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<TripRow>(
      'SELECT * FROM trips ORDER BY start_date DESC'
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      start_date: new Date(row.start_date * 1000).toISOString(),
      end_date: row.end_date ? new Date(row.end_date * 1000).toISOString() : null,
      companions: row.companions || null,
      purpose: row.purpose || null,
      notes: row.notes || null,
    }));
  }

  /**
   * 旅行IDに紐づく体験一覧を取得
   */
  async getExperiencesByTripId(tripId: string): Promise<Experience[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<ExperienceRow>(
      'SELECT * FROM experiences WHERE trip_id = ? ORDER BY timestamp DESC',
      [tripId]
    );

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
   * 旅行IDから旅行を取得
   */
  async appGetTripById(tripId: string): Promise<Trip | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync<TripRow>(
      'SELECT * FROM trips WHERE id = ?',
      [tripId]
    );

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      startDate: new Date(row.start_date * 1000),
      endDate: row.end_date ? new Date(row.end_date * 1000) : null,
      companions: row.companions || undefined,
      purpose: row.purpose || undefined,
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000),
    };
  }

  /**
   * 旅行に国を追加
   */
  async appAddCountryToTrip(
    tripId: string,
    countryCode: string,
    firstVisitDate: Date
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const countryName = getCountryName(countryCode);
    const continent = getContinent(countryCode);
    const timestamp = Math.floor(firstVisitDate.getTime() / 1000);

    await this.db.runAsync(
      `INSERT OR REPLACE INTO trip_countries (
        trip_id, country_code, country_name, continent, first_visit_date
      ) VALUES (?, ?, ?, ?, ?)`,
      [tripId, countryCode, countryName, continent, timestamp]
    );

    // visited_countriesを再計算
    await this.appRecalculateVisitedCountries();
  }

  /**
   * 旅行の訪問国一覧を取得
   */
  async appGetTripCountries(tripId: string): Promise<TripCountry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<TripCountryRow>(
      'SELECT * FROM trip_countries WHERE trip_id = ? ORDER BY first_visit_date',
      [tripId]
    );

    return rows.map((row) => ({
      tripId: row.trip_id,
      countryCode: row.country_code,
      countryName: row.country_name,
      continent: row.continent || '',
      firstVisitDate: new Date(row.first_visit_date * 1000),
    }));
  }

  /**
   * 体験を旅行に紐付け
   */
  async appAssignExperienceToTrip(
    experienceId: string,
    tripId: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Math.floor(Date.now() / 1000);

    await this.db.runAsync(
      'UPDATE experiences SET trip_id = ?, updated_at = ? WHERE id = ?',
      [tripId, now, experienceId]
    );

    // 体験の国コードを取得
    const experience = await this.db.getFirstAsync<ExperienceRow>(
      'SELECT country_code, timestamp FROM experiences WHERE id = ?',
      [experienceId]
    );

    if (experience?.country_code) {
      // 旅行に国を追加（既に存在する場合は何もしない）
      await this.appAddCountryToTrip(
        tripId,
        experience.country_code,
        new Date(experience.timestamp * 1000)
      );
    }
  }

  /**
   * 旅行を削除
   */
  async appDeleteTrip(tripId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // ON DELETE CASCADEにより、trip_countriesも自動削除される
    // experiencesのtrip_idはON DELETE SET NULLによりnullになる
    await this.db.runAsync('DELETE FROM trips WHERE id = ?', [tripId]);

    // visited_countriesを再計算
    await this.appRecalculateVisitedCountries();
  }
}

// シングルトンインスタンス
export const db = new DatabaseService();
export const databaseService = db; // 別名エクスポート（既存コードとの互換性のため）
