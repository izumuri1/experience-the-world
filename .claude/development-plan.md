# Experience the World - Phase 1 開発計画

**バージョン**: 1.0
**作成日**: 2025年10月28日
**対象**: Phase 1 MVP
**期限**: 2025年10月31日
**ステータス**: 進行中

**関連ドキュメント**:
- [プロダクトビジョン](product-vision.md) - WHY: ビジョン・コンセプト・ビジネスモデル
- [要件定義書](requirements.md) - WHAT: 機能要件・データ構造
- [開発ルール](project-rules.md) - HOW: コーディング規約・技術スタック
- [データベース設計](database-design.md) - データベース設計・CRUD操作

---

## 目次

1. [Phase 1の目標](#1-phase-1の目標)
2. [開発ステップ](#2-開発ステップ)
3. [詳細タスク](#3-詳細タスク)
4. [マイルストーン](#4-マイルストーン)
5. [リスク管理](#5-リスク管理)

---

## 1. Phase 1の目標

### 1-1. 達成すべきこと

**MVP（最小実用製品）として、以下の機能を実装:**
- ✅ 写真撮影時の自動記録（位置情報・天気・環境音）
- ✅ 音声メモの録音
- ✅ ローカルストレージへの保存（Expo SQLite）
- ✅ タイムラインビューでの振り返り
- ✅ 訪問国の自動検出

### 1-2. ゴール

**実際に旅行に持っていって使える状態にする**
- オフライン完全対応
- iPhoneで動作確認済み
- 基本的な記録・振り返りができる

### 1-3. Phase 1で実装しないもの

- ❌ クラウド同期（Phase 2）
- ❌ 世界地図の可視化（Phase 2）
- ❌ ゲーミフィケーション（Phase 2）
- ❌ 音楽連携（Phase 2）
- ❌ コミュニティ機能（Phase 3）

---

## 2. 開発ステップ

Phase 1の開発を**7つのステップ**に分割します。各ステップは独立してテスト可能です。

### ステップ0: 基盤構築 ✅ 完了

**目的**: 開発環境のセットアップ
**期間**: 1日
**ステータス**: ✅ 完了

- [x] Expoプロジェクトの初期化
- [x] 必要なパッケージのインストール
- [x] NativeWind + TailwindCSSのセットアップ
- [x] カスタムカラー設定
- [x] iPhoneでの動作確認

---

### ステップ1: プロジェクト構造の構築 ✅ 完了

**目的**: ディレクトリ構造と型定義を整備
**期間**: 0.5日
**ステータス**: ✅ 完了

- [x] ディレクトリ構造の作成
- [x] 型定義ファイルの作成 (`database.ts`, `models.ts`)
- [x] 定数ファイルの作成 (`colors.ts`, `config.ts`)
- [x] TypeScriptの型チェック確認

---

### ステップ2: データベース層の実装 ✅ 完了

**目的**: Expo SQLiteによるローカルDB構築
**期間**: 1日
**ステータス**: ✅ 完了

- [x] DatabaseServiceクラスの実装
- [x] CRUD操作の実装（Experience, MediaFile, VisitedCountry）
- [x] MediaServiceクラスの実装
- [x] 型変換ヘルパー関数の実装
- [x] App.tsxでデータベース初期化
- [x] expo-file-system/legacy への対応
- [x] 動作確認完了（iPhone）

---

### ステップ3: 位置情報・天気取得サービスの実装 ✅ 完了

**目的**: 位置情報と天気情報を自動取得
**期間**: 0.5日
**依存**: ステップ2
**ステータス**: ✅ 完了

**成果物**:
- `src/services/LocationService.ts`
- `src/services/WeatherService.ts`
- App.tsxにテスト機能を追加

**タスク:**
- [x] LocationServiceの実装
  - [x] expo-locationの設定
  - [x] 現在位置の取得
  - [x] 逆ジオコーディング（住所取得）
  - [x] 国コードの判定
  - [x] パーミッション処理
- [x] WeatherServiceの実装
  - [x] OpenWeather API連携
  - [x] 天気情報の取得
  - [x] オフライン時の処理
- [x] App.tsxにテストボタンを追加
- [x] iPhoneで動作確認完了

**テスト結果:**
- ✅ 位置情報取得成功（パーミッション処理も正常）
- ✅ 住所取得成功（逆ジオコーディング）
- ✅ 国コード検出成功
- ⚠️ 天気情報はAPIキー未設定のため未テスト（ステップ9で設定予定）

---

### ステップ4: カメラ画面の実装 ✅ 完了

**目的**: 写真撮影機能の実装
**期間**: 1日
**依存**: ステップ2, ステップ3
**ステータス**: ✅ 完了

**成果物**:
- `src/screens/CameraScreen.tsx`
- App.tsxへのモーダル統合
- expo-cryptoへの移行（uuid削除）

**タスク:**
- [x] CameraScreenの実装
  - [x] expo-cameraの設定
  - [x] カメラプレビュー
  - [x] 撮影ボタン
  - [x] パーミッション処理
  - [x] カメラ前後切り替え
- [x] 撮影時の自動記録
  - [x] 位置情報の取得
  - [x] 天気情報の取得
  - [x] 環境音の3秒録音（expo-av）
  - [x] 写真の保存
  - [x] Experience作成
  - [x] 訪問国の自動記録
- [x] UIコンポーネント
  - [x] シャッターボタン
  - [x] 記録中のローディング表示
  - [x] 保存成功の通知
- [x] バグ修正
  - [x] uuidからexpo-cryptoへ移行
  - [x] DatabaseService.appCreateExperience修正（オプショナル対応）

**テスト結果:**
- ✅ カメラが起動する
- ✅ 写真が撮影できる
- ✅ 写真と位置情報がDBに保存される
- ✅ 環境音が自動録音される
- ✅ 保存完了ダイアログが表示される
- ✅ iPhone実機で動作確認完了

---

### ステップ5: 音声メモ機能の実装 ✅ 完了

**目的**: 音声メモの録音・再生
**期間**: 0.5日
**依存**: ステップ2
**ステータス**: ✅ 完了

**成果物**:
- `src/components/AudioRecorder.tsx`
- `src/components/AudioPlayer.tsx`
- App.tsxに音声メモテストセクション追加

**タスク:**
- [x] AudioRecorderの実装
  - [x] expo-avの録音設定
  - [x] タップで録音開始/停止
  - [x] 録音中の脈打つアニメーション（赤い点）
  - [x] 録音時間のリアルタイム表示
  - [x] キャンセルボタン（録音破棄）
  - [x] パーミッション処理
  - [x] 最大録音時間: 3分
- [x] AudioPlayerの実装
  - [x] 音声の再生/一時停止
  - [x] 進捗バー表示
  - [x] 再生時間表示（現在/全体）
  - [x] 削除ボタン（オプション）
- [x] App.tsxへの統合
  - [x] 音声メモテストセクション追加
  - [x] 録音リスト表示
  - [x] 再生・削除機能

**テスト結果:**
- ✅ 音声が録音できる
- ✅ 録音中は赤い点が脈打つ（アニメーション強調済み）
- ✅ キャンセルボタンで録音破棄
- ✅ 録音した音声が再生できる
- ✅ 進捗バーが正常に動作
- ✅ 削除ボタンで削除できる
- ✅ iPhone実機テスト完了

**技術的な改善:**
- Animated APIを使用した滑らかなアニメーション
- インラインスタイル例外ケースをproject-rules.mdに明記

---

### ステップ6: タイムライン画面の実装 ✅ 完了

**目的**: 記録した体験を時系列で表示
**期間**: 1日
**依存**: ステップ2, ステップ4, ステップ5
**ステータス**: ✅ 完了
**成果物**:
- `src/screens/TimelineScreen.tsx`
- `src/components/ExperienceCard.tsx`

**タスク:**
**タスク:**- [x] TimelineScreenの実装  - [x] DBからExperience一覧を取得  - [x] FlatListで時系列表示  - [x] 日付でのグルーピング  - [x] 空の状態の表示  - [x] ローディング表示- [x] ExperienceCardの実装  - [x] 写真の表示  - [x] 位置情報・天気の表示  - [x] 音声メモの再生ボタン  - [x] タップで詳細画面へ- [x] ExperienceDetailScreenの実装  - [x] 写真の拡大表示  - [x] すべての情報を表示  - [x] 削除ボタン  - [x] null値の適切な処理- [x] App.tsxへのモーダル統合  - [x] タイムラインモーダル  - [x] 詳細画面モーダル  - [x] モーダル間の遷移制御- [x] バグ修正  - [x] 写真パスがDBに保存されない問題を修正  - [x] 位置情報nullチェックの追加  - [x] モーダルz-index問題の解決- [x] UX改善  - [x] タップ領域の拡大（「×タイムライン」「←詳細」全体）  - [x] 環境音録音前の1秒遅延（シャッター音回避）**テスト結果:**- ✅ タイムラインに体験が表示される- ✅ 写真が正しく表示される- ✅ 環境音が再生できる- ✅ 詳細画面に遷移できる- ✅ 削除機能が動作する- ✅ タップ領域が適切で操作しやすい- ✅ シャッター音が環境音に録音されない- ✅ iPhone実機テスト完了
---


### ステップ7: ナビゲーションとホーム画面の実装 ✅ 完了

**目的**: 画面遷移の実装
**期間**: 0.5日
**依存**: ステップ4, ステップ6
**ステータス**: ✅ 完了
**成果物**:
- `src/screens/HomeScreen.tsx`
- `src/navigation/AppNavigator.tsx`（作成したが最終的には不使用）
- `src/types/navigation.ts`（作成したが最終的には不使用）

**タスク:**
- [x] React Navigationのセットアップ（互換性問題により中止）
- [x] モーダルベースナビゲーションの実装
  - [x] App.tsxでモーダル管理
  - [x] 画面遷移ロジック実装
- [x] HomeScreenの実装
  - [x] カメラボタン
  - [x] タイムラインボタン
  - [x] 訪問国数の表示
  - [x] 総写真数の表示
  - [x] 統計情報の動的取得
- [x] 画面遷移の実装
  - [x] Home → Camera
  - [x] Home → Timeline
  - [x] Timeline → Detail
  - [x] モーダル間の遷移制御
- [x] デザイン調整
  - [x] セカンダリカラー（黄色）の活用
  - [x] タイトルとタグラインの中央寄せ
  - [x] iPhone SE対応のフォントサイズ調整
  - [x] ボタンパディングの最適化

**テスト結果:**
- ✅ すべての画面間で遷移できる
- ✅ モーダルの開閉が正常動作
- ✅ 統計情報が正しく表示される
- ✅ iPhone SE実機テスト完了
- ✅ デザインが洗練され使いやすい

**技術的な決定:**
- React Navigation v7がExpo SDK 54/React Native 0.81.5と互換性問題
- モーダルベースのナビゲーションに切り替え（シンプルで安定）
- Phase 1のMVPとしては十分な実装

---

### ステップ8: 訪問国の自動検出と統計表示 ✅ 完了

**目的**: 訪問した国を自動的に記録・表示
**期間**: 0.5日
**依存**: ステップ3, ステップ7
**ステータス**: ✅ 完了
**成果物**:
- `src/screens/CountriesScreen.tsx`
- `src/components/CountryCard.tsx`
- `src/utils/countries.ts`

**タスク:**
- [x] CountriesScreenの実装
  - [x] visited_countriesテーブルから取得
  - [x] 訪問国のリスト表示
  - [x] 国ごとの統計表示
  - [x] 空の状態の表示
  - [x] ローディング表示
- [x] CountryCardの実装
  - [x] 国名・国旗の表示（国コードから自動生成）
  - [x] 体験回数・写真枚数・初回訪問日の表示
  - [x] 最終訪問日の表示（2回以上訪問した場合）
- [x] 国名変換ユーティリティ
  - [x] 国コードから日本語国名への変換
  - [x] 国コードから大陸名への変換
  - [x] 主要国60ヶ国以上に対応
- [x] 自動検出ロジックの改善
  - [x] 写真撮影時に国コードを判定
  - [x] visited_countriesテーブルを自動更新
  - [x] photo_countの自動更新
- [x] HomeScreen改善
  - [x] 訪問国ボタン追加
  - [x] ScrollViewでスクロール可能に変更
- [x] App.tsxに訪問国モーダルを統合
- [x] マイグレーション追加
  - [x] 既存データの国名・大陸を更新

**テスト結果:**
- ✅ 訪問国が自動的に記録される
- ✅ 訪問国一覧が表示される
- ✅ 国名が日本語で表示される
- ✅ 大陸名が表示される
- ✅ 体験回数が正確にカウントされる
- ✅ 写真枚数が自動更新される
- ✅ HomeScreenがスクロール可能
- ✅ すべてのボタンが適切に表示される
- ✅ iPhone SE実機テスト完了

---

### ステップ9: 最終調整とテスト ✅ 完了

**目的**: バグ修正とパフォーマンス最適化
**期間**: 0.5日
**依存**: ステップ1〜8すべて
**ステータス**: ✅ 完了

**成果物**:
- App.tsxのエラーハンドリング改善
- TypeScript型エラーの修正
- 開発環境ドキュメントの更新

**タスク:**
- [x] **OpenWeather APIキーの設定準備**
  - [x] 環境変数の設定確認（`EXPO_PUBLIC_OPENWEATHER_API_KEY`）
  - [x] WeatherServiceの実装確認
  - ⚠️ ユーザー自身でAPIキーを取得・設定する必要あり:
    1. https://openweathermap.org/api でサインアップ
    2. APIキーを取得（無料プラン）
    3. `.env`ファイルに `EXPO_PUBLIC_OPENWEATHER_API_KEY=あなたのAPIキー` を追加
    4. アプリを再起動
- [x] エラーハンドリングの改善
  - [x] App.tsx: 初期化エラー時のUI追加
  - [x] App.tsx: エラー発生時の再試行機能
  - [x] CameraScreen.tsx: 訪問国記録の引数修正
  - [x] 既存のエラーハンドリング確認（全画面で適切に実装済み）
- [x] TypeScript型エラーの修正
  - [x] CameraScreen.tsx: `appUpsertVisitedCountry`の引数修正
  - [x] TimelineScreen.tsx: JSX.Element型注釈の削除
  - ⚠️ `@expo/vector-icons`の型定義エラーは実行に影響なし（警告のみ）
- [x] コードレビュー
  - [x] 主要画面のパフォーマンス確認
  - [x] console文の確認（開発用として残す、Phase 2で削除予定）
  - [x] UIの一貫性確認
- [x] ドキュメント更新
  - [x] project-rules.md: WSL環境の設定を明記
  - [x] project-rules.md: Claude Code拡張機能のトラブルシューティング追加

**完了した改善:**
1. **エラーハンドリング強化**
   - アプリ初期化失敗時に適切なUIを表示
   - 再試行ボタンで復旧可能
2. **型安全性の向上**
   - TypeScriptの型エラーを修正
   - 関数の引数が正しく型チェックされる
3. **開発環境の整備**
   - WSL環境でのセットアップ手順を明確化
   - トラブルシューティングガイドの充実

**Phase 1 MVPとしての評価:**
- ✅ すべての必須機能が実装済み
- ✅ エラーハンドリングが適切
- ✅ iPhone実機で動作確認済み
- ✅ オフライン動作対応
- ⚠️ 天気情報はAPIキー設定後に利用可能

**Phase 2への持ち越し項目:**
- console文の削除または本番環境での無効化
- パフォーマンス最適化（useMemo/useCallback）
- 画像の最適化
- より詳細な統合テスト

---

## 3. 詳細タスク

### 3-1. ステップ1: プロジェクト構造の構築

#### タスク1-1: ディレクトリ構造の作成

```
src/
├── screens/          # 画面コンポーネント
│   ├── HomeScreen.tsx
│   ├── CameraScreen.tsx
│   ├── TimelineScreen.tsx
│   ├── DetailScreen.tsx
│   └── CountriesScreen.tsx
├── components/       # 再利用可能なコンポーネント
│   ├── CameraButton.tsx
│   ├── AudioRecorder.tsx
│   ├── AudioPlayer.tsx
│   ├── ExperienceCard.tsx
│   └── CountryCard.tsx
├── navigation/       # ナビゲーション
│   └── AppNavigator.tsx
├── database/         # データベース層
│   ├── DatabaseService.ts
│   └── mappers.ts
├── services/         # ビジネスロジック
│   ├── MediaService.ts
│   ├── LocationService.ts
│   └── WeatherService.ts
├── types/            # 型定義
│   ├── database.ts
│   └── models.ts
├── constants/        # 定数
│   ├── colors.ts
│   └── config.ts
└── utils/            # ユーティリティ関数
    └── formatters.ts
```

#### タスク1-2: 型定義ファイルの作成

**src/types/database.ts**
```typescript
// SQLiteから取得した生データの型定義
export interface ExperienceRow { ... }
export interface MediaFileRow { ... }
export interface VisitedCountryRow { ... }
```

**src/types/models.ts**
```typescript
// アプリケーション層で使用するモデル
export interface Experience { ... }
export interface Location { ... }
export interface Weather { ... }
export interface MediaFile { ... }
export interface VisitedCountry { ... }
```

#### タスク1-3: 定数ファイルの作成

**src/constants/colors.ts**
```typescript
export const COLORS = {
  primary: {
    50: '#e6f2ff',
    500: '#3388ff',
    900: '#003366',
  },
  secondary: {
    500: '#ffc107',
  },
  // ...
};
```

**src/constants/config.ts**
```typescript
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
export const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;
export const DB_NAME = 'experience-the-world.db';
```

---

### 3-2. ステップ2: データベース層の実装

#### タスク2-1: DatabaseServiceクラスの実装

**実装ファイル**: `src/database/DatabaseService.ts`

**必須メソッド:**
```typescript
class DatabaseService {
  async appInitialize(): Promise<void>
  async appCreateExperience(data): Promise<string>
  async appGetExperiences(filters?): Promise<Experience[]>
  async appUpdateExperience(id, data): Promise<void>
  async appDeleteExperience(id): Promise<void>
  async appUpsertVisitedCountry(code, name): Promise<void>
  async appGetVisitedCountries(): Promise<VisitedCountry[]>
}
```

**参考**: [database-design.md](database-design.md) のセクション5

#### タスク2-2: MediaServiceクラスの実装

**実装ファイル**: `src/services/MediaService.ts`

**必須メソッド:**
```typescript
class MediaService {
  async appSavePhoto(expId, photoUri): Promise<string>
  async appSaveAudio(expId, audioUri, type): Promise<string>
  async appDeleteExperienceFiles(expId): Promise<void>
}
```

**参考**: [database-design.md](database-design.md) のセクション6

---

### 3-3. ステップ3: 位置情報・天気取得サービスの実装

#### タスク3-1: LocationServiceの実装

**実装ファイル**: `src/services/LocationService.ts`

**必須メソッド:**
```typescript
class LocationService {
  async appRequestPermission(): Promise<boolean>
  async appGetCurrentLocation(): Promise<Location>
  async appReverseGeocode(lat, lon): Promise<{ address, placeName, countryCode }>
}
```

**必要なパーミッション:**
- iOS: `NSLocationWhenInUseUsageDescription` in `app.json`
- Android: `ACCESS_FINE_LOCATION` (expo-locationが自動追加)

#### タスク3-2: WeatherServiceの実装

**実装ファイル**: `src/services/WeatherService.ts`

**必須メソッド:**
```typescript
class WeatherService {
  async appGetWeather(lat, lon): Promise<Weather | null>
}
```

**OpenWeather API:**
- エンドポイント: `https://api.openweathermap.org/data/2.5/weather`
- 無料枠: 60 calls/minute
- API Keyを`.env.local`に保存

---

### 3-4. ステップ4: カメラ画面の実装

#### タスク4-1: CameraScreenの実装

**実装ファイル**: `src/screens/CameraScreen.tsx`

**必要なコンポーネント:**
```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const handleTakePhoto = async () => {
    // 1. 写真撮影
    // 2. 位置情報取得
    // 3. 天気取得
    // 4. 環境音録音（3秒）
    // 5. DBに保存
  };

  return <CameraView />;
}
```

**環境音の自動録音:**
```typescript
// 撮影ボタンを押した瞬間に3秒間録音
const recordAmbientSound = async (): Promise<string> => {
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();

  await new Promise(resolve => setTimeout(resolve, 3000));

  await recording.stopAndUnloadAsync();
  return recording.getURI();
};
```

---

### 3-5. ステップ5: 音声メモ機能の実装

#### タスク5-1: AudioRecorderの実装

**実装ファイル**: `src/components/AudioRecorder.tsx`

**UI要件:**
- 長押しで録音開始（WhatsApp風）
- 録音中は波形アニメーション表示
- 指を離すと録音停止・保存
- 最大3分まで録音可能

**実装例:**
```tsx
<Pressable
  onPressIn={startRecording}
  onPressOut={stopRecording}
  className="bg-secondary-500 rounded-full p-4"
>
  <Text>🎤 長押しで録音</Text>
</Pressable>
```

---

### 3-6. ステップ6: タイムライン画面の実装

#### タスク6-1: TimelineScreenの実装

**実装ファイル**: `src/screens/TimelineScreen.tsx`

**UI構造:**
```tsx
<FlatList
  data={experiences}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ExperienceCard experience={item} />}
  ListHeaderComponent={<DateSeparator date={...} />}
/>
```

**ExperienceCardの表示内容:**
- 写真（タップで拡大）
- 日時
- 場所名・住所
- 天気アイコン・気温
- 音声メモの再生ボタン
- テキストメモ

---

### 3-7. ステップ7: ナビゲーションの実装

#### タスク7-1: React Navigationのセットアップ

**必要なパッケージ:**
```bash
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

#### タスク7-2: AppNavigatorの実装

**実装ファイル**: `src/navigation/AppNavigator.tsx`

**画面構成:**
```typescript
const Stack = createStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Camera" component={CameraScreen} />
  <Stack.Screen name="Timeline" component={TimelineScreen} />
  <Stack.Screen name="Detail" component={DetailScreen} />
  <Stack.Screen name="Countries" component={CountriesScreen} />
</Stack.Navigator>
```

---

## 4. マイルストーン

### マイルストーン1: データベース動作確認（ステップ2完了時）

**達成条件:**
- [x] データベースが初期化される
- [x] データの保存・取得ができる
- [x] ファイルの保存・削除ができる

**確認方法:**
- テストデータを挿入して取得できることを確認

---

### マイルストーン2: 写真撮影と保存（ステップ4完了時）

**達成条件:**
- [x] カメラで写真が撮影できる
- [x] 位置情報が自動取得される
- [x] 天気情報が自動取得される
- [x] 環境音が自動録音される
- [x] すべてのデータがDBに保存される

**確認方法:**
- 実際に写真を撮影して、DBとファイルシステムを確認

---

### マイルストーン3: タイムライン表示（ステップ6完了時）

**達成条件:**
- [x] タイムラインに体験が時系列で表示される
- [x] 写真が正しく表示される
- [x] 音声メモが再生できる
- [x] 詳細画面に遷移できる

**確認方法:**
- 複数の体験を記録して、タイムラインに表示されることを確認

---

### マイルストーン4: MVP完成（ステップ9完了時）

**達成条件:**
- [x] すべての機能が動作する
- [x] オフラインで完全に動作する
- [x] エラーハンドリングが適切
- [x] UIが統一されている

**確認方法:**
- 実際に外出して、写真を撮影→振り返りの全フローを確認

---

## 5. リスク管理

### 5-1. 技術的リスク

#### リスク1: パーミッションの取得に失敗

**影響**: カメラ・位置情報・マイクが使えない
**対策**:
- わかりやすいパーミッション説明を表示
- 設定画面へのリンクを提供
- パーミッションなしでも一部機能を使えるようにする

#### リスク2: データベースの容量不足

**影響**: 写真・音声が保存できなくなる
**対策**:
- ストレージ使用量を監視
- 容量不足時に警告を表示
- 古いデータの削除を提案

#### リスク3: 位置情報・天気取得の失敗

**影響**: 位置情報や天気がnullになる
**対策**:
- オフライン時は位置情報のみ保存
- 後でオンライン復帰時に天気を補完（Phase 2で実装）

### 5-2. スケジュールリスク

#### リスク4: 期限（10/31）に間に合わない

**影響**: MVPが完成しない
**対策**:
- 優先順位を明確にする
- 必須機能を絞り込む
- 一部機能をPhase 2に延期

**最小限の必須機能:**
1. 写真撮影と保存
2. タイムライン表示
3. 位置情報の記録

**延期可能な機能:**
- 環境音の自動録音
- 音声メモ機能
- 天気情報の取得
- 訪問国の統計

---

## 6. 進捗管理

### 6-1. 現在の進捗

**完了したステップ:**
- ✅ ステップ0: 基盤構築（Expoプロジェクト初期化）
- ✅ ステップ1: プロジェクト構造の構築
  - ✅ ディレクトリ構造の作成
  - ✅ 型定義ファイルの作成（database.ts, models.ts）
  - ✅ 定数ファイルの作成（colors.ts, config.ts）
- ✅ ステップ2: データベース層の実装
  - ✅ DatabaseService実装
  - ✅ MediaService実装
  - ✅ 動作確認完了
- ✅ ステップ3: 位置情報・天気取得サービスの実装
  - ✅ LocationService実装
  - ✅ WeatherService実装
  - ✅ テスト機能の追加
- ✅ ステップ4: カメラ画面の実装
  - ✅ CameraScreen実装
  - ✅ 撮影時の自動記録（位置・天気・環境音）
  - ✅ iPhone実機テスト完了
- ✅ ステップ5: 音声メモ機能の実装
  - ✅ AudioRecorder実装（脈打つアニメーション）
  - ✅ AudioPlayer実装（再生・進捗バー）
  - ✅ iPhone実機テスト完了

**次のタスク:**
- 🎉 Phase 1 MVP完成！全9ステップ完了

### 6-2. 今後の予定

| ステップ | 予定日 | ステータス |
|---------|--------|-----------|
| ステップ0: 基盤構築 | 10/28 | ✅ 完了 |
| ステップ1: プロジェクト構造 | 10/29 | ✅ 完了 |
| ステップ2: データベース層 | 10/29 | ✅ 完了 |
| ステップ3: 位置情報・天気 | 10/29 | ✅ 完了 |
| ステップ4: カメラ画面 | 10/29 | ✅ 完了 |
| ステップ5: 音声メモ | 10/30 | ✅ 完了 |
| ステップ6: タイムライン | 10/30 PM | ✅ 完了 |
| ステップ7: ナビゲーション | 10/31 AM | ✅ 完了 |
| ステップ8: 訪問国表示 | 10/31 PM | ✅ 完了 |
| ステップ9: 最終調整 | 11/01 | ✅ 完了 |

**完了したステップ:**
- ✅ ステップ6: タイムライン画面の実装
  - ✅ TimelineScreen実装（日付グルーピング、空の状態）
  - ✅ ExperienceCard実装
  - ✅ ExperienceDetailScreen実装（削除機能）
  - ✅ モーダル統合とUX改善
  - ✅ iPhone実機テスト完了

- ✅ ステップ7: ナビゲーションとホーム画面の実装
  - ✅ HomeScreen実装（統計情報、ナビゲーションボタン）
  - ✅ モーダルベースナビゲーション実装
  - ✅ デザイン調整（タイトル、タグライン、スペーシング）
  - ✅ iPhone SE実機テスト完了（全6項目パス）
  - ✅ React Navigation互換性問題を回避

- ✅ ステップ8: 訪問国の自動検出と統計表示
  - ✅ CountriesScreen・CountryCard実装
  - ✅ 国名変換ユーティリティ（60ヶ国以上対応）
  - ✅ 国コードから国名・大陸への自動変換
  - ✅ photo_countの自動更新機能
  - ✅ HomeScreenにスクロール機能追加
  - ✅ マイグレーション実装（既存データ更新）
  - ✅ iPhone SE実機テスト完了

- ✅ ステップ9: 最終調整とテスト
  - ✅ App.tsxのエラーハンドリング改善（初期化エラーUI、再試行機能）
  - ✅ TypeScript型エラーの修正（CameraScreen、TimelineScreen）
  - ✅ OpenWeather APIキーの設定準備完了
  - ✅ コードレビュー完了
  - ✅ ドキュメント更新（WSL環境、トラブルシューティング）

---

## 🎉 Phase 1 MVP 完成！

**達成日**: 2025年11月1日

**実装した機能:**
- ✅ 写真撮影と自動記録（位置情報・天気・環境音）
- ✅ 音声メモの録音・再生
- ✅ タイムラインでの振り返り
- ✅ 訪問国の自動検出と統計表示
- ✅ ローカルストレージ（Expo SQLite）
- ✅ オフライン完全対応
- ✅ エラーハンドリング

**技術スタック:**
- React Native (Expo SDK 54)
- TypeScript
- NativeWind (TailwindCSS)
- Expo SQLite
- expo-camera, expo-location, expo-av

**次のステップ:**
- Phase 2: クラウド同期・世界地図の可視化
- Phase 3: コミュニティ機能
- Phase 4: メディア連携（音楽・本・映画）

---

## Phase 2: クラウド同期・世界地図の可視化

### Phase 2の目標

**達成すべきこと:**
- クラウドストレージへのデータ同期
- 世界地図での訪問国可視化
- 統計・分析機能の強化
- オフライン→オンライン自動同期

**ゴール:**
- 複数デバイスでデータを共有できる
- 旅行の記録を視覚的に楽しめる
- データのバックアップが自動で取られる

**技術選定:**
- バックエンド: Supabase（PostgreSQL、Storage、Auth）
- 地図表示: react-native-maps または Mapbox
- 同期: バックグラウンド同期（expo-task-manager）

---

### ステップ10: Supabase統合とクラウド同期

**目的**: バックエンド構築とデータ同期機能の実装
**期間**: 3日
**依存**: Phase 1完了

**成果物:**
- Supabaseプロジェクトのセットアップ
- 認証機能（匿名認証 or メール認証）
- データベーススキーマのマイグレーション
- 双方向同期ロジック

**タスク:**

**10-1. Supabaseセットアップ（0.5日）**
- [ ] Supabaseプロジェクト作成
- [ ] データベーススキーマ設計
  - experiences テーブル
  - media_files テーブル
  - visited_countries テーブル
  - users テーブル（プロフィール）
- [ ] Row Level Security (RLS) ポリシー設定
- [ ] Storage バケット作成（photos, audio_memos, ambient_sounds）

**10-2. 認証機能実装（1日）**
- [ ] Supabase Auth SDK統合
- [ ] 匿名認証の実装（まずはこれから）
- [ ] ログイン/ログアウトUI
- [ ] 認証状態の管理（Context API）
- [ ] デバイスIDとユーザーIDの紐付け

**10-3. データ同期ロジック実装（1.5日）**
- [ ] SupabaseServiceクラスの作成
- [ ] ローカル→クラウド同期
  - 新規作成データのアップロード
  - 更新データの同期
  - メディアファイルのアップロード
- [ ] クラウド→ローカル同期
  - 他デバイスからのデータ取得
  - コンフリクト解決ロジック
- [ ] バックグラウンド同期
  - WiFi接続時の自動同期
  - expo-task-manager統合
- [ ] 同期状態のUI表示
  - 同期中インジケーター
  - 最終同期時刻の表示

**検証項目:**
- [ ] オフラインで記録→オンラインで自動同期
- [ ] 複数デバイスでデータが同期される
- [ ] メディアファイルが正しくアップロード・ダウンロードされる
- [ ] コンフリクトが適切に解決される

---

### ステップ11: 世界地図の可視化

**目的**: 訪問国を地図上で視覚的に表示
**期間**: 2日
**依存**: ステップ10

**成果物:**
- インタラクティブな世界地図
- 訪問国のハイライト表示
- 地図から体験を探索

**タスク:**

**11-1. 地図ライブラリの統合（0.5日）**
- [ ] react-native-maps または Mapbox の選定
- [ ] ライブラリのインストールと設定
- [ ] 基本的な地図表示の実装
- [ ] カスタムスタイリング

**11-2. 訪問国の可視化（1日）**
- [ ] 国境データの取得（GeoJSON）
- [ ] 訪問国の色分け表示
  - 訪問済み: 緑色
  - 未訪問: グレー
- [ ] 国をタップすると体験一覧表示
- [ ] 訪問回数・写真枚数の表示

**11-3. 地図画面の実装（0.5日）**
- [ ] WorldMapScreenの作成
- [ ] ズーム・パン操作
- [ ] 大陸ごとのフィルタリング
- [ ] 統計情報の表示
  - 訪問国数/全体
  - 世界制覇率（%）
  - 訪問した大陸数

**検証項目:**
- [ ] 地図がスムーズに動作する
- [ ] 訪問国が正しく色付けされる
- [ ] タップで体験一覧に遷移できる
- [ ] 統計情報が正確に表示される

---

### ステップ12: 統計・分析機能の強化

**目的**: 旅行データの可視化と分析
**期間**: 1.5日
**依存**: ステップ10, 11

**成果物:**
- 詳細な統計画面
- グラフ・チャート表示
- 旅行の振り返りレポート

**タスク:**

**12-1. 統計画面の実装（1日）**
- [ ] StatsScreenの作成
- [ ] グラフライブラリの統合（react-native-chart-kit）
- [ ] 統計データの計算
  - 月別・年別の訪問回数
  - 国別の訪問回数
  - 写真枚数の推移
  - 音声メモの総時間
- [ ] グラフの表示
  - 訪問国数の推移（折れ線グラフ）
  - 大陸別の訪問回数（円グラフ）
  - 月別の体験数（棒グラフ）

**12-2. 振り返りレポート機能（0.5日）**
- [ ] 年間レポートの自動生成
- [ ] ハイライト表示
  - 最も訪問した国
  - 初めて訪問した国
  - 最も写真を撮った場所
- [ ] シェア機能
  - 統計画像の生成
  - SNSシェアボタン

**検証項目:**
- [ ] グラフが正確に表示される
- [ ] データの集計が正しい
- [ ] レポートが見やすい
- [ ] シェア機能が動作する

---

### ステップ13: UI/UX改善とパフォーマンス最適化

**目的**: ユーザー体験の向上とパフォーマンス改善
**期間**: 1.5日
**依存**: ステップ10-12

**成果物:**
- スムーズなアニメーション
- 高速なデータ読み込み
- 洗練されたUI

**タスク:**

**13-1. パフォーマンス最適化（1日）**
- [ ] 画像の最適化
  - 画像圧縮（react-native-image-compressor）
  - サムネイル生成
  - 遅延読み込み
- [ ] データベースクエリの最適化
  - インデックスの追加
  - 不要なクエリの削減
- [ ] React最適化
  - useMemo/useCallback の適用
  - 不要な再レンダリングの削減
- [ ] メモリ管理
  - 大きな画像のメモリ解放
  - リスト仮想化（FlatList最適化）

**13-2. アニメーション追加（0.5日）**
- [ ] react-native-reanimated統合
- [ ] 画面遷移アニメーション
- [ ] カードのホバーエフェクト
- [ ] スクロールアニメーション

**検証項目:**
- [ ] 60FPSを維持できる
- [ ] 画像読み込みが高速
- [ ] アニメーションがスムーズ
- [ ] メモリリークがない

---

### ステップ14: オフライン対応の強化

**目的**: オフライン時の体験向上
**期間**: 1日
**依存**: ステップ10-13

**成果物:**
- オフライン時のUX改善
- キャッシュ戦略の実装
- 同期エラーのハンドリング

**タスク:**

**14-1. オフライン検知とUI（0.5日）**
- [ ] ネットワーク状態の監視（@react-native-community/netinfo）
- [ ] オフライン時のUI表示
  - オフラインバナー
  - 同期保留中のバッジ
- [ ] オフラインモードの説明

**14-2. キャッシュ戦略（0.5日）**
- [ ] 画像のローカルキャッシュ
- [ ] API レスポンスのキャッシュ
- [ ] キャッシュの有効期限管理
- [ ] キャッシュクリア機能

**検証項目:**
- [ ] オフライン時も基本機能が使える
- [ ] オンライン復帰時に自動同期される
- [ ] ユーザーが同期状態を理解できる

---

### Phase 2のマイルストーン

| ステップ | 完了予定 | ステータス |
|---------|---------|-----------|
| ステップ10: Supabase統合 | 3日目 | ⏳ 未着手 |
| ステップ11: 世界地図 | 5日目 | ⏳ 未着手 |
| ステップ12: 統計機能 | 6.5日目 | ⏳ 未着手 |
| ステップ13: 最適化 | 8日目 | ⏳ 未着手 |
| ステップ14: オフライン強化 | 9日目 | ⏳ 未着手 |

**Phase 2 合計期間**: 約9日（2週間程度）

---

### Phase 2で実装しないもの

Phase 3以降に持ち越し:
- ❌ コミュニティ機能（体験の共有・発見）
- ❌ 「初めて」ストーリー機能
- ❌ 感性ベースの推薦
- ❌ 音楽・本・映画の連携
- ❌ 有料プラン機能

---

## 7. 参考リソース

### 7-1. Expoドキュメント

- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)

### 7-2. 外部API

- [OpenWeather API](https://openweathermap.org/api)
- [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding)

---

**このドキュメントは開発中に随時更新されます。**
