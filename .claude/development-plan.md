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
- [x] **OpenWeather APIキーの設定**
  - [x] 環境変数の設定確認（`EXPO_PUBLIC_OPENWEATHER_API_KEY`）
  - [x] WeatherServiceの実装確認
  - [x] `.env.local`ファイルにAPIキーを設定済み
  - ✅ 天気情報の取得が正常に動作
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
- ✅ 天気情報が正常に動作（APIキー設定済み）

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

## Phase 1 拡張: 音声メモ録音機能の追加

**実装日**: 2025年11月1日
**目的**: ステップ5で実装した音声メモ機能を、実際の体験記録フローに統合

### 追加実装内容

#### 1. 写真撮影後の音声メモ録音プロンプト

**実装ファイル**: [src/screens/CameraScreen.tsx](../src/screens/CameraScreen.tsx)

**機能:**
- 写真撮影完了後、音声メモを追加するか確認するダイアログを表示
- 「今すぐ録音」を選択すると、全画面の録音UIを表示
- 「後で追加」を選択すると、カメラ画面を閉じる

**実装詳細:**
```typescript
// 撮影完了後のダイアログ
Alert.alert(
  '✅ 保存完了',
  '写真と体験が記録されました！\n音声メモを追加しますか？',
  [
    { text: '後で追加', onPress: () => onClose() },
    { text: '今すぐ録音', onPress: () => setShowAudioRecorder(true) }
  ]
);

// 全画面録音UI
{showAudioRecorder && (
  <AudioRecorder
    onRecordingComplete={handleAudioRecordingComplete}
    maxDuration={180000}
  />
)}
```

**テスト結果:**
- ✅ 写真撮影後にダイアログが表示される
- ✅ 録音UIが正しく表示される
- ✅ 録音した音声がDBに保存される
- ✅ スキップ機能が正常動作

---

#### 2. 体験詳細画面での音声メモ追加・削除

**実装ファイル**: [src/screens/ExperienceDetailScreen.tsx](../src/screens/ExperienceDetailScreen.tsx)

**機能:**
- 詳細画面から音声メモを追加できる録音ボタン
- 録音した音声メモのリスト表示
- 各音声メモの再生・削除機能
- 音声メモのローカルステート管理

**実装詳細:**
```typescript
// 録音状態管理
const [isRecording, setIsRecording] = useState(false);
const [audioMemos, setAudioMemos] = useState<string[]>(experience.audioMemos);

// 録音ボタン
{!isRecording && (
  <Pressable onPress={() => setIsRecording(true)}>
    <Ionicons name="mic" />
    <Text>録音</Text>
  </Pressable>
)}

// 録音UI（白背景用にカラー調整）
{isRecording && (
  <AudioRecorder
    onRecordingComplete={handleRecordingComplete}
    textColor="#1f2937"
    backgroundColor="#f0f9ff"
  />
)}

// 音声メモリスト
{audioMemos.map((audio) => (
  <AudioPlayer
    audioUri={audio}
    showDeleteButton={true}
    onDelete={() => handleDeleteAudioMemo(audio)}
    variant="light"
  />
))}
```

**テスト結果:**
- ✅ 録音ボタンが視認性高く表示される
- ✅ 録音UIの色が白背景に最適化される
- ✅ 録音完了後、リストに追加される
- ✅ 削除ボタンで音声メモを削除できる
- ✅ ローカルステートが正しく更新される

---

#### 3. AudioRecorderコンポーネントの改善

**実装ファイル**: [src/components/AudioRecorder.tsx](../src/components/AudioRecorder.tsx)

**改善内容:**

**3-1. カラー設定のプロパティ化**
```typescript
interface AudioRecorderProps {
  textColor?: string;        // テキスト色（デフォルト: white）
  backgroundColor?: string;  // 背景色（デフォルト: transparent）
}
```

**3-2. ボタンの視認性向上**
- 停止ボタン: 赤色（#ef4444）
- キャンセルボタン: グレー（#525252）
- マイクボタン: 黄色（#eab308）
- ボタンサイズ: 80×80px（統一）
- アイコンサイズ: 40px（統一）
- 各ボタンに明確なラベル追加

**3-3. インラインスタイルの使用**
```typescript
// NativeWindのクラスではなく、styleプロパティで背景色を指定
<Pressable
  style={{
    backgroundColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }}
>
  <Ionicons name="stop" size={40} color="#ffffff" />
</Pressable>
<Text style={{ color: textColor }}>停止して保存</Text>
```

**テスト結果:**
- ✅ 停止ボタンが赤色で明確に表示される
- ✅ キャンセルボタンがグレーで表示される
- ✅ 白背景・黒背景の両方で使用可能
- ✅ ボタンサイズが統一され操作しやすい

---

#### 4. AudioPlayerコンポーネントの改善

**実装ファイル**: [src/components/AudioPlayer.tsx](../src/components/AudioPlayer.tsx)

**改善内容:**

**4-1. variant プロパティの追加**
```typescript
interface AudioPlayerProps {
  variant?: 'light' | 'dark';  // light: 白背景用、dark: 黒背景用
}

const colors = variant === 'light'
  ? {
      background: 'rgba(0, 0, 0, 0.05)',
      text: '#1f2937',
      progressBg: 'rgba(0, 0, 0, 0.1)',
    }
  : {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      progressBg: 'rgba(255, 255, 255, 0.2)',
    };
```

**4-2. 音声クリーンアップの改善**
```typescript
useEffect(() => {
  let isMounted = true;
  let currentSound: Audio.Sound | null = null;

  const loadSound = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(...);

    if (!isMounted) {
      await newSound.unloadAsync();
      return;
    }

    currentSound = newSound;
    setSound(newSound);
  };

  return () => {
    isMounted = false;
    if (currentSound) {
      currentSound.stopAsync().catch(() => {});
      currentSound.unloadAsync().catch(() => {});
    }
  };
}, [audioUri]);
```

**4-3. 再生動作の改善**
- 一時停止 → 停止＋先頭戻しに変更
- 停止ボタン押下時に position を0にリセット
- バックグラウンド再生の防止

**4-4. 削除ボタンのサイズ統一**
```typescript
<Pressable
  className="w-10 h-10 rounded-full items-center justify-center ml-3"
  style={{ backgroundColor: '#dc2626' }}
>
  <Ionicons name="trash" size={20} color="#ffffff" />
</Pressable>
```

**テスト結果:**
- ✅ 白背景・黒背景の両方で視認性が良い
- ✅ 音声再生後にバックグラウンド再生されない
- ✅ 停止ボタンで先頭に戻る
- ✅ 削除ボタンが再生ボタンと同じサイズ
- ✅ メモリリークが発生しない

---

### 技術的な成果

#### バグ修正
1. **バックグラウンド音声再生の問題**
   - 問題: 音声再生後、アプリを閉じても音が流れ続ける
   - 解決: isMountedパターンを使用した適切なクリーンアップ

2. **ボタン色の視認性問題**
   - 問題: NativeWindのクラス（bg-red-500）が適用されず白いボタンになる
   - 解決: インラインスタイル（style={{ backgroundColor }}）に変更

3. **削除ボタンのサイズ不一致**
   - 問題: 削除ボタンが再生ボタンより小さく見えづらい
   - 解決: 両方とも10×10、アイコンサイズ20で統一

#### UX改善
1. 写真撮影直後に音声メモを追加できるフロー
2. 詳細画面から後から音声メモを追加できる柔軟性
3. 白背景・黒背景に対応した視覚的に最適化されたUI
4. 明確なボタンラベルとアイコン

#### コード品質向上
1. コンポーネントの再利用性向上（textColor, backgroundColor, variant props）
2. 適切なメモリ管理（isMountedパターン）
3. 型安全性の維持（TypeScript）

---

### 開発ドキュメントの更新

**更新ファイル:**
- [development-plan.md](.claude/development-plan.md) - Phase 2の詳細計画を追加

**Phase 2の詳細:**
- ステップ10: Supabase統合とクラウド同期（3日）
- ステップ11: 世界地図の可視化（2日）
- ステップ12: 統計・分析機能の強化（1.5日）
- ステップ13: UI/UX改善とパフォーマンス最適化（1.5日）
- ステップ14: オフライン対応の強化（1日）

**合計期間:** 約9日（2週間程度）

---

### まとめ

**Phase 1 拡張完了日**: 2025年11月1日

**追加・改善した機能:**
- ✅ CameraScreen: 写真撮影後の音声メモ録音プロンプト
- ✅ ExperienceDetailScreen: 詳細画面からの音声メモ追加・削除
- ✅ AudioRecorder: カラー設定、ボタン視認性向上
- ✅ AudioPlayer: variant対応、音声クリーンアップ改善、削除ボタンサイズ統一

**技術的成果:**
- バックグラウンド音声再生問題の解決
- NativeWindの制限を理解し、適切にインラインスタイルを使用
- コンポーネントの再利用性向上
- メモリ管理の改善

**次のステップ:**
- Phase 2: クラウド同期・世界地図の可視化

