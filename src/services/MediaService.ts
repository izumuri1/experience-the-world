/**
 * メディアファイル管理サービス
 * 写真・音声ファイルの保存・削除を管理
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';
import {
  MEDIA_DIR,
  PHOTOS_DIR,
  AUDIO_MEMOS_DIR,
  AMBIENT_SOUNDS_DIR,
} from '../constants';

class MediaService {
  /**
   * メディアディレクトリの初期化
   */
  async appInitializeDirectories(): Promise<void> {
    const dirs = [MEDIA_DIR, PHOTOS_DIR, AUDIO_MEMOS_DIR, AMBIENT_SOUNDS_DIR];

    for (const dir of dirs) {
      const info = await FileSystem.getInfoAsync(dir);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
    }
  }

  /**
   * 写真を保存
   */
  async appSavePhoto(
    experienceId: string,
    photoUri: string
  ): Promise<string> {
    const dir = `${PHOTOS_DIR}${experienceId}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const filename = `${Crypto.randomUUID()}.jpg`;
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
    const subDir = type === 'audio_memo' ? AUDIO_MEMOS_DIR : AMBIENT_SOUNDS_DIR;
    const dir = `${subDir}${experienceId}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const filename = `${Crypto.randomUUID()}.m4a`;
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
      `${PHOTOS_DIR}${experienceId}/`,
      `${AUDIO_MEMOS_DIR}${experienceId}/`,
      `${AMBIENT_SOUNDS_DIR}${experienceId}/`,
    ];

    for (const dir of dirs) {
      const info = await FileSystem.getInfoAsync(dir);
      if (info.exists) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
    }
  }

  /**
   * ファイル情報を取得
   */
  async appGetFileInfo(filePath: string): Promise<{ size: number } | null> {
    const info = await FileSystem.getInfoAsync(filePath);
    if (info.exists && 'size' in info) {
      return { size: info.size };
    }
    return null;
  }
}

// シングルトンインスタンス
export const mediaService = new MediaService();
