/**
 * ナビゲーションの型定義
 */

import type { Experience } from './models';

/**
 * メインスタックのパラメータ型
 */
export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Timeline: undefined;
  Detail: {
    experience: Experience;
  };
};