---

## Phase 2: クラウド同期・世界地図の可視化

### Phase 2の目標

**達成すべきこと:**
- **データ構造の再設計**（旅行機能の追加）
- クラウドストレージへのデータ同期
- 世界地図での訪問国可視化
- 統計・分析機能の強化
- オフライン→オンライン自動同期

**ゴール:**
- 旅行単位で体験を管理できる
- 訪問回数が正確にカウントされる
- 複数デバイスでデータを共有できる
- 旅行の記録を視覚的に楽しめる
- データのバックアップが自動で取られる

**技術選定（確定版）:**
- ✅ バックエンド: Supabase（PostgreSQL、Storage、Auth）
- ✅ 地図表示: react-native-maps + GeoJSON（natural-earth-vector）
- ✅ 認証: メール認証（Supabase Auth）
- ✅ 同期戦略: タイムスタンプ管理（Last Write Wins）
- ✅ 同期タイミング: バックグラウンド同期（expo-task-manager）

**技術選定の理由:**
1. **Supabase**: PostgreSQLで3層構造に最適、Storage/Auth統合、無料枠充実
2. **react-native-maps**: Expo対応、学習コスト低、iOS/Android両対応
3. **メール認証**: Supabase Authで簡単実装、アカウント統合が容易
4. **タイムスタンプ管理**: シンプルで確実、Phase 3でCRDTなど高度化可能

---

### Phase 2環境構築完了

**実施日**: 2025年11月2日
**ステータス**: ✅ 完了

#### 完了した作業

1. **Supabase MCP設定** ✅
   - `.vscode/settings.json`作成
   - SERVICE_ROLE_KEY設定
   - `.gitignore`で秘密情報を保護

2. **環境変数設定** ✅
   - `.env.local`にSupabase URL・ANON_KEY追加
   - 既存のOpenWeather APIキーは維持

3. **npmパッケージインストール** ✅
   - `@supabase/supabase-js` (Supabaseクライアント)
   - `@react-native-community/datetimepicker` (日付選択)
   - `@react-native-community/netinfo` (ネットワーク監視)

4. **Supabaseデータベーススキーマ作成** ✅
   - 5つのテーブル作成
     - `profiles` (ユーザープロファイル)
     - `trips` (旅行)
     - `experiences` (体験)
     - `media_files` (メディアファイル)
     - `visited_countries` (訪問国集計)
   - インデックス作成（9個）
   - RLSポリシー設定（全テーブル）
   - トリガー作成
     - `updated_at`自動更新
     - 新規ユーザー登録時プロファイル自動作成

5. **Supabase Storage設定** ✅
   - `media`バケット作成（プライベート）
   - Storageポリシー設定
     - アップロード権限
     - 読み取り権限
     - 削除権限

#### 作成したファイル

- [supabase-schema.sql](supabase-schema.sql): データベーススキーマ定義
- [supabase-storage-setup.sql](supabase-storage-setup.sql): Storageポリシー定義
- `.vscode/settings.json`: Supabase MCP設定（Git管理外）

#### 次のステップ

Phase 2の実装開始準備が整いました：
- ⏳ ステップ9.5: 旅行管理UI実装
- ⏳ ステップ10: Supabase統合
- ⏳ ステップ11-14: 地図・統計・最適化・オフライン対応

---

### ステップ0: データ構造の再設計（旅行機能の追加）

**実装日**: 2025年11月1日
**目的**: 体験を旅行単位で管理し、訪問国の統計を正確に計算する
**期間**: 完了
**依存**: Phase 1完了

**背景:**
現在のデータ構造では、体験（experiences）と訪問国（visited_countries）の2層構造になっており、訪問回数が体験回数でカウントされてしまう。例えば、1回の旅行で20枚の写真を撮ると、訪問回数が20回とカウントされてしまう問題がある。

**解決策:**
旅行（trips）を中間層として追加し、以下の3層構造に変更：
- **旅行（trips）**: 「2025年夏ヨーロッパ旅行」のような単位
- **体験（experiences）**: 各旅行に紐づく個別の体験
- **訪問国（visited_countries）**: 旅行単位で訪問回数をカウント

**実装内容:**

#### 1. データベーススキーマの追加

