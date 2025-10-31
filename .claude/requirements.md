# Experience the World - 要件定義書

**バージョン**: 1.0
**作成日**: 2025年10月26日
**期限**: 2025年10月31日
**ステータス**: 開発中

**関連ドキュメント**:
- [プロダクトビジョン](product-vision.md) - WHY: ビジョン・コンセプト・ビジネスモデル
- [開発ルール](project-rules.md) - HOW: コーディング規約・技術スタック

---

## 目次

1. [プロダクト概要](#1-プロダクト概要)
2. [ターゲットユーザー](#2-ターゲットユーザー)
3. [機能要件](#3-機能要件)
4. [非機能要件](#4-非機能要件)
5. [データ構造](#5-データ構造)
6. [開発フェーズ](#6-開発フェーズ)
7. [成功指標（KPI）](#7-成功指標kpi)

---

## 1. プロダクト概要

### 1-1. プロダクトビジョン

旅行の「体験の質感」を、記録のハードルを極限まで下げながら自然に保存し、後から振り返ったときにその瞬間の感覚・感情が鮮明に蘇るアプリ。

**タグライン**: 「瞬間を捉える、体験が蘇る」

### 1-2. コアコンセプト

**4つの柱:**

1. **体験の質感**: 写真・音・感情・メディアを統合した記録
2. **超低ハードル**: 意識せずに自然と記録が残る設計
3. **世界地図ゲーム**: 旅のモチベーションと達成感
4. **本質的なコミュニティ**: 人気度ではなく、感性と偶然の出会い

### 1-3. 差別化ポイント

| 項目 | 既存アプリ | Experience the World |
|------|-----------|---------------------|
| 記録対象 | 写真・位置 | 写真・音・感情・メディア |
| 記録方法 | 手動入力中心 | 自動＋音声優先 |
| オフライン | 限定的 | 完全対応 |
| 音の記録 | なし | 環境音・音声メモ |
| メディア連携 | なし | 音楽・本・映画 |
| 世界地図 | なし/簡易 | ゲーミフィケーション |
| 体験の質感 | 限定的 | 包括的 |
| コミュニティ | いいね・人気度 | 感性・偶然の出会い |
| 初心者支援 | なし | 「初めて」ストーリー |

---

## 2. ターゲットユーザー

### 2-1. プライマリーターゲット

- 旅行好きで、思い出を大切にしたい人（20代〜40代）
- 写真だけでは物足りない、もっと深く記憶を残したい人
- 記録は大切だと思うが、旅行中は体験そのものに集中したい人
- 世界中を旅して、その軌跡を可視化したい人

### 2-2. セカンダリーターゲット

- 初めての海外旅行を考えている人（勇気が欲しい）
- ベテラン旅行者（初心に帰るきっかけが欲しい）

---

## 3. 機能要件

### Phase 1: MVP（最小実用製品）

**期間**: 3-4ヶ月
**目標**: 基本的な記録・振り返り機能を実装

#### 3-1. 記録機能

##### 📷 写真記録

**必須要件:**
- [ ] カメラ機能の実装（expo-camera）
- [ ] 写真撮影時に以下を自動記録:
  - GPS位置情報（緯度・経度）
  - タイムスタンプ
  - 天気情報（OpenWeather API連携）
  - 3秒の環境音（自動録音）
- [ ] 写真のローカルストレージ保存
- [ ] 撮影した写真の一覧表示

**オプション要件:**
- [ ] 写真への後付けメモ・タグ追加
- [ ] 写真の編集機能（トリミング、フィルター）

##### 🎤 音声記録

**必須要件:**
- [ ] ボタン長押しで即座に録音開始（WhatsApp風UI）
- [ ] 音声メモの録音・保存
- [ ] 録音中のビジュアルフィードバック（波形表示）
- [ ] 音声メモの再生機能

**オプション要件:**
- [ ] 録音時間の制限設定（例: 最大3分）
- [ ] 音声の圧縮・最適化

##### 📍 位置・コンテキスト

**必須要件:**
- [ ] GPSによる位置情報の自動取得
- [ ] 位置情報からの国コード判定
- [ ] 位置情報からの場所名取得（逆ジオコーディング）
- [ ] 訪問国の自動検出

**オプション要件:**
- [ ] コンテキスト推測（ランチ、観光、移動中）
- [ ] バックグラウンドでの位置トラッキング

#### 3-2. ローカルストレージ

**必須要件:**
- [ ] Expo SQLiteによるローカルデータベース構築
- [ ] すべてのデータをローカルに保存（オフライン完全対応）
- [ ] データの永続化

**データモデル:**
```typescript
interface Experience {
  id: string
  timestamp: Date
  location: {
    latitude: number
    longitude: number
    address: string
    placeName: string
    countryCode: string
  }
  weather: {
    condition: string
    temperature: number
    icon: string
  }
  photos: string[] // ファイルパス
  audioMemos: string[] // ファイルパス
  ambientSounds: string[] // ファイルパス
  textNotes?: string
  tags: string[]
  syncStatus: 'pending' | 'synced' | 'error'
}
```

#### 3-3. 振り返り機能

##### 📅 タイムラインビュー

**必須要件:**
- [ ] 時系列で記録を表示
- [ ] 写真・音声メモ・位置情報を統合表示
- [ ] 日付でのフィルタリング
- [ ] スクロールでの簡単な閲覧

**UI要件:**
- 縦スクロール形式
- カード型レイアウト
- 写真をタップで拡大表示
- 音声メモの再生ボタン

##### 🗺️ 訪問国の自動検出

**必須要件:**
- [ ] 位置情報から訪問国を自動判定
- [ ] 訪問国リストの表示
- [ ] 国ごとの訪問回数・日数の集計

#### 3-4. Firebase Analytics導入

**必須要件:**
- [ ] Firebase Analyticsのセットアップ
- [ ] 基本イベントの計測:
  - `capture_photo`: 写真撮影
  - `record_voice_memo`: 音声メモ
  - `view_timeline`: タイムライン閲覧
  - `visit_new_country`: 新しい国訪問

---

### Phase 2: コア機能拡充

**期間**: 2-3ヶ月
**前提**: Phase 1完了

#### 3-5. クラウド同期

**必須要件:**
- [ ] Firebase / AWS S3によるクラウドストレージ構築
- [ ] WiFi接続時の自動同期
  - テキスト → 音声 → 写真 の優先順位
- [ ] 同期状態の可視化（ステータスインジケーター）
- [ ] 同期エラー時のリトライ機構

**オプション要件:**
- [ ] モバイルデータ時の同期設定（テキスト・音声のみ）
- [ ] 手動同期ボタン
- [ ] 写真・動画の圧縮版保存

#### 3-6. 世界地図機能

##### 🌍 訪問国の可視化

**必須要件:**
- [ ] SVG世界地図の表示
- [ ] 訪問した国を色で塗りつぶし（緑色）
- [ ] 国をタップすると、その国の思い出を表示
- [ ] インタラクティブな地図操作（ズーム、パン）

##### 📊 統計表示

**必須要件:**
- [ ] 訪問国数の表示
- [ ] 訪問大陸数の表示
- [ ] 世界制覇率の計算・表示
- [ ] 国ごとの統計（写真枚数、訪問回数）

#### 3-7. ゲーミフィケーション

**必須要件:**
- [ ] バッジシステムの実装:
  - 「世界への第一歩」: 初めての国を訪問
  - 「旅行好き」: 5カ国訪問
  - 「グローブトロッター」: 10カ国訪問
  - 「写真家」: 100枚の写真を撮影
- [ ] 新国訪問時のアニメーション演出
- [ ] バッジ一覧画面

#### 3-8. 音楽連携

**必須要件:**
- [ ] Spotify API連携
- [ ] 再生履歴の自動取得
- [ ] 音楽と位置・時間の紐付け
- [ ] 音楽履歴の表示

**データモデル:**
```typescript
interface MediaRecord {
  type: 'music' | 'book' | 'movie'
  title: string
  creator: string // artist, author, director
  coverImage: string
  timestamp: Date
  location: Location
  countryCode: string
  notes?: string
  externalId: string // Spotify ID, ISBN, TMDb ID
}
```

#### 3-9. 「初めて」の自動検出

**必須要件:**
- [ ] 初めての海外旅行の検出
- [ ] 初めての国・大陸の検出
- [ ] 「初めて」検出時の通知・促し

---

### Phase 3: コミュニティ機能

**期間**: 2-3ヶ月
**前提**: Phase 2完了

#### 3-10. 「初めて」ストーリー機能

##### ✨ 投稿機能

**必須要件:**
- [ ] 「初めて」ストーリーの投稿フォーム:
  - 行く前の気持ち（テキスト）
  - 到着した瞬間の感覚（テキスト）
  - 印象的だった瞬間（写真・音声付き）
  - 帰ってきて思うこと（テキスト）
  - 学んだこと・変化（テキスト）
- [ ] カバー写真の設定
- [ ] タグ付け機能
- [ ] 公開/非公開設定

**データモデル:**
```typescript
interface FirstTimeStory {
  id: string
  userId: string
  type: 'first_international_trip' | 'first_solo_trip' | 'first_continent'
  country: string
  countryCode: string
  continent: string
  date: Date
  ageAtTime: number

  title: string
  beforeFeeling: string
  duringFeeling: string
  afterFeeling: string

  memorableMoments: {
    title: string
    description: string
    photoUrl?: string
    audioUrl?: string
  }[]

  whatILearned: string
  howIChanged: string

  coverPhotoUrl: string
  photos: string[]
  tags: string[]
  isPublic: boolean

  createdAt: Date
  updatedAt: Date
}
```

##### 📖 閲覧機能

**必須要件:**
- [ ] 「初めて」フィードの表示
- [ ] フィルタリング機能:
  - すべて
  - 初めての海外
  - 初めての一人旅
  - 初めてのアジア／ヨーロッパ／南米
  - 年代別（10代、20代、30代以上）
- [ ] ストーリーの詳細表示
- [ ] ページネーション

#### 3-11. 感性ベースのコミュニティ

##### 🎭 共感システム

**必須要件:**
- [ ] 感情タグによる共感表現:
  - ✨ 感動した
  - 😮 驚いた
  - 🌿 癒された
  - 🎉 ワクワクした
  - 💭 懐かしくなった
  - 💡 刺激を受けた
- [ ] 共感数は表示しない（重要）
- [ ] 自分が押した感情タグのみ表示

##### 🎲 偶然の出会い機能

**必須要件:**
- [ ] ランダム発見: 完全ランダムに体験を表示
- [ ] 今日のひとつの体験: 毎日1つだけ
- [ ] 地図からの発見: 地域をタップすると3つの体験
- [ ] 知られざる体験: まだ多くの人に見られていない体験

##### 🔍 感性の近い人の発見

**必須要件:**
- [ ] ユーザーの行動データ収集:
  - 閲覧した体験
  - 滞在時間
  - スクロール深度
  - 共感した感情タグ
- [ ] 簡易版・類似度計算アルゴリズム:
  - 共感する感情の類似度（30%）
  - 興味のある場所の重なり（20%）
  - 行動パターンの類似度（50%）
- [ ] 感性の近い人の体験を推薦
- [ ] 誰が似ているかは表示しない（重要）

**データモデル:**
```typescript
interface UserProfile {
  userId: string

  viewedExperiences: {
    experienceId: string
    timeSpent: number // 秒数
    scrollDepth: number // 0-1
    returnedLater: boolean
  }[]

  resonanceEmotions: {
    emotion: string
    count: number
  }[]

  interestRegions: {
    countryCode: string
    weight: number
  }[]
}
```

##### 📝 自分の評価を大切にする設計

**必須要件:**
- [ ] 体験を読む → まず自分の感想を書く → 他の人の感想が見られる
- [ ] 感想入力はスキップ可能
- [ ] 自分の感想の保存・振り返り

---

### Phase 4: 拡張機能

**期間**: 2-3ヶ月
**前提**: Phase 3完了

#### 3-12. 本・映画の記録

**必須要件:**
- [ ] 本の表紙を撮影してOCR自動認識
- [ ] 本の検索・追加（Google Books API）
- [ ] 映画のタイトル検索・追加（TMDb API）
- [ ] メディア記録の表示・統合

#### 3-13. 高度な振り返り機能

**必須要件:**
- [ ] タイムマシン機能: X年前の今日、何をしていたか
- [ ] ランダムな思い出: 過去の記録をランダムに表示
- [ ] 体験の再現: 写真 + 環境音 + 音声メモの没入型再生

#### 3-14. SNSシェア機能

**必須要件:**
- [ ] 世界地図のスクリーンショット生成
- [ ] カスタマイズ可能なシェアテキスト
- [ ] Twitter / Instagram / Facebookへのシェア

#### 3-15. 音声文字起こし

**必須要件:**
- [ ] 音声の自動文字起こし（プレミアム機能）
- [ ] 文字起こしテキストの編集・保存

---

### Phase 5: 収益化・改善

**期間**: 継続
**前提**: Phase 4完了

#### 3-16. プレミアムプラン

**無料プラン:**
- 基本的な記録機能（写真・音声・位置）
- ローカルストレージのみ
- 訪問国5カ国まで地図表示
- 広告表示あり
- 「初めて」ストーリーの閲覧・投稿

**プレミアムプラン:**
- クラウド同期・無制限ストレージ
- すべての訪問国を地図表示
- 音声の自動文字起こし
- 高画質メディア保存
- 複数デバイス同期
- 印刷用フォトブック作成
- 感性分析の詳細表示
- 広告なし

**必須要件:**
- [ ] サブスクリプション決済の実装（App Store / Google Play）
- [ ] プラン選択画面
- [ ] 機能制限の実装
- [ ] プレミアム限定機能の開発

#### 3-17. その他の収益源

**オプション要件:**
- [ ] フォトブック印刷サービス
- [ ] プレミアムテーマ（地図のデザインカスタマイズ）
- [ ] アフィリエイト（ホテル予約、航空券）

---

## 4. 非機能要件

### 4-1. パフォーマンス

**必須要件:**
- [ ] アプリ起動時間: 3秒以内
- [ ] 写真撮影から保存完了まで: 2秒以内
- [ ] タイムライン表示: 1秒以内（100件まで）
- [ ] 地図の初回読み込み: 2秒以内

### 4-2. バッテリー最適化

**必須要件:**
- [ ] 位置情報取得の最適化:
  - 移動中: 高精度GPS、10秒〜1分間隔
  - 静止中: 低消費モード、更新停止
  - モーション検知: 加速度センサーで移動判定
- [ ] バックグラウンド処理の最小化
- [ ] 同期は WiFi 接続時のみ（デフォルト設定）

### 4-3. オフライン対応

**必須要件:**
- [ ] すべての機能がオフラインで動作
- [ ] ローカルDBへの即座の保存
- [ ] オンライン復帰時の自動同期
- [ ] 同期状態の可視化

### 4-4. セキュリティ

**必須要件:**
- [ ] ユーザー認証（Firebase Auth / Auth0）
- [ ] データの暗号化（通信・保存）
- [ ] 位置情報の取得同意
- [ ] プライバシーポリシー・利用規約の実装
- [ ] GDPR・個人情報保護法準拠

### 4-5. アクセシビリティ

**必須要件:**
- [ ] スクリーンリーダー対応
- [ ] 適切なコントラスト比
- [ ] タップターゲットサイズ: 最小44x44pt
- [ ] キーボードナビゲーション対応

### 4-6. 多言語対応

**オプション要件:**
- [ ] 日本語・英語対応
- [ ] 将来的に多言語展開

---

## 5. データ構造

### 5-1. 主要エンティティ

#### User（ユーザー）
```typescript
interface User {
  id: string
  email: string
  displayName: string
  photoUrl?: string
  createdAt: Date
  isPremium: boolean
}
```

#### Experience（体験記録）
```typescript
interface Experience {
  id: string
  userId: string
  timestamp: Date
  location: {
    latitude: number
    longitude: number
    address: string
    placeName: string
    countryCode: string
  }
  weather: {
    condition: string
    temperature: number
    icon: string
  }
  photos: string[]
  videos: string[]
  audioMemos: string[]
  ambientSounds: string[]
  textNotes?: string
  tags: string[]
  contextType?: 'meal' | 'sightseeing' | 'travel'

  // 「初めて」関連
  isFirstTime: boolean
  firstTimeType?: string

  // 共感システム
  resonances: {
    userId: string
    emotionType: string
    createdAt: Date
  }[]

  syncStatus: 'pending' | 'syncing' | 'synced' | 'error'
  createdAt: Date
  updatedAt: Date
}
```

#### VisitedCountry（訪問国）
```typescript
interface VisitedCountry {
  code: string // 'JP', 'IT', 'US'
  name: string
  continent: string
  firstVisit: Date
  lastVisit: Date
  visitCount: number
  totalDays: number
  photoCount: number
  musicCount: number
  geometry: GeoJSON // 地図描画用
}
```

#### MediaRecord（メディア記録）
```typescript
interface MediaRecord {
  id: string
  userId: string
  type: 'music' | 'book' | 'movie'
  title: string
  creator: string
  coverImage: string
  timestamp: Date
  location: Location
  countryCode: string
  notes?: string
  externalId: string
  externalUrl?: string
}
```

#### FirstTimeStory（「初めて」ストーリー）
```typescript
interface FirstTimeStory {
  id: string
  userId: string
  type: string
  country: string
  countryCode: string
  continent: string
  date: Date
  ageAtTime: number

  title: string
  beforeFeeling: string
  duringFeeling: string
  afterFeeling: string

  memorableMoments: {
    title: string
    description: string
    photoUrl?: string
    audioUrl?: string
    timestamp: Date
  }[]

  whatILearned: string
  howIChanged: string

  coverPhotoUrl: string
  photos: string[]
  tags: string[]
  isPublic: boolean

  viewsCount: number // 保存するが表示しない
  resonancesCount: number // 表示しない
  commentsCount: number

  createdAt: Date
  updatedAt: Date
}
```

#### UserProfile（ユーザープロファイル）
```typescript
interface UserProfile {
  userId: string

  viewedExperiences: {
    experienceId: string
    timeSpent: number
    scrollDepth: number
    returnedLater: boolean
  }[]

  resonanceEmotions: {
    emotion: string
    count: number
  }[]

  personalCriteria: {
    criterion: string
    weight: number
  }[]

  writingAnalysis: {
    frequentWords: string[]
    emotionalTone: {
      positive: number
      negative: number
      contemplative: number
    }
    valueKeywords: {
      [key: string]: number
    }
  }
}
```

---

## 6. 開発フェーズ

### Phase 1: MVP（3-4ヶ月）
- [ ] 写真・位置情報の記録
- [ ] 音声メモ機能
- [ ] ローカルストレージ
- [ ] 基本的なタイムラインビュー
- [ ] 訪問国の自動検出
- [ ] Firebase Analytics導入

### Phase 2: コア機能（2-3ヶ月）
- [ ] 環境音の自動記録
- [ ] クラウド同期
- [ ] 世界地図の塗りつぶし
- [ ] 基本的なゲーミフィケーション
- [ ] 音楽連携（Spotify）
- [ ] 「初めて」の自動検出

### Phase 3: コミュニティ機能（2-3ヶ月）
- [ ] 「初めて」ストーリー投稿・閲覧
- [ ] 共感システム（感情タグ）
- [ ] 偶然の出会い機能
- [ ] 簡易版・感性マッチング（行動ベース）
- [ ] 自分の評価軸設定

### Phase 4: 拡張機能（2-3ヶ月）
- [ ] 本・映画の記録
- [ ] 高度な振り返り機能（タイムマシンなど）
- [ ] SNSシェア機能
- [ ] バッジ・達成システム拡充
- [ ] 音声文字起こし
- [ ] テキスト分析による感性マッチング

### Phase 5: 収益化・改善（継続）
- [ ] プレミアムプラン実装
- [ ] フォトブック印刷サービス
- [ ] 機械学習による推薦精度向上
- [ ] ユーザーフィードバック反映
- [ ] パフォーマンス最適化
- [ ] 多言語対応

---

## 7. 成功指標（KPI）

### 7-1. ユーザー指標

- **DAU/MAU**: デイリー/マンスリーアクティブユーザー
  - 目標: MAU 10,000人（Phase 2終了時）
- **リテンション率**:
  - 1日後: 70%
  - 7日後: 40%
  - 30日後: 20%
- **記録数**: ユーザーあたりの平均記録数
  - 目標: 10件/月
- **エンゲージメント**: アプリ起動頻度、滞在時間
  - 目標: 週3回以上起動

### 7-2. 機能指標

- **記録完了率**: 撮影→保存の完了率
  - 目標: 90%以上
- **音声メモ利用率**: 音声メモを使うユーザーの割合
  - 目標: 30%以上
- **振り返り率**: 旅行後に振り返りをする割合
  - 目標: 50%以上
- **地図閲覧率**: 世界地図を見る頻度
  - 目標: 週1回以上
- **「初めて」投稿率**: 「初めて」ストーリーを投稿する割合
  - 目標: 10%（Phase 3）
- **共感率**: 体験に共感タグをつける割合
  - 目標: 20%（Phase 3）

### 7-3. コミュニティ指標

- **「初めて」閲覧率**: 「初めて」フィードを見る頻度
  - 目標: 週2回以上
- **偶然の出会い利用率**: ランダム発見機能の利用
  - 目標: 週1回以上
- **感性マッチ精度**: 推薦された体験の滞在時間
  - 目標: 平均60秒以上

### 7-4. ビジネス指標

- **コンバージョン率**: 無料→プレミアムの転換率
  - 目標: 5%（Phase 5）
- **ARPU**: ユーザーあたりの平均収益
  - 目標: $2/月（Phase 5）
- **LTV**: 顧客生涯価値
  - 目標: $50（Phase 5）
- **チャーンレート**: 解約率
  - 目標: 5%/月以下（Phase 5）

---

## 8. 技術スタック

### モバイルアプリ（ネイティブ）
- **フレームワーク**: React Native with Expo
- **開発環境**: Expo Go（Phase 1）
- **ビルドツール**: Metro Bundler
- **言語**: TypeScript（厳格モード）
- **状態管理**: React Context / Zustand
- **スタイリング**: NativeWind（TailwindCSS for React Native）
- **ローカルDB**: Expo SQLite（Phase 1）
- **地図表示**: React Native Maps / SVG地図（将来実装）
- **カメラ**: expo-camera
- **位置情報**: expo-location
- **音声録音・再生**: expo-av
- **ファイル操作**: expo-file-system
- **センサー**: expo-sensors（モーション検知用）

### バックエンド（Phase 2以降）
- **ストレージ**: AWS S3 / Google Cloud Storage
- **データベース**: PostgreSQL / Firebase Firestore
- **API**: REST / GraphQL
- **認証**: Firebase Auth / Auth0

### 外部API
- **地図・ジオコーディング**: Google Maps API / Mapbox
- **天気情報**: OpenWeather API
- **音楽**: Spotify API
- **本**: Google Books API
- **映画**: TMDb API

### 分析・推薦
- **アナリティクス**: Firebase Analytics
- **類似度計算**: コサイン類似度、Jaccard係数
- **テキスト分析**: TF-IDF、感情分析

---

## 9. リスクと対策

### 技術的リスク

**バッテリー消費:**
- 対策: 段階的な位置情報取得、モーション検知の活用

**ストレージ不足:**
- 対策: 自動圧縮、クラウド同期、古いデータの削除提案

**同期の信頼性:**
- 対策: リトライ機構、エラーハンドリング、ユーザーへの透明な状態表示

**推薦アルゴリズムの精度:**
- 対策: Phase 1はシンプルな方法、徐々に改善、A/Bテスト

### ビジネスリスク

**競合:**
- 対策: 独自の価値（音・メディア・感性コミュニティ）で差別化

**ユーザー獲得コスト:**
- 対策: 口コミ促進、SNSシェア機能、「初めて」ストーリーのバイラル性

**マネタイズ:**
- 対策: 段階的な機能制限、明確な価値提供

**コミュニティの健全性:**
- 対策: 報告機能、モデレーション、ポジティブな文化醸成

### 法的リスク

**プライバシー:**
- 対策: GDPR・個人情報保護法準拠、明確な利用規約

**位置情報:**
- 対策: ユーザー同意、用途の明確化、オプトアウト可能

**音楽・書籍の著作権:**
- 対策: メタデータのみ保存、外部リンク活用

**ユーザー生成コンテンツ:**
- 対策: 利用規約、報告機能、コンテンツポリシー

---

## 10. 参考情報

### 競合アプリ

1. **Polarsteps**: 自動ルートトラッキング、1500万人以上のユーザー
2. **Travel Diaries**: 本のような美しいレイアウト
3. **Day One Journal**: 位置情報・天気・音楽の自動収集
4. **Journey**: デバイス間同期、PDFエクスポート
5. **Find Penguins**: GPSトラッキング + AI

### 差別化戦略

- マルチモーダル記録（写真 + 音 + 感情）
- 超低ハードル（自動記録 + 音声優先）
- 感性ベースのコミュニティ（人気度ではなく本質的共感）
- 「初めて」体験の共有（未経験者支援）
