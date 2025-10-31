# Experience the World - データベース設計書

**バージョン**: 1.0
**作成日**: 2025年10月28日
**対象**: Phase 1 MVP
**DB技術**: Expo SQLite

**関連ドキュメント**:
- [プロダクトビジョン](product-vision.md) - WHY: ビジョン・コンセプト・ビジネスモデル
- [要件定義書](requirements.md) - WHAT: 機能要件・データ構造
- [開発ルール](project-rules.md) - HOW: コーディング規約・技術スタック

---

## 目次

1. [技術選定](#1-技術選定)
2. [データベース構造](#2-データベース構造)
3. [テーブル定義](#3-テーブル定義)
4. [TypeScriptインターフェース](#4-typescriptインターフェース)
5. [CRUD操作](#5-crud操作)
6. [ファイル管理戦略](#6-ファイル管理戦略)
7. [マイグレーション戦略](#7-マイグレーション戦略)
8. [Phase 2への移行計画](#8-phase-2への移行計画)

---

## 1. 技術選定

### 1-1. 選択したDB: Expo SQLite

**選定理由:**
- ✅ **オフライン完全対応**: ローカルデータベースとして完全にオフラインで動作
- ✅ **Expo標準**: `expo-sqlite`として公式サポート、Expo Goで即座に動作
- ✅ **軽量・高速**: モバイルデバイスに最適化されたパフォーマンス
- ✅ **TypeScript対応**: 型安全なクエリが可能
- ✅ **Phase 2への移行**: 将来的にFirebase/PostgreSQLへの移行時、データエクスポートが容易
- ✅ **リレーショナルDB**: 外部キー制約、インデックス、トランザクションをサポート

**代替案（不採用）:**
- ❌ **Realm**: 学習コストが高い、Phase 2でのクラウド同期にRealm Syncが必要（有料）
- ❌ **AsyncStorage**: Key-Value形式のみ、複雑なクエリ不可
- ❌ **WatermelonDB**: オーバースペック、Phase 1には複雑すぎる

### 1-2. ファイル保存方式

**選択した方式: ファイルパス管理**

**理由:**
- ✅ **expo-file-system**: Expo標準のファイル操作API
- ✅ **ディスク容量効率**: DBに大容量Blobを入れない
- ✅ **パフォーマンス**: 画像・音声の読み込みが高速
- ✅ **バックアップ容易**: ファイルシステム単位でバックアップ可能

**Web版（IndexedDB + Blob）との違い:**
| 項目 | Web版 | Expo版 |
|------|-------|--------|
| 保存方法 | Blob形式でIndexedDB | ファイルパスでSQLite |
| ファイル実体 | IndexedDB内 | expo-file-system |
| 管理方法 | Blob URL生成 | ファイルパス参照 |

### 1-3. 音声フォーマット

**選択した形式: M4A（AAC コーデック）**

**理由:**
- ✅ **iOS標準**: iPhoneでネイティブサポート
- ✅ **高圧縮率**: 3秒の環境音で約20-30KB
- ✅ **高音質**: AACコーデックの品質
- ✅ **expo-av対応**: 録音・再生が簡単

**Web版（WebM）との違い:**
- Web版: WebM（Opus コーデック）
- Expo版: M4A（AAC コーデック）
- 両形式とも高圧縮・高音質で実用上の差はなし

---

## 2. データベース構造

### 2-1. ER図

```
┌─────────────┐
│  experiences │
│─────────────│
│ id (PK)     │
│ user_id     │
│ timestamp   │
│ location... │
│ weather...  │
│ text_notes  │
│ tags        │
│ sync_status │
└─────────────┘
       │
       │ 1
       │
       │ N
       ▼
┌─────────────┐
│ media_files │
│─────────────│
│ id (PK)     │
│ experience_id (FK) │
│ file_type   │
│ file_path   │
│ file_size   │
│ duration    │
└─────────────┘

┌──────────────────┐
│ visited_countries│
│──────────────────│
│ country_code (PK)│
│ country_name    │
│ continent       │
│ first_visit     │
│ last_visit      │
│ visit_count     │
│ photo_count     │
└──────────────────┘
```

### 2-2. テーブル一覧

| テーブル名 | 説明 | Phase |
|-----------|------|-------|
| `experiences` | 体験記録のメインテーブル | Phase 1 |
| `media_files` | 写真・音声ファイルの管理 | Phase 1 |
| `visited_countries` | 訪問国の集計情報 | Phase 1 |
| `first_time_stories` | 「初めて」ストーリー | Phase 3 |
| `user_profiles` | ユーザー行動プロファイル | Phase 3 |
| `media_records` | 音楽・本・映画の記録 | Phase 2 |

**Phase 1では上位3つのみ実装**

---

## 3. テーブル定義

### 3-1. experiences テーブル

体験記録のメインテーブル。写真撮影・音声メモ記録時に作成されます。

```sql
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,

  -- 位置情報
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  place_name TEXT,
  country_code TEXT,

  -- 天気情報
  weather_condition TEXT,
  weather_temperature REAL,
  weather_icon TEXT,

  -- テキスト・タグ
  text_notes TEXT,
  tags TEXT, -- JSON配列: '["food","lunch","tokyo"]'

  -- 同期管理
  sync_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'synced' | 'error'

  -- タイムスタンプ
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_experiences_timestamp
  ON experiences(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_experiences_country
  ON experiences(country_code);

CREATE INDEX IF NOT EXISTS idx_experiences_sync
  ON experiences(sync_status);

CREATE INDEX IF NOT EXISTS idx_experiences_user
  ON experiences(user_id);
```

**カラム説明:**

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `id` | TEXT | NOT NULL | UUID v4 |
| `user_id` | TEXT | NOT NULL | ユーザーID（Phase 1は固定値） |
| `timestamp` | INTEGER | NOT NULL | Unix timestamp（秒） |
| `latitude` | REAL | NOT NULL | 緯度（-90〜90） |
| `longitude` | REAL | NOT NULL | 経度（-180〜180） |
| `address` | TEXT | NULL | 住所文字列 |
| `place_name` | TEXT | NULL | 場所名（例: "東京タワー"） |
| `country_code` | TEXT | NULL | 国コード（ISO 3166-1 alpha-2） |
| `weather_condition` | TEXT | NULL | 天気（"Clear", "Clouds"など） |
| `weather_temperature` | REAL | NULL | 気温（摂氏） |
| `weather_icon` | TEXT | NULL | 天気アイコンID |
| `text_notes` | TEXT | NULL | テキストメモ |
| `tags` | TEXT | NULL | タグのJSON配列文字列 |
| `sync_status` | TEXT | NOT NULL | 同期状態 |
| `created_at` | INTEGER | NOT NULL | 作成日時（Unix timestamp） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（Unix timestamp） |

**sync_statusの値:**
- `'pending'`: 未同期（Phase 2で使用）
- `'synced'`: 同期済み
- `'error'`: 同期エラー

### 3-2. media_files テーブル

写真・音声ファイルのパスとメタデータを管理します。

```sql
CREATE TABLE IF NOT EXISTS media_files (
  id TEXT PRIMARY KEY NOT NULL,
  experience_id TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'photo' | 'audio_memo' | 'ambient_sound'
  file_path TEXT NOT NULL, -- ファイルの絶対パス
  file_size INTEGER, -- バイト数
  duration INTEGER, -- 音声の長さ（秒）、写真の場合はNULL
  created_at INTEGER NOT NULL,

  FOREIGN KEY (experience_id)
    REFERENCES experiences(id)
    ON DELETE CASCADE
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_media_experience
  ON media_files(experience_id);

CREATE INDEX IF NOT EXISTS idx_media_type
  ON media_files(file_type);
```

**カラム説明:**

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `id` | TEXT | NOT NULL | UUID v4 |
| `experience_id` | TEXT | NOT NULL | 紐づく体験記録ID |
| `file_type` | TEXT | NOT NULL | ファイル種別 |
| `file_path` | TEXT | NOT NULL | expo-file-systemの絶対パス |
| `file_size` | INTEGER | NULL | ファイルサイズ（バイト） |
| `duration` | INTEGER | NULL | 音声の長さ（秒）、写真はNULL |
| `created_at` | INTEGER | NOT NULL | 作成日時 |

**file_typeの値:**
- `'photo'`: 写真
- `'audio_memo'`: 音声メモ（ユーザーが録音）
- `'ambient_sound'`: 環境音（自動録音3秒）

**file_pathの例:**
```
file:///data/user/0/com.experience.world/files/media/photos/123e4567-e89b-12d3-a456-426614174000.jpg
file:///data/user/0/com.experience.world/files/media/audio_memos/123e4567-e89b-12d3-a456-426614174001.m4a
```

### 3-3. visited_countries テーブル

訪問国の集計情報を管理します。世界地図機能で使用します。

```sql
CREATE TABLE IF NOT EXISTS visited_countries (
  country_code TEXT PRIMARY KEY NOT NULL, -- ISO 3166-1 alpha-2
  country_name TEXT NOT NULL, -- 国名（日本語）
  continent TEXT, -- 大陸名
  first_visit INTEGER NOT NULL, -- 初回訪問日時（Unix timestamp）
  last_visit INTEGER NOT NULL, -- 最終訪問日時（Unix timestamp）
  visit_count INTEGER NOT NULL DEFAULT 1, -- 訪問回数
  photo_count INTEGER NOT NULL DEFAULT 0, -- 写真枚数
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_countries_continent
  ON visited_countries(continent);

CREATE INDEX IF NOT EXISTS idx_countries_first_visit
  ON visited_countries(first_visit DESC);
```

**カラム説明:**

| カラム名 | 型 | NULL | 説明 |
|---------|-----|------|------|
| `country_code` | TEXT | NOT NULL | ISO 3166-1 alpha-2（例: "JP", "US"） |
| `country_name` | TEXT | NOT NULL | 国名（例: "日本", "アメリカ"） |
| `continent` | TEXT | NULL | 大陸名（例: "Asia", "Europe"） |
| `first_visit` | INTEGER | NOT NULL | 初回訪問日時 |
| `last_visit` | INTEGER | NOT NULL | 最終訪問日時 |
| `visit_count` | INTEGER | NOT NULL | 訪問回数 |
| `photo_count` | INTEGER | NOT NULL | この国で撮影した写真枚数 |
| `created_at` | INTEGER | NOT NULL | レコード作成日時 |
| `updated_at` | INTEGER | NOT NULL | レコード更新日時 |

**continentの値:**
- `'Asia'`: アジア
- `'Europe'`: ヨーロッパ
- `'North America'`: 北アメリカ
- `'South America'`: 南アメリカ
- `'Africa'`: アフリカ
- `'Oceania'`: オセアニア
- `'Antarctica'`: 南極

---

## 4. TypeScriptインターフェース

### 4-1. データベース行型（Row Types）

SQLiteから取得した生データの型定義。

```typescript
// src/types/database.ts

/**
 * experiencesテーブルの行型
 */
export interface ExperienceRow {
  id: string;
  user_id: string;
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
```

### 4-2. アプリケーション層の型（Domain Models）

アプリケーション内で使用する、よりTypeScriptらしい型定義。

```typescript
// src/types/models.ts

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
```

### 4-3. 型変換ヘルパー

DBの行型とアプリケーション層の型を相互変換します。

```typescript
// src/database/mappers.ts

/**
 * ExperienceRow → Experience
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
```

---

## 5. CRUD操作

### 5-1. データベースサービスクラス

```typescript
// src/database/DatabaseService.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * データベースの初期化
   */
  async appInitialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('experience-the-world.db');
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
   * 体験記録を作成
   */
  async appCreateExperience(
    data: Omit<Experience, 'id' | 'syncStatus'>
  ): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    const timestamp = Math.floor(data.timestamp.getTime() / 1000);

    await this.db.runAsync(
      `INSERT INTO experiences (
        id, user_id, timestamp, latitude, longitude,
        address, place_name, country_code,
        weather_condition, weather_temperature, weather_icon,
        text_notes, tags, sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        'default_user', // Phase 1は固定
        timestamp,
        data.location.latitude,
        data.location.longitude,
        data.location.address,
        data.location.placeName,
        data.location.countryCode,
        data.weather?.condition || null,
        data.weather?.temperature || null,
        data.weather?.icon || null,
        data.textNotes || null,
        JSON.stringify(data.tags),
        'pending',
        now,
        now,
      ]
    );

    // メディアファイルを保存
    for (const photoPath of data.photos) {
      await this.appCreateMediaFile(id, 'photo', photoPath);
    }
    for (const audioPath of data.audioMemos) {
      await this.appCreateMediaFile(id, 'audio_memo', audioPath);
    }
    for (const ambientPath of data.ambientSounds) {
      await this.appCreateMediaFile(id, 'ambient_sound', ambientPath);
    }

    // 訪問国を更新
    if (data.location.countryCode) {
      await this.appUpsertVisitedCountry(
        data.location.countryCode,
        data.location.countryCode // 仮の国名
      );
    }

    return id;
  }

  /**
   * メディアファイルを作成
   */
  private async appCreateMediaFile(
    experienceId: string,
    fileType: 'photo' | 'audio_memo' | 'ambient_sound',
    filePath: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    // ファイル情報を取得
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    const fileSize = fileInfo.exists ? fileInfo.size : null;

    await this.db.runAsync(
      `INSERT INTO media_files (
        id, experience_id, file_type, file_path,
        file_size, duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, experienceId, fileType, filePath, fileSize, null, now]
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

export const db = new DatabaseService();
```

---

## 6. ファイル管理戦略

### 6-1. ディレクトリ構造

```
{FileSystem.documentDirectory}/
  media/
    photos/
      {experience_id}/
        {uuid}.jpg
    audio_memos/
      {experience_id}/
        {uuid}.m4a
    ambient_sounds/
      {experience_id}/
        {uuid}.m4a
```

### 6-2. ファイル保存フロー

```typescript
// src/services/MediaService.ts
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;

export class MediaService {
  /**
   * 写真を保存
   */
  async appSavePhoto(
    experienceId: string,
    photoUri: string
  ): Promise<string> {
    const dir = `${MEDIA_DIR}photos/${experienceId}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const filename = `${uuidv4()}.jpg`;
    const destPath = `${dir}${filename}`;

    await FileSystem.copyAsync({
      from: photoUri,
      to: destPath,
    });

    return destPath;
  }

  /**
   * 音声を保存
   */
  async appSaveAudio(
    experienceId: string,
    audioUri: string,
    type: 'audio_memo' | 'ambient_sound'
  ): Promise<string> {
    const subDir = type === 'audio_memo' ? 'audio_memos' : 'ambient_sounds';
    const dir = `${MEDIA_DIR}${subDir}/${experienceId}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const filename = `${uuidv4()}.m4a`;
    const destPath = `${dir}${filename}`;

    await FileSystem.moveAsync({
      from: audioUri,
      to: destPath,
    });

    return destPath;
  }

  /**
   * ファイルを削除（体験記録削除時）
   */
  async appDeleteExperienceFiles(experienceId: string): Promise<void> {
    const dirs = [
      `${MEDIA_DIR}photos/${experienceId}/`,
      `${MEDIA_DIR}audio_memos/${experienceId}/`,
      `${MEDIA_DIR}ambient_sounds/${experienceId}/`,
    ];

    for (const dir of dirs) {
      const info = await FileSystem.getInfoAsync(dir);
      if (info.exists) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
    }
  }
}

export const mediaService = new MediaService();
```

---

## 7. マイグレーション戦略

### 7-1. バージョン管理

```typescript
// src/database/migrations.ts
const DB_VERSION = 1;

interface Migration {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      // 初期テーブル作成（appCreateTablesで実行済み）
    },
  },
  // 将来のマイグレーション例:
  // {
  //   version: 2,
  //   up: async (db) => {
  //     await db.execAsync(`
  //       ALTER TABLE experiences ADD COLUMN emotion TEXT;
  //     `);
  //   },
  // },
];

export async function appRunMigrations(
  db: SQLite.SQLiteDatabase
): Promise<void> {
  // バージョン管理テーブル作成
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY NOT NULL
    );
  `);

  // 現在のバージョンを取得
  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
  );
  const currentVersion = result?.version || 0;

  // マイグレーション実行
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration v${migration.version}`);
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        [migration.version]
      );
    }
  }
}
```

### 7-2. マイグレーション例（v2: 感情カラム追加）

```typescript
{
  version: 2,
  up: async (db) => {
    // 新しいカラムを追加
    await db.execAsync(`
      ALTER TABLE experiences ADD COLUMN emotion TEXT;
    `);
  },
}
```

---

## 8. Phase 2への移行計画

### 8-1. クラウド同期の設計

**Phase 2で実装する機能:**
1. Firebase Firestore または PostgreSQL への同期
2. メディアファイルのクラウドストレージ（AWS S3 / Google Cloud Storage）
3. 同期状態の管理（`sync_status`フラグ）

### 8-2. 同期戦略

```typescript
// Phase 2で実装予定
class SyncService {
  /**
   * 未同期の体験記録を同期
   */
  async appSyncPendingExperiences(): Promise<void> {
    // 1. sync_status = 'pending' のレコードを取得
    const pending = await db.getAllAsync<ExperienceRow>(
      'SELECT * FROM experiences WHERE sync_status = ?',
      ['pending']
    );

    for (const exp of pending) {
      try {
        // 2. Firestore / PostgreSQL にアップロード
        await this.appUploadExperience(exp);

        // 3. メディアファイルをクラウドストレージにアップロード
        await this.appUploadMediaFiles(exp.id);

        // 4. sync_status を 'synced' に更新
        await db.runAsync(
          'UPDATE experiences SET sync_status = ? WHERE id = ?',
          ['synced', exp.id]
        );
      } catch (error) {
        // 5. エラー時は 'error' に設定
        await db.runAsync(
          'UPDATE experiences SET sync_status = ? WHERE id = ?',
          ['error', exp.id]
        );
      }
    }
  }
}
```

### 8-3. データエクスポート

```typescript
/**
 * SQLiteからJSONエクスポート（バックアップ・移行用）
 */
async function appExportDatabase(): Promise<string> {
  const experiences = await db.getAllAsync('SELECT * FROM experiences');
  const mediaFiles = await db.getAllAsync('SELECT * FROM media_files');
  const visitedCountries = await db.getAllAsync('SELECT * FROM visited_countries');

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      experiences,
      mediaFiles,
      visitedCountries,
    },
  };

  return JSON.stringify(exportData, null, 2);
}
```

### 8-4. ローカルDBの役割変更

**Phase 1（現在）:**
- ローカルDBが唯一のデータソース

**Phase 2以降:**
- ローカルDBはキャッシュとして機能
- クラウドが正とするデータソース
- オフライン時はローカルDBを使用
- オンライン復帰時に同期

---

## 9. パフォーマンス最適化

### 9-1. インデックス戦略

**作成済みインデックス:**
- `idx_experiences_timestamp`: タイムライン表示の高速化
- `idx_experiences_country`: 国別フィルタリング
- `idx_experiences_sync`: 未同期レコードの取得
- `idx_media_experience`: メディアファイルの結合
- `idx_countries_continent`: 大陸別の集計

### 9-2. クエリ最適化

```typescript
// ❌ 悪い例: N+1クエリ
for (const exp of experiences) {
  const media = await db.getAllAsync(
    'SELECT * FROM media_files WHERE experience_id = ?',
    [exp.id]
  );
}