**tripsテーブル:**
```sql
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,              -- '2025年夏ヨーロッパ旅行'
  start_date INTEGER NOT NULL,      -- 旅行開始日（Unix timestamp）
  end_date INTEGER,                  -- 旅行終了日（進行中ならnull）
  companions TEXT,                   -- 同行者（カンマ区切り）
  purpose TEXT,                      -- '観光', '出張', 'ワーケーション'
  notes TEXT,                        -- 旅行全体のメモ
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

**trip_countriesテーブル（中間テーブル）:**
```sql
CREATE TABLE IF NOT EXISTS trip_countries (
  trip_id TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  continent TEXT,
  first_visit_date INTEGER NOT NULL,  -- その旅行での最初の訪問日
  PRIMARY KEY (trip_id, country_code),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
```

**experiencesテーブルの変更:**
- `trip_id`カラムを追加（外部キー）
- 削除時は`ON DELETE SET NULL`でtrip_idをnullに

**visited_countriesテーブル:**
- 統計用テーブルとして継続使用
- `trip_countries`から自動集計される
- `visit_count` = 旅行回数（体験回数ではない）

#### 2. マイグレーション処理

**バージョン3マイグレーション:**
- 既存の体験を「未分類の体験」という旅行に自動移行
- 国コードをグループ化してtrip_countriesに登録
- visited_countriesを再計算

```typescript
// 実装済み: DatabaseService.appMigrateToTripsSchema()
```

#### 3. DatabaseServiceの拡張

**新規メソッド:**
- [x] `appCreateTrip()` - 旅行を作成
- [x] `appGetTrips()` - 旅行一覧を取得
- [x] `appGetTripById()` - 旅行IDから取得
- [x] `appAddCountryToTrip()` - 旅行に国を追加
- [x] `appGetTripCountries()` - 旅行の訪問国一覧
- [x] `appAssignExperienceToTrip()` - 体験を旅行に紐付け
- [x] `appDeleteTrip()` - 旅行を削除
- [x] `appRecalculateVisitedCountries()` - 訪問国統計を再計算

**変更メソッド:**
- [x] `appCreateExperience()` - tripIdパラメータを追加
- [x] `appUpsertVisitedCountry()` - 非推奨化（互換性のため残す）

#### 4. 型定義の追加

**src/types/models.ts:**
```typescript
export interface Trip {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  companions?: string;
  purpose?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripCountry {
  tripId: string;
  countryCode: string;
  countryName: string;
  continent: string;
  firstVisitDate: Date;
}
```

**src/types/database.ts:**
```typescript
export interface TripRow { /* ... */ }
export interface TripCountryRow { /* ... */ }
export interface ExperienceRow {
  // trip_id カラムを追加
  trip_id: string | null;
  // ...
}
```

#### 5. データフロー

**体験作成時:**
1. tripIdが指定されていない場合、「未分類の体験」旅行を使用
2. experiencesにtrip_idを保存
3. 国コードがある場合、trip_countriesに登録
4. visited_countriesを再計算

**旅行削除時:**
1. tripsを削除
2. trip_countries自動削除（ON DELETE CASCADE）
3. experiencesのtrip_idがnullになる（ON DELETE SET NULL）
4. visited_countriesを再計算

**統計計算:**
```sql
-- 訪問回数 = trip_countriesでグループ化したCOUNT
SELECT country_code, COUNT(*) as visit_count
FROM trip_countries
GROUP BY country_code;
```

#### 6. 実装ファイル

- [x] [src/database/DatabaseService.ts](../src/database/DatabaseService.ts)
  - テーブル作成、マイグレーション、旅行関連メソッド
- [x] [src/types/models.ts](../src/types/models.ts)
  - Trip, TripCountry型定義
- [x] [src/types/database.ts](../src/types/database.ts)
  - TripRow, TripCountryRow型定義

#### 7. 今後のUI実装（Phase 2で実施）

- [ ] 旅行一覧画面
- [ ] 旅行作成・編集画面
- [ ] 旅行詳細画面（体験一覧）
- [ ] 体験を旅行に移動する機能
- [ ] 訪問国の統計表示（旅行回数）

**検証項目:**
- [x] 既存データが「未分類の体験」に移行される
- [x] 新規体験が自動的に旅行に紐付けられる
- [x] trip_countriesが正しく生成される
- [x] visited_countriesが旅行単位でカウントされる

**技術的な成果:**
- 3層データ構造の導入（trips → experiences → visited_countries）
- 中間テーブルを使った正規化
- 統計データの自動集計機構
- 後方互換性を保ったマイグレーション

**メリット:**
1. **訪問回数の正確なカウント**: 体験回数ではなく旅行回数でカウント
2. **旅行メタデータの保存**: 同行者、目的などを記録可能
3. **自然な記録単位**: 「2025年夏ヨーロッパ旅行」のような単位で管理
4. **柔軟な集計**: 期間指定、旅行ごとの統計など

#### 8. データ永続化の修正

**実装日**: 2025年11月1日
**問題**: アプリ起動時にデータベースがリセットされ、データが消失
**原因**: 開発用のappResetDatabase()が毎回実行されていた

**修正内容:**
- [DatabaseService.ts:36](../src/database/DatabaseService.ts#L36)の`await this.appResetDatabase();`をコメントアウト
- これにより、アプリ起動時にデータベースが削除されなくなる
- マイグレーションは引き続き実行され、既存データを保持したままスキーマ更新可能

**影響:**
- ✅ 写真・音声メモなどの体験データが永続化される
- ✅ 訪問国の統計が正しく蓄積される
- ✅ マイグレーションによるスキーマ更新は正常動作
- ⚠️ 本番環境ではappResetDatabaseメソッド自体の削除が必要 (TODO: line 42-61)

**コミット:**
- コミットハッシュ: 7feabe2
- メッセージ: "fix: データベースリセット処理を無効化してデータ永続化を実現"

---

**次のステップ:**
- ステップ9.5: 旅行管理UIの実装（新規追加）
- ステップ10: Supabase統合（tripsテーブルも同期）

---

### ステップ9.5: 旅行管理UI（新規追加）

**実装日**: 2025年11月2日
**目的**: Phase 1で実装したデータ構造（trips、trip_countries、experiences）を実際に使えるようにする
**期間**: 2日
**依存**: Phase 1完了、ステップ0完了

**背景:**
ステップ0でデータ構造（trips、trip_countries）は完成したが、実際に旅行を作成・管理するUIがない。
Supabase統合（ステップ10）の前に、まずローカルで旅行機能を使えるようにする。

**成果物:**
- TripsScreen.tsx（旅行一覧画面）
- TripFormScreen.tsx（旅行作成・編集画面）
- TripDetailScreen.tsx（旅行詳細画面）
- TripCard.tsx（旅行カードコンポーネント）
- TripSelector.tsx（旅行選択モーダル）
- HomeScreenへの旅行ボタン追加
- App.tsxへのモーダル統合

---

#### タスク9.5-1: 旅行一覧画面の実装（0.5日）

**TripsScreen.tsx**

**機能:**
- [ ] 旅行一覧を時系列で表示（新しい順）
- [ ] 進行中の旅行（end_dateがnull）を上部に強調表示
- [ ] 「新しい旅行を作成」ボタン
- [ ] 空の状態の表示
- [ ] ローディング表示
- [ ] 旅行タップで詳細画面へ遷移

**UI構成:**
```typescript
<ScrollView className="flex-1 bg-white">
  {/* ヘッダー */}
  <View className="p-6">
    <Text className="text-3xl font-bold text-gray-900">旅行</Text>
  </View>

  {/* 進行中の旅行 */}
  {ongoingTrips.length > 0 && (
    <View className="px-6 mb-4">
      <Text className="text-lg font-semibold text-gray-700 mb-2">進行中</Text>
      {ongoingTrips.map(trip => (
        <TripCard key={trip.id} trip={trip} variant="ongoing" onPress={() => handleTripPress(trip)} />
      ))}
    </View>
  )}

  {/* 過去の旅行 */}
  <View className="px-6">
    <Text className="text-lg font-semibold text-gray-700 mb-2">過去の旅行</Text>
    {completedTrips.map(trip => (
      <TripCard key={trip.id} trip={trip} onPress={() => handleTripPress(trip)} />
    ))}
  </View>

  {/* 新しい旅行作成ボタン */}
  <Pressable
    className="mx-6 mt-4 mb-8 bg-primary-500 rounded-xl p-4"
    onPress={() => setShowTripForm(true)}
  >
    <Ionicons name="add" size={24} color="#ffffff" />
    <Text className="text-white text-center font-semibold text-lg">新しい旅行を作成</Text>
  </Pressable>
</ScrollView>
```

**データ取得:**
```typescript
const [trips, setTrips] = useState<Trip[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadTrips();
}, []);

const loadTrips = async () => {
  try {
    const allTrips = await db.appGetTrips();
    setTrips(allTrips);
  } catch (error) {
    console.error('Failed to load trips:', error);
  } finally {
    setLoading(false);
  }
};

// 進行中と完了済みに分割
const ongoingTrips = trips.filter(t => !t.endDate);
const completedTrips = trips.filter(t => t.endDate);
```

---

#### タスク9.5-2: 旅行カードコンポーネントの実装（0.25日）

**TripCard.tsx**

**機能:**
- [ ] タイトル表示
- [ ] 期間表示（開始日〜終了日 or 「進行中」）
- [ ] 訪問国数の表示
- [ ] 体験数（写真枚数）の表示
- [ ] カバー写真の表示（最新の写真1枚）
- [ ] 進行中の旅行は黄色枠で強調

**実装:**
```typescript
interface TripCardProps {
  trip: Trip;
  variant?: 'normal' | 'ongoing';
  onPress?: () => void;
}

export default function TripCard({ trip, variant = 'normal', onPress }: TripCardProps) {
  const [stats, setStats] = useState({ experienceCount: 0, countryCount: 0 });
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadTripStats();
  }, [trip.id]);

  const loadTripStats = async () => {
    // 体験数を取得（trip_idでフィルタリング）
    const experiences = await db.appGetExperiences({ tripId: trip.id });

    // 訪問国数を取得
    const countries = await db.appGetTripCountries(trip.id);

    // カバー写真を取得（最新の体験の写真）
    if (experiences.length > 0 && experiences[0].photos.length > 0) {
      setCoverPhoto(experiences[0].photos[0]);
    }

    setStats({
      experienceCount: experiences.length,
      countryCount: countries.length,
    });
  };

  const formatDateRange = () => {
    const start = format(trip.startDate, 'yyyy/MM/dd');
    if (!trip.endDate) return `${start} 〜 進行中`;
    const end = format(trip.endDate, 'yyyy/MM/dd');
    return `${start} 〜 ${end}`;
  };

  return (
    <Pressable
      className={`mb-3 rounded-xl overflow-hidden ${
        variant === 'ongoing' ? 'border-2 border-secondary-500' : 'border border-gray-200'
      }`}
      onPress={onPress}
    >
      {/* カバー写真 */}
      {coverPhoto ? (
        <Image
          source={{ uri: coverPhoto }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-100 items-center justify-center">
          <Ionicons name="camera-outline" size={48} color="#9ca3af" />
        </View>
      )}

      <View className="bg-gray-50 p-4">
        {/* タイトル */}
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {trip.title}
        </Text>

        {/* 期間 */}
        <Text className="text-sm text-gray-600 mb-3">
          {formatDateRange()}
        </Text>

        {/* 統計 */}
        <View className="flex-row items-center">
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1 mr-4">
            {stats.countryCount}カ国
          </Text>

          <Ionicons name="camera" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {stats.experienceCount}件の体験
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
```

---

#### タスク9.5-3: 旅行作成・編集画面の実装（0.5日）

**TripFormScreen.tsx**

**機能:**
- [ ] タイトル入力（必須）
- [ ] 開始日選択（DateTimePicker）
- [ ] 終了日選択（オプション、「進行中」スイッチ）
- [ ] 同行者入力（オプション）
- [ ] 目的選択（観光、出張、ワーケーション、その他）
- [ ] メモ入力（オプション）
- [ ] 保存ボタン
- [ ] キャンセルボタン
- [ ] バリデーション（タイトル必須）

**実装:**
```typescript
interface TripFormScreenProps {
  tripId?: string; // 編集時は指定、新規作成時はundefined
  onClose: () => void;
  onSave: () => void;
}

export default function TripFormScreen({ tripId, onClose, onSave }: TripFormScreenProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOngoing, setIsOngoing] = useState(true);
  const [companions, setCompanions] = useState('');
  const [purpose, setPurpose] = useState<string>('観光');
  const [notes, setNotes] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
    if (!tripId) return;
    const trip = await db.appGetTripById(tripId);
    if (trip) {
      setTitle(trip.title);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setIsOngoing(!trip.endDate);
      setCompanions(trip.companions || '');
      setPurpose(trip.purpose || '観光');
      setNotes(trip.notes || '');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    try {
      if (tripId) {
        // 更新
        await db.appUpdateTrip(tripId, {
          title,
          startDate,
          endDate: isOngoing ? null : endDate,
          companions: companions || undefined,
          purpose: purpose || undefined,
          notes: notes || undefined,
        });
      } else {
        // 新規作成
        await db.appCreateTrip({
          title,
          startDate,
          endDate: isOngoing ? null : endDate,
          companions: companions || undefined,
          purpose: purpose || undefined,
          notes: notes || undefined,
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save trip:', error);
      Alert.alert('エラー', '旅行の保存に失敗しました');
    }
  };

  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView className="flex-1 bg-white">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Pressable onPress={onClose}>
            <Text className="text-primary-500 text-lg">キャンセル</Text>
          </Pressable>
          <Text className="text-xl font-bold">
            {tripId ? '旅行を編集' : '新しい旅行'}
          </Text>
          <Pressable onPress={handleSave}>
            <Text className="text-primary-500 text-lg font-semibold">保存</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* タイトル */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">タイトル *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="2025年夏ヨーロッパ旅行"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 開始日 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">開始日 *</Text>
            <Pressable
              className="border border-gray-300 rounded-lg px-4 py-3"
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text className="text-base">{format(startDate, 'yyyy年MM月dd日')}</Text>
            </Pressable>
          </View>

          {/* 終了日 */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-700">終了日</Text>
              <View className="flex-row items-center">
                <Switch value={isOngoing} onValueChange={setIsOngoing} />
                <Text className="text-sm text-gray-600 ml-2">進行中</Text>
              </View>
            </View>
            {!isOngoing && (
              <Pressable
                className="border border-gray-300 rounded-lg px-4 py-3"
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text className="text-base">
                  {endDate ? format(endDate, 'yyyy年MM月dd日') : '選択してください'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* 同行者 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">同行者（任意）</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="友人、家族など"
              value={companions}
              onChangeText={setCompanions}
            />
          </View>

          {/* 目的 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">目的</Text>
            <View className="flex-row flex-wrap">
              {['観光', '出張', 'ワーケーション', 'その他'].map((p) => (
                <Pressable
                  key={p}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    purpose === p ? 'bg-primary-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setPurpose(p)}
                >
                  <Text className={purpose === p ? 'text-white' : 'text-gray-700'}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* メモ */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">メモ（任意）</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="旅行の思い出など"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* DateTimePicker */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
```

**必要なパッケージ:**
```bash
npx expo install @react-native-community/datetimepicker
```

---

#### タスク9.5-4: 旅行詳細画面の実装（0.5日）

**TripDetailScreen.tsx**

**機能:**
- [ ] 旅行情報の表示（タイトル、期間、同行者、目的、メモ）
- [ ] この旅行の体験一覧（タイムライン形式）
- [ ] 訪問国リスト（国旗・国名・訪問日）
- [ ] 統計情報（写真枚数、訪問国数、期間、日数）
- [ ] 編集ボタン（TripFormScreenへ遷移）
- [ ] 削除ボタン（確認ダイアログ付き）
- [ ] 旅行終了ボタン（進行中の旅行のみ）

**実装概要:**
```typescript
interface TripDetailScreenProps {
  tripId: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TripDetailScreen({ tripId, onClose, onEdit, onDelete }: TripDetailScreenProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [countries, setCountries] = useState<TripCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      const tripData = await db.appGetTripById(tripId);
      const expData = await db.appGetExperiences({ tripId });
      const countryData = await db.appGetTripCountries(tripId);

      setTrip(tripData);
      setExperiences(expData);
      setCountries(countryData);
    } catch (error) {
      console.error('Failed to load trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    Alert.alert(
      '旅行を終了',
      'この旅行を終了しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '終了',
          onPress: async () => {
            await db.appUpdateTrip(tripId, { endDate: new Date() });
            loadTripData();
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      '旅行を削除',
      'この旅行を削除しますか？紐づく体験は「未分類の体験」に移動されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await db.appDeleteTrip(tripId);
            onDelete();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView className="flex-1 bg-white">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Pressable onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#3388ff" />
          </Pressable>
          <Text className="text-xl font-bold">{trip?.title}</Text>
          <Pressable onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color="#3388ff" />
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {/* 旅行情報 */}
          <View className="p-6 border-b border-gray-200">
            <Text className="text-sm text-gray-600 mb-2">期間</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {formatDateRange(trip)}
            </Text>

            {trip?.companions && (
              <>
                <Text className="text-sm text-gray-600 mb-2">同行者</Text>
                <Text className="text-lg text-gray-900 mb-4">{trip.companions}</Text>
              </>
            )}

            {trip?.purpose && (
              <>
                <Text className="text-sm text-gray-600 mb-2">目的</Text>
                <Text className="text-lg text-gray-900 mb-4">{trip.purpose}</Text>
              </>
            )}

            {trip?.notes && (
              <>
                <Text className="text-sm text-gray-600 mb-2">メモ</Text>
                <Text className="text-base text-gray-900">{trip.notes}</Text>
              </>
            )}
          </View>

          {/* 統計情報 */}
          <View className="p-6 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-4">統計</Text>
            <View className="flex-row flex-wrap">
              <StatCard icon="location" label="訪問国" value={`${countries.length}カ国`} />
              <StatCard icon="camera" label="体験" value={`${experiences.length}件`} />
              <StatCard icon="calendar" label="日数" value={calculateDays(trip)} />
            </View>
          </View>

          {/* 訪問国リスト */}
          {countries.length > 0 && (
            <View className="p-6 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900 mb-4">訪問国</Text>
              {countries.map((country) => (
                <View key={country.countryCode} className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-3">{getCountryFlag(country.countryCode)}</Text>
                  <View>
                    <Text className="text-base font-semibold text-gray-900">
                      {country.countryName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {format(country.firstVisitDate, 'yyyy/MM/dd')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 体験一覧 */}
          {experiences.length > 0 && (
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">体験</Text>
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </View>
          )}

          {/* アクションボタン */}
          <View className="p-6">
            {!trip?.endDate && (
              <Pressable
                className="bg-secondary-500 rounded-xl p-4 mb-3"
                onPress={handleEndTrip}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  旅行を終了
                </Text>
              </Pressable>
            )}
            <Pressable
              className="bg-red-500 rounded-xl p-4"
              onPress={handleDelete}
            >
              <Text className="text-white text-center font-semibold text-lg">
                旅行を削除
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
```

---

#### タスク9.5-5: 旅行選択モーダルの実装（0.25日）

**TripSelector.tsx**

**目的:** ExperienceDetailScreenから体験を別の旅行に移動する

**機能:**
- [ ] 旅行一覧を表示
- [ ] 「未分類の体験」も選択肢として表示
- [ ] 現在の旅行を強調表示
- [ ] 選択した旅行に体験を移動

**実装概要:**
```typescript
interface TripSelectorProps {
  currentTripId: string | null;
  experienceId: string;
  onSelect: (tripId: string | null) => void;
  onClose: () => void;
}

export default function TripSelector({ currentTripId, experienceId, onSelect, onClose }: TripSelectorProps) {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const allTrips = await db.appGetTrips();
    setTrips(allTrips);
  };

  const handleSelect = async (tripId: string | null) => {
    try {
      await db.appAssignExperienceToTrip(experienceId, tripId);
      onSelect(tripId);
      onClose();
    } catch (error) {
      console.error('Failed to assign experience:', error);
      Alert.alert('エラー', '旅行の変更に失敗しました');
    }
  };

  return (
    <Modal visible={true} animationType="slide">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Text className="text-xl font-bold">旅行を選択</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {/* 未分類の体験 */}
          <Pressable
            className={`p-4 border-b border-gray-200 ${
              currentTripId === null ? 'bg-primary-50' : ''
            }`}
            onPress={() => handleSelect(null)}
          >
            <Text className="text-lg font-semibold text-gray-900">未分類の体験</Text>
            {currentTripId === null && (
              <Text className="text-sm text-primary-500 mt-1">現在の旅行</Text>
            )}
          </Pressable>

          {/* 旅行一覧 */}
          {trips.map((trip) => (
            <Pressable
              key={trip.id}
              className={`p-4 border-b border-gray-200 ${
                currentTripId === trip.id ? 'bg-primary-50' : ''
              }`}
              onPress={() => handleSelect(trip.id)}
            >
              <Text className="text-lg font-semibold text-gray-900">{trip.title}</Text>
              <Text className="text-sm text-gray-600 mt-1">
                {format(trip.startDate, 'yyyy/MM/dd')}
                {trip.endDate ? ` 〜 ${format(trip.endDate, 'yyyy/MM/dd')}` : ' 〜 進行中'}
              </Text>
              {currentTripId === trip.id && (
                <Text className="text-sm text-primary-500 mt-1">現在の旅行</Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
```

---

#### タスク9.5-6: HomeScreenへの旅行ボタン追加（0.1日）

**HomeScreen.tsx の変更**

**追加内容:**
- [ ] 「旅行」ボタンを追加
- [ ] 旅行数の統計を表示

```typescript
// 統計取得に旅行数を追加
const [tripCount, setTripCount] = useState(0);

const loadStats = async () => {
  // ... 既存のコード
  const tripsData = await db.appGetTrips();
  setTripCount(tripsData.length);
};

// ボタン追加
<Pressable
  className="bg-white rounded-2xl p-6 mb-4 shadow-sm"
  onPress={() => setShowTrips(true)}
>
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center">
      <View className="w-12 h-12 bg-secondary-100 rounded-full items-center justify-center mr-4">
        <Ionicons name="airplane" size={24} color="#ffc107" />
      </View>
      <View>
        <Text className="text-lg font-semibold text-gray-900">旅行</Text>
        <Text className="text-sm text-gray-600">{tripCount}件の旅行</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
  </View>
</Pressable>
```

---

#### タスク9.5-7: App.tsxへのモーダル統合（0.1日）

**App.tsx の変更**

**追加内容:**
- [ ] TripsScreen モーダル
- [ ] TripFormScreen モーダル
- [ ] TripDetailScreen モーダル
- [ ] 状態管理とモーダル遷移

```typescript
const [showTrips, setShowTrips] = useState(false);
const [showTripForm, setShowTripForm] = useState(false);
const [showTripDetail, setShowTripDetail] = useState(false);
const [editingTripId, setEditingTripId] = useState<string | undefined>(undefined);
const [selectedTripId, setSelectedTripId] = useState<string | undefined>(undefined);

// TripsScreen モーダル
{showTrips && (
  <Modal visible={true} animationType="slide">
    <TripsScreen
      onClose={() => setShowTrips(false)}
      onTripPress={(trip) => {
        setSelectedTripId(trip.id);
        setShowTripDetail(true);
      }}
      onCreateTrip={() => {
        setEditingTripId(undefined);
        setShowTripForm(true);
      }}
    />
  </Modal>
)}

// TripFormScreen モーダル
{showTripForm && (
  <TripFormScreen
    tripId={editingTripId}
    onClose={() => setShowTripForm(false)}
    onSave={() => {
      setShowTripForm(false);
      // TripsScreenをリフレッシュ
    }}
  />
)}

// TripDetailScreen モーダル
{showTripDetail && selectedTripId && (
  <TripDetailScreen
    tripId={selectedTripId}
    onClose={() => setShowTripDetail(false)}
    onEdit={() => {
      setEditingTripId(selectedTripId);
      setShowTripForm(true);
    }}
    onDelete={() => {
      setShowTripDetail(false);
      // TripsScreenをリフレッシュ
    }}
  />
)}
```

---

#### タスク9.5-8: ExperienceDetailScreenの拡張（0.1日）

**ExperienceDetailScreen.tsx の変更**

**追加内容:**
- [ ] 「旅行を変更」ボタンを追加
- [ ] TripSelectorを統合

```typescript
const [showTripSelector, setShowTripSelector] = useState(false);

// ボタン追加（旅行情報の下）
{experience.tripId && (
  <View className="px-6 py-4 border-b border-gray-200">
    <Text className="text-sm text-gray-600 mb-2">所属する旅行</Text>
    <Pressable
      className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3"
      onPress={() => setShowTripSelector(true)}
    >
      <Text className="text-base text-gray-900">{tripTitle}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  </View>
)}

// TripSelector モーダル
{showTripSelector && (
  <TripSelector
    currentTripId={experience.tripId}
    experienceId={experience.id}
    onSelect={(tripId) => {
      // 体験の旅行を更新
      loadExperience();
    }}
    onClose={() => setShowTripSelector(false)}
  />
)}
```

---

**テスト項目:**
- [ ] 旅行を作成できる
- [ ] 旅行一覧が表示される
- [ ] 進行中の旅行が上部に表示される
- [ ] 旅行詳細が正しく表示される
- [ ] 旅行を編集できる
- [ ] 旅行を終了できる
- [ ] 旅行を削除できる（体験は未分類に移動）
- [ ] 体験を旅行に割り当てられる
- [ ] 体験を別の旅行に移動できる
- [ ] 訪問国統計が正しくカウントされる
- [ ] iPhone実機テスト完了

**完了基準:**
- すべてのテスト項目が✅
- Phase 1と同様のコード品質
- NativeWindスタイリング規約に準拠
- TypeScriptの型安全性を維持

---

### ステップ10: Supabase統合とクラウド同期

**実装予定日**: Phase 2開始後
**目的**: バックエンド構築とデータ同期機能の実装
**期間**: 3日
**依存**: ステップ9.5完了

**成果物:**
- Supabaseプロジェクトのセットアップ
- メール認証機能（Supabase Auth）
- PostgreSQLスキーマのマイグレーション
- 双方向同期ロジック（タイムスタンプ管理）
- 同期状態のUI表示

---

#### タスク10-1: Supabaseセットアップ（0.5日）

**10-1-1. Supabaseプロジェクト作成**
- [ ] https://supabase.com でプロジェクト作成
- [ ] プロジェクトURL・API Keyを`.env.local`に保存
  ```bash
  EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- [ ] `@supabase/supabase-js`をインストール
  ```bash
  npm install @supabase/supabase-js
  ```

**10-1-2. データベーススキーマ設計**

PostgreSQLにローカルSQLiteと同じ構造を作成：

```sql
-- users テーブル（Supabase Authと連携）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trips テーブル
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  companions TEXT,
  purpose TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trip_countries テーブル
CREATE TABLE trip_countries (
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  continent TEXT,
  first_visit_date TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (trip_id, country_code)
);

-- experiences テーブル
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  place_name TEXT,
  country_code TEXT,
  weather_condition TEXT,
  weather_temperature DOUBLE PRECISION,
  weather_icon TEXT,
  text_notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  sync_status TEXT DEFAULT 'synced',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- media_files テーブル
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storageのパス
  file_size BIGINT,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- visited_countries テーブル（統計用）
CREATE TABLE visited_countries (
  user_id UUID REFERENCES profiles(id) NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  continent TEXT,
  first_visit TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  visit_count INTEGER DEFAULT 1,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, country_code)
);

-- インデックス
CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_experiences_trip_id ON experiences(trip_id);
CREATE INDEX idx_experiences_timestamp ON experiences(timestamp DESC);
CREATE INDEX idx_media_experience_id ON media_files(experience_id);
CREATE INDEX idx_trips_user_id ON trips(user_id);
```

**10-1-3. Row Level Security (RLS) ポリシー設定**

ユーザーは自分のデータのみアクセス可能：

```sql
-- profiles テーブル
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- trips テーブル
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own trips" ON trips FOR ALL USING (auth.uid() = user_id);

-- experiences テーブル
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own experiences" ON experiences FOR ALL USING (auth.uid() = user_id);

-- その他のテーブルも同様にRLS設定
```

**10-1-4. Storage バケット作成**

```sql
-- Supabase Storageでバケットを作成
INSERT INTO storage.buckets (id, name, public) VALUES
  ('photos', 'photos', false),
  ('audio-memos', 'audio-memos', false),
  ('ambient-sounds', 'ambient-sounds', false);

-- RLSポリシー: ユーザーは自分のファイルのみアクセス可能
CREATE POLICY "Users can CRUD own photos"
  ON storage.objects FOR ALL
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

#### タスク10-2: 認証機能実装（1日）

**10-2-1. Supabase Authクライアントの作成**

```typescript
// src/services/SupabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Expo用のストレージ
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**10-2-2. 認証Context の作成**

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/SupabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // セッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**10-2-3. ログイン/サインアップ画面の実装**

```typescript
// src/screens/AuthScreen.tsx
export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert('成功', '確認メールを送信しました');
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      Alert.alert('エラー', error.message);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900 mb-8">
        {isSignUp ? 'アカウント作成' : 'ログイン'}
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="bg-primary-500 rounded-xl p-4 mb-4"
        onPress={handleAuth}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isSignUp ? '登録' : 'ログイン'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text className="text-primary-500 text-center">
          {isSignUp
            ? 'すでにアカウントをお持ちの方はこちら'
            : 'アカウントをお持ちでない方はこちら'}
        </Text>
      </Pressable>
    </View>
  );
}
```

**10-2-4. App.tsxへの統合**

```typescript
// App.tsx
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  // 既存のアプリ画面
  return <HomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

---

#### タスク10-3: データ同期ロジック実装（1.5日）

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

## 6. Phase 2 アーキテクチャとデータフロー

### 6-1. システムアーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Native App (Expo)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Presentation Layer                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │  │
│  │  │  Screens   │ │ Components │ │  Navigation        │   │  │
│  │  │ - Home     │ │ - Card     │ │  - Stack Navigator │   │  │
│  │  │ - Trips    │ │ - Forms    │ │  - Tab Navigator   │   │  │
│  │  │ - Map      │ │ - Lists    │ │  - Modal Stack     │   │  │
│  │  │ - Stats    │ │ - Modals   │ │                    │   │  │
│  │  └────────────┘ └────────────┘ └────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Business Logic Layer                    │  │
│  │  ┌────────────────┐ ┌──────────────┐ ┌───────────────┐  │  │
│  │  │    Contexts    │ │   Services   │ │     Hooks     │  │  │
│  │  │ - AuthContext  │ │ - Database   │ │ - useTrips    │  │  │
│  │  │                │ │ - Supabase   │ │ - useCountry  │  │  │
│  │  │                │ │ - Weather    │ │ - useSync     │  │  │
│  │  │                │ │ - Location   │ │               │  │  │
│  │  └────────────────┘ └──────────────┘ └───────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Data Access Layer                      │  │
│  │  ┌────────────────────────┐  ┌──────────────────────┐    │  │
│  │  │   Local Storage        │  │   Remote Storage     │    │  │
│  │  │  - SQLite (Expo)       │  │  - Supabase Client   │    │  │
│  │  │  - File System         │  │  - Auth Client       │    │  │
│  │  │  - AsyncStorage        │  │  - Storage Client    │    │  │
│  │  └────────────────────────┘  └──────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
         ┌────────────────────────────────────────┐
         │         External Services              │
         ├────────────────────────────────────────┤
         │  ┌──────────────────────────────────┐ │
         │  │        Supabase Cloud            │ │
         │  │  ┌────────────┐ ┌─────────────┐ │ │
         │  │  │ PostgreSQL │ │   Storage   │ │ │
         │  │  │ - trips    │ │ - images    │ │ │
         │  │  │ - exp.     │ │ - videos    │ │ │
         │  │  │ - media    │ │ - audio     │ │ │
         │  │  │ - visited  │ │             │ │ │
         │  │  └────────────┘ └─────────────┘ │ │
         │  │  ┌────────────┐                 │ │
         │  │  │    Auth    │                 │ │
         │  │  │ - Email    │                 │ │
         │  │  │ - JWT      │                 │ │
         │  │  └────────────┘                 │ │
         │  └──────────────────────────────────┘ │
         │                                        │
         │  ┌──────────────────────────────────┐ │
         │  │      3rd Party APIs              │ │
         │  │  - OpenWeather                   │ │
         │  │  - Google Geocoding              │ │
         │  └──────────────────────────────────┘ │
         └────────────────────────────────────────┘
```

### 6-2. データフロー図

#### データの流れ（Phase 2）

```
┌───────────────────────────────────────────────────────────────────┐
│                   1. 新規体験の記録フロー                           │
└───────────────────────────────────────────────────────────────────┘

User Action → UI Component → Service → Local DB → Sync Service → Cloud
    │             │             │          │            │            │
    ▼             ▼             ▼          ▼            ▼            ▼
 [写真撮影]   CameraScreen  MediaService  SQLite    SyncService  Supabase
    │             │             │          │            │            │
    │             │      [ファイル保存]   [INSERT]   [タイムスタンプ] [INSERT]
    │             │             │          │            │            │
    │             │      [サムネイル生成] [experience] [変更追跡]  [PostgreSQL]
    │             │             │          │            │            │
    │             │      [メタデータ抽出] [media]     [バッチ処理]  [Storage]
    │             │             │          │            │            │
    └─────────────┴─────────────┴──────────┴────────────┴────────────┘
                                    ↓
                          [ローカル表示は即座]
                          [クラウド同期は非同期]


┌───────────────────────────────────────────────────────────────────┐
│                2. マルチデバイス同期フロー                           │
└───────────────────────────────────────────────────────────────────┘

Device A (iPhone)                    Supabase Cloud                    Device B (iPad)
    │                                      │                                │
    │ [体験を記録]                          │                                │
    │ ↓                                    │                                │
    │ SQLite INSERT                        │                                │
    │ updated_at: 2025-11-02 10:00:00     │                                │
    │ ↓                                    │                                │
    │ WiFi接続検知                          │                                │
    │ ↓                                    │                                │
    │ ─────── Upload ──────────────────>  │                                │
    │         (POST /experiences)          │                                │
    │                                      │ PostgreSQL INSERT              │
    │                                      │ updated_at: 2025-11-02 10:00:00│
    │                                      │ ↓                              │
    │                                      │ Realtime Broadcast ────────>  │
    │                                      │                                │ Realtime Listener
    │                                      │                                │ ↓
    │                                      │                                │ SQLite UPDATE
    │                                      │                                │ updated_at: 10:00:00
    │                                      │                                │ ↓
    │                                      │  <───── Fetch (GET) ─────────  │
    │                                      │         /experiences           │
    │                                      │         ?updated_after=...     │
    │                                      │                                │
    │                                      │ ─────── Response ───────────>  │
    │                                      │         [新規データ]            │
    │                                      │                                │ ↓
    │                                      │                                │ 画面更新
    │                                      │                                │


┌───────────────────────────────────────────────────────────────────┐
│              3. コンフリクト解決フロー（Last Write Wins）            │
└───────────────────────────────────────────────────────────────────┘

Device A                        Supabase                        Device B
    │                              │                                │
    │ [オフラインで編集]            │                                │ [オフラインで編集]
    │ title: "東京タワー"           │                                │ title: "Tokyo Tower"
    │ updated_at: 10:00:00         │                                │ updated_at: 10:05:00
    │                              │                                │
    │ ─── Upload (10:30) ────>    │                                │
    │     updated_at: 10:00:00     │                                │
    │                              │ ← Supabaseタイムスタンプ更新    │
    │                              │   server_updated: 10:30:00     │
    │                              │                                │
    │                              │  <──── Upload (10:35) ────────│
    │                              │        updated_at: 10:05:00    │
    │                              │                                │
    │                              │ ✅ 10:05 > 10:00               │
    │                              │    新しいので上書き             │
    │                              │    server_updated: 10:35:00    │
    │                              │                                │
    │  <─── Sync Response ────    │                                │
    │       [Device Bの変更を取得] │                                │
    │       title: "Tokyo Tower"   │                                │
    │                              │                                │
    │ ⚠️ ローカルが古いので上書き    │                                │
    │    title: "Tokyo Tower"      │                                │
    │                              │                                │


┌───────────────────────────────────────────────────────────────────┐
│                    4. 認証フロー（メール認証）                       │
└───────────────────────────────────────────────────────────────────┘

User                 App                  Supabase Auth           Email Service
 │                    │                         │                      │
 │ [Sign Up]          │                         │                      │
 │ ─────────────────> │                         │                      │
 │  email: user@ex.com│                         │                      │
 │  password: ******  │                         │                      │
 │                    │ signUp()                │                      │
 │                    │ ──────────────────────> │                      │
 │                    │                         │ Create User          │
 │                    │                         │ Generate Token       │
 │                    │                         │ ──────────────────>  │
 │                    │                         │   Confirmation Email │
 │                    │                         │                      │
 │  <──────────────── │ <──────────────────────│                      │
 │  確認メール送信済み   │  {user, session: null} │                      │
 │                    │                         │                      │
 │ [Email確認]         │                         │                      │
 │ ─────────────────────────────────────────>  │                      │
 │  Click Confirm Link                          │                      │
 │                    │                         │ Verify Email         │
 │                    │                         │ Create Session       │
 │                    │  <─────────────────────│                      │
 │                    │  {user, session, token} │                      │
 │  <──────────────── │                         │                      │
 │  ログイン成功        │                         │                      │
 │                    │ [Auto-sync Start]       │                      │
 │                    │                         │                      │


┌───────────────────────────────────────────────────────────────────┐
│                   5. メディアファイル同期フロー                       │
└───────────────────────────────────────────────────────────────────┘

Local Device                        Supabase Storage
    │                                      │
    │ [写真撮影]                            │
    │ ↓                                    │
    │ File System                          │
    │ /cache/IMG_001.jpg (5MB)             │
    │ ↓                                    │
    │ SQLite INSERT                        │
    │ media_files:                         │
    │   local_uri: file:///.../IMG_001.jpg │
    │   cloud_url: NULL                    │
    │   sync_status: 'pending'             │
    │ ↓                                    │
    │ [WiFi接続]                            │
    │ ↓                                    │
    │ SyncService.uploadMedia()            │
    │ ↓                                    │
    │ 1. ファイル読み込み                    │
    │ 2. Base64エンコード（必要に応じて）      │
    │ 3. リサイズ（大きすぎる場合）            │
    │ ↓                                    │
    │ ───── Upload ──────────────────────> │
    │       POST /storage/v1/object/       │
    │       bucket: 'media'                 │
    │       path: user_id/exp_id/IMG_001.jpg│
    │                                      │ ✅ ファイル保存
    │                                      │    /media/user123/exp456/...
    │  <────── Response ──────────────────│
    │          {public_url}                │
    │ ↓                                    │
    │ SQLite UPDATE                        │
    │ media_files:                         │
    │   cloud_url: https://...             │
    │   sync_status: 'synced'              │
    │ ↓                                    │
    │ [オプション] ローカルファイル削除       │
    │              (ストレージ節約)          │
    │                                      │
```

### 6-3. データベーススキーマ関係図

```
┌────────────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL Schema                    │
└────────────────────────────────────────────────────────────────┘

    profiles (Supabase Auth拡張)
    ┌─────────────────────────────┐
    │ id (UUID) PK                │
    │ email                       │
    │ display_name                │
    │ avatar_url                  │
    │ created_at                  │
    └─────────────────────────────┘
              │
              │ user_id FK
              ↓
    trips
    ┌─────────────────────────────┐
    │ id (UUID) PK                │
    │ user_id FK → profiles.id    │◄────────┐
    │ title                       │         │
    │ start_date                  │         │
    │ end_date                    │         │
    │ companions                  │         │
    │ purpose                     │         │
    │ notes                       │         │
    │ created_at                  │         │
    │ updated_at                  │         │
    │ synced_at                   │         │
    └─────────────────────────────┘         │
              │                             │
              │ trip_id FK                  │
              ↓                             │
    experiences                             │
    ┌─────────────────────────────┐         │
    │ id (UUID) PK                │         │
    │ user_id FK → profiles.id    │         │
    │ trip_id FK → trips.id       │─────────┘
    │ title                       │
    │ description                 │
    │ country_code                │
    │ country_name                │
    │ city                        │
    │ latitude                    │
    │ longitude                   │
    │ visit_date                  │
    │ weather                     │
    │ temperature                 │
    │ category                    │
    │ rating                      │
    │ created_at                  │
    │ updated_at                  │
    │ synced_at                   │
    └─────────────────────────────┘
              │
              │ experience_id FK
              ↓
    media_files
    ┌─────────────────────────────┐
    │ id (UUID) PK                │
    │ experience_id FK            │
    │ user_id FK → profiles.id    │
    │ file_type (photo/video/audio)│
    │ file_path (Storage)         │
    │ cloud_url                   │
    │ thumbnail_url               │
    │ file_size                   │
    │ duration (audio/video)      │
    │ created_at                  │
    │ synced_at                   │
    └─────────────────────────────┘

    visited_countries (集計テーブル)
    ┌─────────────────────────────┐
    │ id (UUID) PK                │
    │ user_id FK → profiles.id    │
    │ country_code                │
    │ country_name                │
    │ first_visit_date            │
    │ last_visit_date             │
    │ visit_count                 │
    │ experience_count            │
    │ photo_count                 │
    └─────────────────────────────┘

RLS (Row Level Security) ポリシー:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
全テーブルに以下のポリシーを適用:
  ✅ SELECT: user_id = auth.uid()
  ✅ INSERT: user_id = auth.uid()
  ✅ UPDATE: user_id = auth.uid()
  ✅ DELETE: user_id = auth.uid()

→ ユーザーは自分のデータのみアクセス可能
```

### 6-4. 同期戦略の詳細

#### タイムスタンプベースの同期（Last Write Wins）

**フィールド定義:**
- `updated_at`: クライアント側で記録した最終更新時刻
- `synced_at`: Supabaseに同期された時刻（サーバータイムスタンプ）

**同期ロジック:**

1. **アップロード（Local → Cloud）**
   ```typescript
   // クライアント側
   const localData = await db.getAllPendingChanges(); // updated_at > synced_at

   for (const item of localData) {
     const response = await supabase
       .from('experiences')
       .upsert({
         ...item,
         user_id: auth.user.id,
       })
       .select();

     // ローカルのsynced_atを更新
     await db.updateSyncedAt(item.id, new Date());
   }
   ```

2. **ダウンロード（Cloud → Local）**
   ```typescript
   // クライアント側
   const lastSyncTime = await db.getLastSyncTime();

   const { data: remoteChanges } = await supabase
     .from('experiences')
     .select('*')
     .gt('synced_at', lastSyncTime);

   for (const remoteItem of remoteChanges) {
     const localItem = await db.getById(remoteItem.id);

     // コンフリクト解決: リモートのupdated_atが新しければ上書き
     if (!localItem || remoteItem.updated_at > localItem.updated_at) {
       await db.upsert(remoteItem);
     }
   }
   ```

3. **リアルタイム更新**
   ```typescript
   // Supabase Realtimeでリアルタイム同期
   supabase
     .channel('experiences_changes')
     .on('postgres_changes',
       { event: '*', schema: 'public', table: 'experiences' },
       async (payload) => {
         if (payload.new.user_id === auth.user.id) {
           await db.upsert(payload.new);
         }
       }
     )
     .subscribe();
   ```

**メディアファイルの同期:**
- 低優先度キュー（WiFiのみ）
- 並列アップロード制限（3ファイル同時）
- リトライロジック（3回まで）
- プログレス表示

---

## 6-5. Phase 2開始前チェックリスト

### 環境構築チェックリスト

#### Supabaseプロジェクト設定
- [ ] Supabaseアカウント作成
- [ ] 新規プロジェクトの作成（プロジェクト名: `experience-the-world`）
- [ ] プロジェクトURL・APIキーの取得
  - [ ] `EXPO_PUBLIC_SUPABASE_URL`
  - [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 環境変数を`.env.local`に追加
  ```bash
  EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  EXPO_PUBLIC_OPENWEATHER_API_KEY=existing_key  # 既存
  ```

#### データベーススキーマ設定
- [ ] PostgreSQL拡張機能の有効化
  - [ ] `uuid-ossp` 拡張（UUID生成用）
  - [ ] `postgis` 拡張（位置情報用、オプション）
- [ ] テーブル作成（SQL実行）
  - [ ] `profiles` テーブル
  - [ ] `trips` テーブル
  - [ ] `experiences` テーブル
  - [ ] `media_files` テーブル
  - [ ] `visited_countries` テーブル
- [ ] インデックス作成
  - [ ] `experiences.user_id`
  - [ ] `experiences.trip_id`
  - [ ] `experiences.country_code`
  - [ ] `media_files.experience_id`
  - [ ] `visited_countries.user_id`

#### Row Level Security (RLS) ポリシー設定
- [ ] 全テーブルでRLS有効化
- [ ] `profiles` テーブルポリシー
  - [ ] SELECT: `auth.uid() = id`
  - [ ] UPDATE: `auth.uid() = id`
- [ ] `trips` テーブルポリシー
  - [ ] SELECT: `auth.uid() = user_id`
  - [ ] INSERT: `auth.uid() = user_id`
  - [ ] UPDATE: `auth.uid() = user_id`
  - [ ] DELETE: `auth.uid() = user_id`
- [ ] `experiences` テーブルポリシー（同上）
- [ ] `media_files` テーブルポリシー（同上）
- [ ] `visited_countries` テーブルポリシー（同上）

#### Supabase Storage設定
- [ ] Storageバケット作成
  - [ ] バケット名: `media`
  - [ ] Public access: `false`（プライベート）
- [ ] Storageポリシー設定
  - [ ] Upload: `auth.uid() = (storage.foldername(name))[1]::uuid`
  - [ ] Read: `auth.uid() = (storage.foldername(name))[1]::uuid`
  - [ ] Delete: `auth.uid() = (storage.foldername(name))[1]::uuid`
- [ ] ファイルサイズ制限確認（デフォルト50MB）

#### Supabase Auth設定
- [ ] Email認証を有効化
- [ ] Email Templates設定（オプション）
  - [ ] Confirm Signupテンプレート
  - [ ] Reset Passwordテンプレート
- [ ] Redirect URLs設定
  - [ ] 開発環境: `exp://localhost:8081`
  - [ ] 本番環境: カスタムスキーム設定予定
- [ ] Email確認の必須化（Confirm email）: `true`

#### パッケージインストール
- [ ] Supabase関連
  ```bash
  npm install @supabase/supabase-js
  ```
- [ ] 日付選択（ステップ9.5）
  ```bash
  npm install @react-native-community/datetimepicker
  ```
- [ ] 地図表示（ステップ11）
  ```bash
  npm install react-native-maps
  # GeoJSONデータは別途ダウンロード
  ```
- [ ] ネットワーク監視（ステップ14）
  ```bash
  npm install @react-native-community/netinfo
  ```
- [ ] アニメーション（ステップ13、オプション）
  ```bash
  npm install react-native-reanimated
  ```

#### 既存コードの準備状況
- [x] Phase 1 MVP完了確認
  - [x] ステップ1-9すべて完了
  - [x] カメラ機能動作確認
  - [x] 位置情報取得動作確認
  - [x] 天気情報取得動作確認（APIキー設定済み）
  - [x] 音声メモ録音機能動作確認
  - [x] SQLiteローカルDB動作確認
- [ ] Git状態確認
  - [ ] コミットされていない変更がないか確認
    ```bash
    git status
    ```
  - [ ] 必要であれば現状をコミット
    ```bash
    git add .
    git commit -m "Phase 1完了時点の状態を保存"
    ```
  - [ ] Phase 2開発用ブランチ作成（推奨）
    ```bash
    git checkout -b feature/phase2-supabase-integration
    ```

### 技術確認チェックリスト

#### SupabaseとExpoの互換性確認
- [ ] Expo SDK 54との互換性確認
- [ ] `@supabase/supabase-js` バージョン確認（v2.x推奨）
- [ ] AsyncStorageの動作確認（Supabase認証トークン保存用）

#### 開発環境の動作確認
- [ ] Expo Dev Clientでアプリ起動
  ```bash
  npx expo start
  ```
- [ ] 物理デバイスでの動作確認（推奨）
- [ ] デバッグツールの確認
  - [ ] React Native Debugger
  - [ ] Flipper（オプション）

#### データ移行計画（Phase 1 → Phase 2）
- [ ] 既存SQLiteデータの扱いを決定
  - [ ] オプションA: 既存データをSupabaseに移行（初回同期時）
  - [ ] オプションB: Phase 2から新規データのみ同期
  - [ ] **推奨**: オプションA（既存データも活用）
- [ ] データ移行スクリプトの必要性確認
  - [ ] SQLiteからSupabaseへの一括アップロード機能
  - [ ] ステップ10-3で実装予定

### ドキュメント整備チェックリスト

- [x] 技術選定の完了
  - [x] バックエンド: Supabase
  - [x] 認証: メール認証
  - [x] 同期戦略: タイムスタンプ管理
  - [x] 地図: react-native-maps
- [x] ステップ9.5詳細計画完了
- [x] ステップ10-14詳細計画完了
- [x] アーキテクチャ図・データフロー図作成完了
- [ ] API仕様書作成（必要に応じて）
  - [ ] Supabase RPCエンドポイント
  - [ ] カスタムEdge Functions（Phase 3以降）

### セキュリティチェックリスト

- [ ] 環境変数の管理
  - [ ] `.env.local`が`.gitignore`に含まれているか確認
  - [ ] APIキーがコードにハードコードされていないか確認
- [ ] Supabase RLSポリシーのテスト
  - [ ] 他ユーザーのデータにアクセスできないことを確認
  - [ ] 認証なしでアクセスできないことを確認
- [ ] データバリデーション
  - [ ] 入力値のサニタイズ
  - [ ] SQLインジェクション対策（SupabaseのパラメータバインディングでOK）

### テスト計画チェックリスト

- [ ] テスト環境の準備
  - [ ] Supabaseテストプロジェクト作成（オプション）
  - [ ] テストユーザーアカウント作成
- [ ] テストシナリオ作成
  - [ ] 認証フロー（サインアップ→ログイン→ログアウト）
  - [ ] データ同期（作成→更新→削除）
  - [ ] マルチデバイス同期
  - [ ] オフライン→オンライン復帰
  - [ ] コンフリクト解決

### Phase 2開始の最終確認

以下の質問に「はい」と答えられたらPhase 2を開始できます：

1. ✅ Phase 1のすべての機能が正常に動作しているか？
2. ⏳ Supabaseプロジェクトが作成され、APIキーが取得できたか？
3. ⏳ データベーススキーマとRLSポリシーが設定されたか？
4. ⏳ 必要なnpmパッケージがインストールされたか？
5. ⏳ 環境変数が`.env.local`に正しく設定されたか？
6. ⏳ 開発環境でアプリが正常に起動するか？
7. ✅ development-plan.mdにPhase 2の詳細計画が記載されているか？

### Phase 2の最初のタスク

すべてのチェックリストが完了したら、**ステップ9.5: 旅行管理UI**から開始します：

```bash
# ステップ9.5の最初のタスク
- タスク9.5-1: TripsScreen基本実装
  - src/screens/TripsScreen.tsxの作成
  - 旅行一覧の表示
  - 空状態（旅行なし）の表示
```

---

## 6-3. Phase 2 環境構築完了

**実施日**: 2025年11月2日

### Supabaseプロジェクトセットアップ

✅ **完了事項:**

1. **Supabaseプロジェクト作成**
   - プロジェクトURL: `https://xpbxmuzimqfazajkmfpa.supabase.co`
   - APIキー取得完了（ANON_KEY, SERVICE_ROLE_KEY）

2. **MCP設定**
   - `.vscode/settings.json`作成（Git ignore済み）
   - Supabase MCPサーバー設定完了

3. **環境変数設定**
   - `.env.local`にSupabase設定追加
   - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. **パッケージインストール**
   ```bash
   npm install @supabase/supabase-js
   npm install @react-native-community/datetimepicker
   npm install @react-native-community/netinfo
   npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
   ```

5. **データベーススキーマ作成**
   - `supabase-schema.sql`作成・実行完了
   - テーブル: profiles, trips, experiences, media_files, visited_countries
   - インデックス、RLSポリシー、トリガー設定完了

6. **ストレージ設定**
   - `supabase-storage-setup.sql`作成・実行完了
   - `media`バケット作成
   - RLSポリシー設定（upload, read, delete）

### トラブルシューティング

**React Navigationインストールエラー**
- 問題: `Unable to resolve "@react-navigation/native"`
- 解決: React Navigationパッケージ一式インストール
- 追加問題: `Unable to resolve "./types.js"`
- 解決: `rm -rf node_modules && npm install`で再インストール

---

## 6-4. ステップ9.5完了: 旅行管理UI

**実施日**: 2025年11月2日
**目的**: 旅行単位で体験を整理できるUI実装

### 実装内容

✅ **1. TripsScreen（旅行一覧画面）**
- `src/screens/TripsScreen.tsx`作成
- 旅行カード表示（タイトル、期間、統計）
- 空状態表示
- 新規作成ボタン
- Pull-to-refresh機能

✅ **2. TripFormScreen（旅行作成・編集画面）**
- `src/screens/TripFormScreen.tsx`作成
- フォーム入力（タイトル、開始日、終了日、同行者、目的、メモ）
- DateTimePicker統合（iOS/Android対応）
- バリデーション（タイトル必須、日付の整合性）
- 保存処理実装

✅ **3. TripDetailScreen（旅行詳細画面）**
- `src/screens/TripDetailScreen.tsx`作成
- 旅行情報カード表示
- 統計表示（訪問国数、体験数）
- 訪問国タグ一覧
- 体験リスト表示（写真付き）
- 削除機能（体験は未分類に移動）

✅ **4. TripSelector（旅行選択モーダル）**
- `src/components/TripSelector.tsx`作成
- ボトムシートモーダル
- 旅行一覧表示
- 現在選択中の旅行ハイライト
- 「未分類」オプション

✅ **5. DatabaseService拡張**
- `getAllTrips()`: 旅行一覧取得
- `getExperiencesByTripId()`: 旅行IDで体験取得
- `databaseService`エクスポート追加

✅ **6. HomeScreen拡張**
- 旅行ボタン追加
- `onTripsPress`コールバック追加

✅ **7. App.tsx統合**
- 旅行関連モーダル追加（TripsScreen, TripFormScreen, TripDetailScreen）
- 状態管理追加（showTrips, showTripForm, showTripDetail, selectedTripId）

✅ **8. ExperienceDetailScreen拡張**
- 旅行情報表示追加
- useEffectで旅行タイトル非同期ロード
- 旅行アイコン表示

### 技術的な実装ポイント

**モーダルベースナビゲーション**
- React Navigation Navigatorは使用せず、モーダルスタックで実装
- `useNavigation`フックでモーダル間遷移
- シンプルな実装で保守性向上

**日付処理**
- DatabaseServiceはUnixタイムスタンプ（秒）で保存
- UIはJavaScript Date、ISO文字列で処理
- DateTimePickerでクロスプラットフォーム対応

**非同期データロード**
- useEffectで旅行情報を非同期ロード
- tripIdの変更を監視して再ロード
- ローディング状態とエラーハンドリング

### コミット履歴

1. `feat: TripsScreen実装 - 旅行一覧表示機能追加`
2. `feat: TripFormScreen・TripDetailScreen実装 - 旅行CRUD完成`
3. `feat: Step 9.5完了 - 旅行管理UI統合・HomeScreen/App.tsx/ExperienceDetailScreen連携`
4. `fix: React Navigation依存を削除してモーダルベースナビゲーションに統一`

### トラブルシューティング記録

**React Navigation NavigationContainerエラー**
- 問題: `useNavigation`使用時に「NavigationContainerが見つからない」エラー
- 原因: モーダルベースアプローチでNavigationContainerをセットアップしていない
- 解決策: `useNavigation`を完全削除し、propsでナビゲーションハンドラーを渡す設計に変更
- 影響: TripsScreen、TripFormScreen、TripDetailScreenすべて修正

**mediaFiles undefined エラー**
- 問題: `Cannot read property 'find' of undefined`
- 原因: Experience型のインポートパスが`../types`と`../types/models`で混在
- 解決策: すべて`../types/models`に統一、オプショナルチェイニング追加（`mediaFiles?.find()`）

**@babel/runtime 解決エラー**
- 問題: Metroバンドラーのキャッシュ問題
- 解決策: `npx expo start --clear`でキャッシュクリア、`rm -rf node_modules && npm install`

### 動作確認完了

✅ **実施日**: 2025年11月2日（午前）

**テストシナリオ:**
1. ホーム画面→旅行ボタンタップ→旅行一覧表示 ✅
2. 旅行一覧→+ボタン→旅行作成フォーム表示 ✅
3. 旅行作成→保存→旅行一覧に戻る ✅
4. 旅行カードタップ→旅行詳細表示 ✅
5. 旅行詳細→体験カードタップ→体験詳細表示 ✅
6. 各画面の閉じるボタン→正常に遷移 ✅

**確認事項:**
- モーダルスタックのナビゲーション正常動作
- 状態管理（selectedTripId等）正常動作
- データ取得（旅行一覧、体験一覧）正常動作

**今後の改善点:**
- デザインの統一（ホーム画面の青基調に合わせる）
- 旅行編集機能の実装（現在は未実装のアラート表示）
- TripSelectorコンポーネントの統合（体験から旅行を選択）

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
