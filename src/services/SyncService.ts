import { databaseService } from '../database/DatabaseService';
import supabaseService from './SupabaseService';
import { mediaService } from './MediaService';
import type { Experience } from '../types/models';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface SyncResult {
  success: boolean;
  uploadedCount: number;
  downloadedCount: number;
  error?: string;
}

class SyncService {
  private isSyncing = false;
  private listeners: Array<(status: SyncStatus, progress?: string) => void> = [];

  /**
   * 同期状態の変更を監視
   */
  onStatusChange(callback: (status: SyncStatus, progress?: string) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  private notifyListeners(status: SyncStatus, progress?: string) {
    this.listeners.forEach((listener) => listener(status, progress));
  }

  /**
   * フル同期を実行
   */
  async syncAll(userId: string): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync is already in progress');
    }

    this.isSyncing = true;
    this.notifyListeners('syncing', '同期を開始しています...');

    const result: SyncResult = {
      success: false,
      uploadedCount: 0,
      downloadedCount: 0,
    };

    try {
      // 1. ローカルの未同期データをアップロード
      this.notifyListeners('syncing', 'ローカルデータをアップロード中...');
      const uploadCount = await this.uploadLocalExperiences(userId);
      result.uploadedCount = uploadCount;

      // 2. リモートデータをダウンロード
      this.notifyListeners('syncing', 'リモートデータをダウンロード中...');
      const downloadCount = await this.downloadRemoteExperiences(userId);
      result.downloadedCount = downloadCount;

      result.success = true;
      this.notifyListeners('success', '同期が完了しました');
      console.log('[SyncService] Sync completed:', result);

      return result;
    } catch (error) {
      console.error('[SyncService] Sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : '同期に失敗しました';
      result.error = errorMessage;
      this.notifyListeners('error', errorMessage);
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * ローカルの未同期体験をSupabaseにアップロード
   */
  private async uploadLocalExperiences(userId: string): Promise<number> {
    // ローカルの全体験を取得（未同期のものを優先）
    const localExperiences = await databaseService.appGetExperiences();

    let uploadCount = 0;

    for (const experience of localExperiences) {
      try {
        // メディアファイルをアップロード
        const uploadedMediaFiles = await this.uploadMediaFiles(
          userId,
          experience.id,
          experience.mediaFiles || []
        );

        // Supabaseに体験データを保存
        await this.upsertExperienceToSupabase(userId, experience, uploadedMediaFiles);
        uploadCount++;
      } catch (error) {
        console.error(`[SyncService] Failed to upload experience ${experience.id}:`, error);
        // 個別のエラーは記録するが、同期全体は続行
      }
    }

    return uploadCount;
  }

  /**
   * メディアファイルをSupabase Storageにアップロード
   */
  private async uploadMediaFiles(
    userId: string,
    experienceId: string,
    mediaFiles: any[]
  ): Promise<any[]> {
    const client = supabaseService.getClient();
    const uploadedFiles = [];

    for (const media of mediaFiles) {
      try {
        // ローカルファイルを読み込み
        const fileUri = media.filePath;
        const fileName = `${experienceId}_${media.id}.${media.fileType === 'photo' ? 'jpg' : 'mp4'}`;
        const storagePath = `${userId}/experiences/${experienceId}/${fileName}`;

        // ファイルをBase64に変換してアップロード（React Nativeの場合）
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { data, error } = await client.storage
          .from('experience-media')
          .upload(storagePath, blob, {
            contentType: media.fileType === 'photo' ? 'image/jpeg' : 'video/mp4',
            upsert: true,
          });

        if (error) {
          console.error('[SyncService] Media upload failed:', error);
          continue;
        }

        // 公開URLを取得
        const { data: urlData } = client.storage
          .from('experience-media')
          .getPublicUrl(storagePath);

        uploadedFiles.push({
          ...media,
          cloudPath: storagePath,
          cloudUrl: urlData.publicUrl,
        });
      } catch (error) {
        console.error('[SyncService] Failed to upload media file:', error);
      }
    }

    return uploadedFiles;
  }

  /**
   * 体験データをSupabaseにアップサート
   */
  private async upsertExperienceToSupabase(
    userId: string,
    experience: Experience,
    uploadedMediaFiles: any[]
  ) {
    const client = supabaseService.getClient();

    const experienceData = {
      id: experience.id,
      user_id: userId,
      timestamp: experience.timestamp.toISOString(),
      country_code: experience.location?.countryCode || null,
      place_name: experience.location?.placeName || null,
      latitude: experience.location?.latitude || null,
      longitude: experience.location?.longitude || null,
      text_notes: experience.textNotes || null,
      weather_condition: experience.weather?.condition || null,
      temperature: experience.weather?.temperature || null,
      trip_id: experience.tripId || null,
      media_files: uploadedMediaFiles.length > 0 ? JSON.stringify(uploadedMediaFiles) : null,
    };

    const { error } = await client
      .from('experiences')
      .upsert(experienceData, { onConflict: 'id' });

    if (error) {
      console.error('[SyncService] Failed to upsert experience:', error);
      throw error;
    }

    console.log(`[SyncService] Uploaded experience ${experience.id}`);
  }

  /**
   * Supabaseから体験データをダウンロード
   */
  private async downloadRemoteExperiences(userId: string): Promise<number> {
    const client = supabaseService.getClient();

    // Supabaseから全体験を取得
    const { data: remoteExperiences, error } = await client
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('[SyncService] Failed to fetch remote experiences:', error);
      throw error;
    }

    if (!remoteExperiences || remoteExperiences.length === 0) {
      return 0;
    }

    let downloadCount = 0;

    for (const remoteExp of remoteExperiences) {
      try {
        // ローカルに存在するか確認
        const localExp = await databaseService.getExperienceById(remoteExp.id);

        // 既に存在する場合はスキップ（後でタイムスタンプ比較などで更新判断を追加可能）
        if (localExp) {
          continue;
        }

        // メディアファイルをパース
        const mediaFiles = remoteExp.media_files
          ? JSON.parse(remoteExp.media_files)
          : [];

        // ローカルに保存
        await databaseService.appCreateExperience({
          id: remoteExp.id,
          timestamp: new Date(remoteExp.timestamp),
          location: {
            countryCode: remoteExp.country_code,
            placeName: remoteExp.place_name,
            latitude: remoteExp.latitude,
            longitude: remoteExp.longitude,
          },
          textNotes: remoteExp.text_notes,
          weather: remoteExp.weather_condition
            ? {
                condition: remoteExp.weather_condition,
                temperature: remoteExp.temperature,
              }
            : undefined,
          tripId: remoteExp.trip_id,
          mediaFiles,
        });

        downloadCount++;
      } catch (error) {
        console.error(`[SyncService] Failed to download experience ${remoteExp.id}:`, error);
      }
    }

    return downloadCount;
  }

  /**
   * 旅行データを同期
   */
  async syncTrips(userId: string): Promise<void> {
    const client = supabaseService.getClient();

    // ローカルの旅行を取得
    const localTrips = await databaseService.getAllTrips();

    // Supabaseにアップロード
    for (const trip of localTrips) {
      try {
        const tripData = {
          id: trip.id,
          user_id: userId,
          title: trip.title,
          start_date: trip.start_date,
          end_date: trip.end_date,
          companions: trip.companions,
          purpose: trip.purpose,
          notes: trip.notes,
        };

        await client.from('trips').upsert(tripData, { onConflict: 'id' });
      } catch (error) {
        console.error(`[SyncService] Failed to upload trip ${trip.id}:`, error);
      }
    }

    // Supabaseから旅行をダウンロード
    const { data: remoteTrips, error } = await client
      .from('trips')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[SyncService] Failed to fetch remote trips:', error);
      return;
    }

    // ローカルに存在しない旅行を追加
    for (const remoteTrip of remoteTrips || []) {
      try {
        const localTrip = localTrips.find((t) => t.id === remoteTrip.id);
        if (!localTrip) {
          await databaseService.appCreateTrip({
            id: remoteTrip.id,
            title: remoteTrip.title,
            startDate: new Date(remoteTrip.start_date),
            endDate: remoteTrip.end_date ? new Date(remoteTrip.end_date) : undefined,
            companions: remoteTrip.companions,
            purpose: remoteTrip.purpose,
            notes: remoteTrip.notes,
          });
        }
      } catch (error) {
        console.error(`[SyncService] Failed to download trip ${remoteTrip.id}:`, error);
      }
    }
  }
}

export const syncService = new SyncService();
export default syncService;