// ✅ 良い例: JOINクエリ
const result = await db.getAllAsync(`
  SELECT
    e.*,
    m.id as media_id,
    m.file_type,
    m.file_path
  FROM experiences e
  LEFT JOIN media_files m ON e.id = m.experience_id
  ORDER BY e.timestamp DESC
`);
```

### 9-3. トランザクション

```typescript
// 複数操作をトランザクションで実行
await db.withTransactionAsync(async () => {
  await db.runAsync('INSERT INTO experiences ...');
  await db.runAsync('INSERT INTO media_files ...');
  await db.runAsync('UPDATE visited_countries ...');
});
```

---

## 10. セキュリティ考慮事項

### 10-1. SQLインジェクション対策

**❌ 危険な例:**
```typescript
const query = `SELECT * FROM experiences WHERE id = '${userId}'`;
```

**✅ 安全な例:**
```typescript
const query = 'SELECT * FROM experiences WHERE id = ?';
await db.getAllAsync(query, [userId]);
```

### 10-2. ファイルパスの検証

```typescript
function appValidateFilePath(filePath: string): boolean {
  // MEDIA_DIRの配下であることを確認
  return filePath.startsWith(MEDIA_DIR);
}
```

### 10-3. Phase 2での暗号化

```typescript
// Phase 2で実装予定
// expo-secure-store: 機密情報の暗号化保存
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('user_token', token);
```

---

## 11. テスト戦略

### 11-1. ユニットテスト

```typescript
// __tests__/database/DatabaseService.test.ts
import { db } from '../src/database/DatabaseService';

describe('DatabaseService', () => {
  beforeEach(async () => {
    await db.appInitialize();
  });

  test('should create experience', async () => {
    const id = await db.appCreateExperience({
      timestamp: new Date(),
      location: {
        latitude: 35.6812,
        longitude: 139.7671,
        address: '東京都',
        placeName: '東京タワー',
        countryCode: 'JP',
      },
      weather: null,
      photos: [],
      audioMemos: [],
      ambientSounds: [],
      tags: ['tokyo'],
    });

    expect(id).toBeDefined();
  });
});
```

### 11-2. 統合テスト

```typescript
test('should handle complete photo capture flow', async () => {
  // 1. 写真撮影
  const photoUri = 'file:///temp/photo.jpg';

  // 2. 位置情報取得
  const location = await Location.getCurrentPositionAsync({});

  // 3. 体験記録作成
  const expId = await db.appCreateExperience({...});

  // 4. ファイル保存
  const savedPath = await mediaService.appSavePhoto(expId, photoUri);

  // 5. 取得確認
  const experiences = await db.appGetExperiences();
  expect(experiences[0].photos).toContain(savedPath);
});
```

---

## 12. まとめ

### 12-1. Phase 1の実装範囲

- ✅ Expo SQLiteによるローカルDB
- ✅ 3テーブル（experiences, media_files, visited_countries）
- ✅ expo-file-systemによるメディアファイル管理
- ✅ CRUD操作の実装
- ✅ マイグレーション機構

### 12-2. 次のステップ

1. **Expoプロジェクトの初期化**
2. **DatabaseServiceの実装**
3. **MediaServiceの実装**
4. **カメラ画面の実装**（expo-camera）
5. **タイムライン画面の実装**

---

**このドキュメントは、Phase 1の実装中に随時更新されます。**
