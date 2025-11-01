# プロジェクト開発ルール - Experience the World

このドキュメントは、Experience the Worldプロジェクトの開発方針とルールを定義します。

**プロジェクト概要**: 旅行の「体験の質感」を記録し、後から振り返ったときにその瞬間の感覚・感情が鮮明に蘇るアプリ

**タグライン**: 「瞬間を捉える、体験が蘇る」

**関連ドキュメント**:
- [プロダクトビジョン](product-vision.md) - WHY: ビジョン・コンセプト・ビジネスモデル
- [要件定義書](requirements.md) - WHAT: 機能要件・非機能要件・データ構造
- [開発計画](development-plan.md) - Phase 1の開発ステップと進捗管理
- [スタイリングガイド](styling-guide.md) - スタイリング詳細ガイド

## ドキュメント管理ルール

### 機密情報の取り扱い

**重要**: `.claude`ディレクトリ内のドキュメントは**機密情報を一切含まないこと**。

**禁止事項:**
- APIキー、トークン、パスワード
- ユーザーの個人情報
- 内部のIPアドレスやサーバー情報
- 企業秘密や機密事項

**理由:**
- `.claude`ディレクトリはGitHubにプッシュされる
- プロジェクトのドキュメントとして公開される可能性がある
- チーム開発時に複数人がアクセスする

**機密情報の正しい保存場所:**
- `.env` ファイル（.gitignoreに含まれている）
- `.env.local` ファイル（.gitignoreに含まれている）
- 環境変数（Expo Secrets など）

**例:**
\`\`\`bash
# ✅ Good - .envファイルに保存
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# ❌ Bad - .claudeディレクトリに記載しない
# project-rules.md に "APIキー: sk-abc123..." と書かない
\`\`\`


### 開発計画の更新

**重要**: 作業を進めたら、必ず [development-plan.md](development-plan.md) を更新すること。

**更新タイミング:**
1. **ステップ完了時**: タスクをチェック済みに変更し、ステータスを「✅ 完了」に更新
2. **新しいステップ開始時**: 「🔄 次のタスク」マークを移動
3. **予定変更時**: スケジュール表を更新
4. **問題発生時**: リスク管理セクションに追記

**更新すべきセクション:**
- ステップのタスクチェックボックス
- ステップのステータス
- 「6-1. 現在の進捗」
- 「6-2. 今後の予定」（スケジュール表）

**目的:**
- 進捗の可視化
- タスクの抜け漏れ防止
- チーム（または未来の自分）への情報共有

## 技術スタック


## Gitワークフロー

### 基本的な開発フロー

プロジェクトはGitHubでバージョン管理されています。以下のワークフローに従って開発を進めてください。

**リポジトリ:** https://github.com/izumuri1/experience-the-world

### 日常的な作業フロー

```bash
# 1. コードを変更・実装

# 2. 変更内容を確認
git status

# 3. 変更をステージング
git add .

# 4. コミット（意味のあるメッセージで）
git commit -m "feat: ホーム画面を実装"

# 5. GitHubにプッシュ
git push origin main
# → Username: izumuri1 を入力
# → Password: GitHubパスワードを入力
```

### コミットのタイミング

**推奨するコミット単位:**
- ✅ 各ステップの完了時
- ✅ 機能追加が完了した時
- ✅ バグ修正が完了した時
- ✅ リファクタリングが完了した時
- ✅ ドキュメント更新時

**避けるべき:**
- ❌ 1日の終わりにまとめてコミット（何を変更したか分からなくなる）
- ❌ 動かない状態でコミット（次回の開発開始時に困る）
- ❌ 無意味なコミットメッセージ（例: "update", "fix", "test"）

### コミットメッセージの書き方

**Conventional Commits形式を使用:**

```
<type>: <短い説明>

<詳細な説明（オプション）>
```

**Type一覧:**
- `feat:` - 新機能追加
- `fix:` - バグ修正
- `docs:` - ドキュメント変更のみ
- `style:` - コードの意味に影響しない変更（空白、フォーマット等）
- `refactor:` - バグ修正や機能追加を伴わないコード改善
- `test:` - テストの追加・修正
- `chore:` - ビルドプロセスやツールの変更

**良いコミットメッセージの例:**
```bash
git commit -m "feat: タイムライン画面の実装

- TimelineScreenコンポーネント作成
- FlatListで時系列表示
- 日付セパレーターの実装
- iPhone実機テスト完了"
```

**悪いコミットメッセージの例:**
```bash
git commit -m "update"           # ❌ 何を変更したか不明
git commit -m "fix"              # ❌ 何を修正したか不明
git commit -m "いろいろ変更"      # ❌ 具体性がない
```

### ステップごとのコミット例

```bash
# ステップ6完了時
git add .
git commit -m "feat: ステップ6完了 - タイムライン画面実装

- TimelineScreen, ExperienceCard, ExperienceDetailScreen実装
- 写真パスDB保存バグ修正
- モーダル遷移改善
- UX改善（タップ領域拡大、シャッター音回避）
- iPhone実機テスト完了"
git push origin main

# ドキュメント更新時
git add .claude/project-rules.md
git commit -m "docs: Gitワークフローの追記"
git push origin main
```

### ブランチ戦略（Phase 1）

Phase 1では、**mainブランチ直接開発**で進めます。

```bash
# 基本的にこのコマンドだけ
git push origin main
```

**Phase 2以降の計画:**
- feature/機能名 でブランチを切って開発
- Pull Requestでレビュー
- mainにマージ

### トラブル時の対処

**間違ってコミットした場合:**
```bash
# 直前のコミットを取り消し（変更は残る）
git reset --soft HEAD^

# 修正してから再コミット
git add .
git commit -m "fix: 正しいコミットメッセージ"
```

**プッシュに失敗した場合:**
```bash
# リモートの変更を取得してからプッシュ
git pull origin main
git push origin main
```

### モバイルアプリ（ネイティブ）
- **フレームワーク**: React Native with Expo
- **開発環境**: Expo Go（Phase 1）
- **ビルドツール**: Metro Bundler
- **スタイリング**: NativeWind（TailwindCSS for React Native）
- **言語**: TypeScript（厳格モード）
- **状態管理**: React Context / Zustand（将来実装）
- **ローカルDB**: Expo SQLite（Phase 1）
- **地図**: React Native Maps（将来実装）
- **カメラ**: expo-camera
- **位置情報**: expo-location
- **音声録音**: expo-av
- **ファイル操作**: expo-file-system

### バックエンド（Phase 2以降）
- **ストレージ**: AWS S3 / Google Cloud Storage
- **データベース**: PostgreSQL / Firebase
- **認証**: Firebase Auth / Auth0

### 外部API（Phase 2以降）
- **地図**: Google Maps API / Mapbox
- **天気**: OpenWeather API
- **音楽**: Spotify API（Phase 2）
- **本**: Google Books API（Phase 4）
- **映画**: TMDb API（Phase 4）
- **分析**: Firebase Analytics（Phase 1）

## スタイリング規約

**詳細は [styling-guide.md](styling-guide.md) を参照してください。**

### 基本ルール

1. **許可された色のみ使用**
   - プライマリカラー: `primary-{50-900}`
   - セカンダリカラー: `secondary-{50-900}`
   - グレースケール: `gray-{50-900}`
   - 基本色: `white`, `black`, `transparent`, `current`
   - これ以外の色（red, blue, green等）は使用禁止

2. **インラインスタイルの禁止**
   - `style={{}}` は原則使用しない
   - すべてTailwindCSSのクラスで記述

   **例外（やむを得ない場合のみ許可）:**
   - `Animated.View`内でNativeWindクラスが機能しない場合
   - React Nativeアニメーションの`transform`プロパティ
   - 動的な値を計算して適用する場合（進捗バーの幅など）

   ```typescript
   // ✅ Good - アニメーション（例外）
   <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
     <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
   </Animated.View>

   // ✅ Good - 動的な値（例外）
   <View className="h-2 bg-primary-500" style={{ width: `${progress}%` }} />

   // ❌ Bad - 通常のスタイリング（例外に該当しない）
   <View style={{ padding: 16, backgroundColor: 'blue' }}>
   ```

3. **カスタムCSSの最小化**
   - 可能な限りTailwindのユーティリティクラスを使用
   - どうしても必要な場合のみ `@layer components` で定義

## コンポーネント設計

### ディレクトリ構造

```
src/
├── components/     # 再利用可能なコンポーネント
├── pages/          # ページコンポーネント
├── hooks/          # カスタムフック
├── utils/          # ユーティリティ関数
├── types/          # 型定義
└── assets/         # 静的ファイル
```

### コンポーネント作成ルール

1. **関数コンポーネントを使用**
   - クラスコンポーネントは使用しない
   - React Hooksを活用

2. **型定義を明示**
   - Propsは必ず型定義する
   - `any` 型は原則禁止

3. **命名規則**
   - コンポーネント: PascalCase（例: `Button`, `UserProfile`）
   - ファイル名: コンポーネント名と同じ（例: `Button.tsx`）
   - 自作関数: `app` プレフィックス + camelCase（例: `appFormatDate`, `appValidateEmail`）
   - カスタムフック: `useApp` プレフィックス + PascalCase（例: `useAppAuth`, `useAppFetch`）
   - 外部ライブラリのフック: `use` のみ（例: `useState`, `useEffect`）

### 自作関数とカスタムフックの命名規則

**目的:** 自作のユーティリティ関数とカスタムフックを、外部ライブラリのものと一目で区別する

**自作関数の例:**
```typescript
// ✅ Good - app プレフィックスで自作と明示
export const appFormatDate = (date: Date): string => { ... }
export const appValidateEmail = (email: string): boolean => { ... }
export const appCalculateTotal = (items: Item[]): number => { ... }

// ❌ Bad - プレフィックスなし（外部ライブラリと区別できない）
export const formatDate = (date: Date): string => { ... }
```

**カスタムフックの例:**
```typescript
// ✅ Good - useApp プレフィックスで自作と明示
export const useAppAuth = () => { ... }
export const useAppFetch = <T>(url: string) => { ... }
export const useAppLocalStorage = (key: string) => { ... }

// ❌ Bad - use のみ（React標準フックと区別しづらい）
export const useAuth = () => { ... }
```

**配置場所:**
- 自作関数: `src/utils/` ディレクトリ
- カスタムフック: `src/hooks/` ディレクトリ

## コーディング規約

### TypeScript

1. **厳格な型チェック**
   - `strict: true` を維持
   - 型推論を活用しつつ、必要な箇所は明示的に型定義

2. **インポート順序**
   ```typescript
   // 1. React関連
   import { useState, useEffect } from 'react'

   // 2. 外部ライブラリ
   import axios from 'axios'

   // 3. 内部モジュール（絶対パス）
   import { Button } from '@/components/Button'

   // 4. 相対パス
   import { helper } from './utils'

   // 5. 型定義
   import type { User } from '@/types'
   ```

### CSS/スタイリング

1. **レスポンシブ対応**
   - モバイルファーストで設計
   - Tailwindのブレークポイントを使用: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

2. **アクセシビリティ**
   - セマンティックHTMLを使用
   - 適切なARIA属性を設定

### アイコン使用ルール

**重要**: UIには絵文字ではなく、Expo Vector Iconsを使用すること。

1. **Expo Vector Iconsの使用**
   - Expo標準の `@expo/vector-icons` を使用
   - 絵文字（📷, 📍, 🌤️など）は使用禁止
   - アイコンセット: Ionicons を優先的に使用

2. **使用例**
   ```typescript
   import { Ionicons } from '@expo/vector-icons';

   // ✅ Good - Expo Vector Icons
   <Ionicons name="camera" size={24} color="#ffffff" />
   <Ionicons name="location" size={20} color="#3388ff" />

   // ❌ Bad - 絵文字
   <Text>📷</Text>
   <Text>📍</Text>
   ```

3. **アイコン選択の方針**
   - アイコン検索: https://icons.expo.fyi/
   - Ioniconsを優先（iOS/Android両対応、シンプルで統一感）
   - サイズは16, 20, 24, 28, 32, 40, 48の倍数推奨
   - 色はNativeWindのカラーパレット（primary, secondary, white等）を使用

4. **メリット**
   - プロフェッショナルな見た目
   - サイズ・色を自由に調整可能
   - 環境依存の表示問題がない
   - NativeWindとの統合が完璧

## 環境変数

1. **機密情報の管理**
   - `.env.local` に保存（Gitにコミットしない）
   - 環境変数は `VITE_` プレフィックスを使用

2. **型安全な環境変数**
   - `import.meta.env` を使用
   - 必要に応じて型定義を作成

## Git運用

### ブランチ戦略

- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `fix/*`: バグ修正

### コミットメッセージ

```
<type>: <subject>

<body>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `style`: スタイル変更（CSS）
- `refactor`: リファクタリング
- `docs`: ドキュメント
- `test`: テスト
- `chore`: 雑務

## セキュリティ対策

### XSS（クロスサイトスクリプティング）対策

1. **dangerouslySetInnerHTMLの禁止**
   - 原則として使用禁止
   - どうしても必要な場合は、DOMPurifyなどでサニタイズ必須

2. **ユーザー入力の扱い**
   - すべてのユーザー入力を信頼しない
   - 表示前に適切にエスケープ（Reactは自動的にエスケープするが、意識する）
   - URLパラメータ、フォーム入力は必ずバリデーション

**例:**
```typescript
// ❌ Bad - XSSの危険性
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good - Reactの自動エスケープを利用
<div>{userInput}</div>

// ✅ Good - どうしても必要な場合はサニタイズ
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 認証・認可

1. **認証トークンの管理**
   - JWTなどのトークンはhttpOnlyクッキーに保存（推奨）
   - LocalStorageに保存する場合はXSSリスクを理解する
   - トークンの有効期限を設定

2. **保護されたルートの実装**
   - 認証が必要なページは必ずガード
   - 認可チェックはフロントエンドとバックエンド両方で実施

**例:**
```typescript
// ✅ Good - 認証ガード
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
```

### API・環境変数の管理

1. **APIキーの保護**
   - **絶対にフロントエンドにAPIキーを埋め込まない**
   - 機密性の高いAPIキーはバックエンドのみで使用
   - フロントエンドで必要な場合は`.env.local`に保存し、必ず`.gitignore`に追加

2. **環境変数の使用**
   ```typescript
   // ✅ Good - 環境変数を使用
   const apiUrl = import.meta.env.VITE_API_URL

   // ❌ Bad - ハードコード
   const apiUrl = 'https://api.example.com'
   ```

3. **公開してはいけない情報**
   - データベース接続文字列
   - サードパーティAPIのシークレットキー
   - 暗号化キー
   - パスワード

### HTTPS・通信の安全性

1. **HTTPS必須**
   - 本番環境では必ずHTTPSを使用
   - 開発環境でもHTTPSを推奨（Viteは `--https` オプションで対応）

2. **APIリクエスト**
   - すべてのAPIリクエストはHTTPS経由
   - HTTPへのフォールバックは禁止

### CORS（クロスオリジンリソース共有）

1. **バックエンド側の設定**
   - 信頼できるオリジンのみ許可
   - ワイルドカード（`*`）の使用は本番環境では禁止

2. **フロントエンド側の確認**
   - CORSエラーが出た場合、安易に回避策を使わない
   - バックエンドの設定を正しく行う

### 入力バリデーション

1. **クライアント側バリデーション**
   - すべてのフォーム入力をバリデーション
   - zodやyupなどのスキーマバリデーションライブラリを使用

2. **サーバー側バリデーション**
   - クライアント側のバリデーションは信頼しない
   - バックエンドでも必ずバリデーション実施

**例:**
```typescript
// ✅ Good - zodを使用したバリデーション
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

const appValidateUser = (data: unknown) => {
  return userSchema.safeParse(data)
}
```

### SQLインジェクション対策（該当する場合）

1. **直接的なSQL実行の禁止**
   - 生のSQLクエリにユーザー入力を直接埋め込まない
   - ORMやプリペアドステートメントを使用

2. **フロントエンド側の責任**
   - バックエンドが適切に実装されていることを確認
   - 不適切なクエリパラメータを送信しない

### 依存パッケージの脆弱性管理

1. **定期的な脆弱性チェック**
   ```bash
   # 定期的に実行
   npm audit

   # 可能な範囲で自動修正
   npm audit fix
   ```

2. **依存パッケージの最小化**
   - 不要なパッケージは削除
   - 信頼できるパッケージのみインストール
   - パッケージのダウンロード数、メンテナンス状況を確認

3. **package-lock.jsonのコミット**
   - 依存関係を固定し、予期しない更新を防ぐ

### セキュリティヘッダー

本番環境では以下のセキュリティヘッダーを設定（主にバックエンド・インフラ側）:

- `Content-Security-Policy`: XSS対策
- `X-Frame-Options`: クリックジャッキング対策
- `X-Content-Type-Options`: MIMEタイプスニッフィング対策
- `Strict-Transport-Security`: HTTPS強制

### その他のベストプラクティス

1. **エラーメッセージ**
   - 本番環境では詳細なエラーメッセージを表示しない
   - ユーザーには一般的なメッセージ、開発者にはログで詳細を記録

2. **ログ出力**
   - 機密情報（パスワード、トークンなど）をログに出力しない
   - 本番環境では `console.log` を削除または無効化

3. **コードレビュー**
   - セキュリティの観点でコードレビューを実施
   - 機密情報のハードコードがないか確認

## パフォーマンス

1. **遅延読み込み**
   - React.lazy() を活用
   - ルートベースのコード分割

2. **最適化**
   - 不要な再レンダリングを防ぐ（useMemo, useCallback）
   - 大きなリストは仮想化を検討

## テスト

- コンポーネントテストを記述
- カバレッジ目標: 80%以上

## その他

### 開発環境

**重要**: このプロジェクトは **WSL (Ubuntu 22.04) 側で統一** して開発します。

**現在の構成（✅ 正常動作）:**
- VS Code: WSL側で起動（Remote - WSL拡張機能を使用）
- Claude Code拡張機能: WSL側のVS Codeにインストール
- 統合ターミナル: WSL (Ubuntu) で動作
- CLI版Claude Code: WSL内にインストール
- ファイルシステム: `/home/izumuri/the-world`

**以前の構成（❌ 動作しない）:**
- VS Code: Windows側で起動
- Claude Code拡張機能: Windows側にインストール
- ファイルアクセス: `\\wsl.localhost\Ubuntu-22.04\...` 経由
- **問題**: Windows側の拡張機能がWSL内のCLIと通信できずエラー

**セットアップ手順:**
1. VS Codeで「Remote - WSL」拡張機能をインストール（Windows側）
2. VS Codeのコマンドパレット（Ctrl+Shift+P）から「WSL: Connect to WSL」を選択
3. WSL側でプロジェクトフォルダを開く: `/home/izumuri/the-world`
4. WSL側のVS CodeにClaude Code拡張機能をインストール
5. 統合ターミナルがUbuntuで動作していることを確認: `uname -a`

**開発時の注意:**
- npmコマンドはWSL内で実行
- gitコマンドもWSL内で実行
- すべての操作をWSL側で統一することで、環境の不整合を防ぐ

### ブラウザサポート

- 最新のChrome, Firefox, Safari, Edge
- モバイルブラウザ対応必須


---

## Experience the World 固有のルール

### プロダクト原則（概要）

詳細なビジョン・コンセプトは [product-vision.md](product-vision.md) を参照してください。

**開発時に常に意識すべき4つの原則:**

1. **記録のハードルを極限まで下げる**
   - ワンタップ、音声優先、自動記録

2. **オフライン優先設計**
   - ローカルファースト、自動同期

3. **体験の質感を大切にする**
   - 写真・音・感情・メディアの統合

4. **本質的な共感を重視**
   - いいね数・人気度は表示しない

### 開発フェーズ

**現在: Phase 1（MVP）**

詳細な機能要件は [requirements.md](requirements.md#6-開発フェーズ) を参照してください。

**Phase 1の実装範囲:**
- 写真・音声記録機能
- タイムライン表示
- 訪問国の自動検出
- ローカルストレージ

**Phase 1での実装禁止:**
- クラウド同期（Phase 2以降）
- コミュニティ機能（Phase 3以降）
- ユーザー認証（Phase 2以降）
- 課金機能（Phase 5以降）

### データモデル

すべてのデータモデルは `src/types/` で定義し、[requirements.md](requirements.md#5-データ構造) のデータ構造に準拠してください。

**主要エンティティ:**
- Experience（体験記録）
- VisitedCountry（訪問国）
- MediaRecord（メディア記録）- Phase 2以降
- FirstTimeStory（「初めて」ストーリー）- Phase 3以降

### パフォーマンス目標

**Phase 1:**
- アプリ起動時間: 3秒以内
- 写真撮影から保存完了: 2秒以内
- タイムライン表示: 1秒以内（100件まで）

### 禁止事項

**コーディング:**
- `any` 型の使用（やむを得ない場合を除く）
- `console.log` の本番コードへの残存
- ハードコードされたAPIキー
- 位置情報の無断取得（必ずユーザー同意）

**UI/UX:**
- 過度な通知
- 記録を強制するUI
- いいね数・人気度の表示
- フォロワー数の強調

---

## トラブルシューティング

### Claude Code拡張機能の問題（WSL環境）

**問題**: Claude Code拡張機能が動作しない、エラーが発生する

**症状:**
- Windows側のVS CodeでClaude Code拡張機能をインストールしたが動作しない
- WSL内のCLIと通信できないエラーが表示される
- コマンドが実行されない、応答がない

**原因:**
- Claude Code拡張機能をWindows側にインストールしている
- WSL環境では、拡張機能もWSL側にインストールする必要がある

**解決方法:**

1. **VS CodeをWSL側で起動する**
   - VS Codeのコマンドパレット（Ctrl+Shift+P）を開く
   - 「WSL: Connect to WSL」を選択
   - WSL側のVS Codeウィンドウが開く

2. **WSL側でプロジェクトを開く**
   - WSL側のVS Codeで「ファイル」→「フォルダーを開く」
   - `/home/izumuri/the-world` を選択

3. **Claude Code拡張機能をWSL側にインストール**
   - 拡張機能タブを開く
   - Claude Codeを検索
   - 「Install in WSL: Ubuntu-22.04」ボタンをクリック

4. **動作確認**
   - 統合ターミナルで `uname -a` を実行してUbuntuであることを確認
   - Claude Code拡張機能が正常に動作することを確認

**確認ポイント:**
- VS Codeの左下に「WSL: Ubuntu-22.04」と表示されているか
- 統合ターミナルが `user@hostname:/home/izumuri/the-world$` のようなLinux形式か
- Claude Code拡張機能が「WSL: Ubuntu-22.04 - Installed」と表示されているか

### ファイル編集ツールの問題

**問題**: Editツールで「File has been unexpectedly modified」エラーが発生し、ファイルが編集できない

**症状:**
```
error: File has been unexpectedly modified. Read it again before attempting to write it.
```

このエラーは、以下の理由で発生する可能性があります：
- ファイルが外部プロセス（エディタ、IDE、ファイル監視ツール等）によって変更されている
- WSL環境とWindows環境間でのファイルシステムの同期タイミングの問題
- Claude Codeのファイル変更検出の過敏さ

**解決方法:**

#### 方法1: sedコマンドを使った直接編集（推奨）

Editツールが使えない場合は、`sed`コマンドで直接ファイルを編集します。

**例: import文の追加**
```bash
# 9行目の後に新しい行を追加
sed -i '9 a import TimelineScreen from '\''./src/screens/TimelineScreen'\'';' App.tsx

# 複数行をファイルから挿入
cat > /tmp/code.txt << 'ENDCODE'
  const handlePress = () => {
    console.log('pressed');
  };
ENDCODE
sed -i '50 r /tmp/code.txt' App.tsx
```

**sedコマンドの基本:**
- `sed -i` : ファイルを直接編集（in-place）
- `'行番号 a テキスト'` : 指定行の後に追加
- `'行番号 i テキスト'` : 指定行の前に挿入
- `'行番号 r ファイル'` : 指定行の後にファイルの内容を挿入
- `'s/検索/置換/'` : テキストの置換

**実際の使用例（ステップ6のタイムライン実装）:**

1. Import文を追加:
```bash
sed -i '9 a import TimelineScreen from '\''./src/screens/TimelineScreen'\'';' App.tsx
```

2. State変数を追加:
```bash
sed -i '20 a \  const [showTimeline, setShowTimeline] = useState(false);' App.tsx
```

3. 複数行のコードを追加:
```bash
# 一時ファイルにコードを書き込む
cat > /tmp/handlers.txt << 'EOF'
  const handleExperiencePress = (experience: Experience) => {
    setSelectedExperience(experience);
  };


### Gitの問題（WSL環境）

**問題**: `git status`や`git add`で「detected dubious ownership in repository」エラーが発生

**症状:**
```
fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu-22.04/home/izumuri/the-world'
To add an exception for this directory, call:
	git config --global --add safe.directory '%(prefix)///wsl.localhost/Ubuntu-22.04/home/izumuri/the-world'
```

**原因:**
- WSL (Windows Subsystem for Linux) 環境でGitを使用する際、WindowsとLinux間でファイル所有権が異なるため、Gitがセキュリティリスクと判断してブロックする

**解決方法:**

エラーメッセージに表示されたコマンドを実行して、このディレクトリを安全なディレクトリとして登録：

```bash
git config --global --add safe.directory '//wsl.localhost/Ubuntu-22.04/home/izumuri/the-world'
```

このコマンドは一度実行すれば、以降は問題なくGitコマンドが使えるようになります。

**注意:**
- このコマンドはプロジェクトごとに実行する必要があります
- 別のWSLプロジェクトで同じエラーが出た場合も、同様にそのパスを登録してください

### Expo開発サーバーの起動

**実機接続時の起動コマンド:**
```bash
npx expo start --tunnel
```

**理由:**
- WSL環境から実機（iPhone）に接続する場合、`--tunnel`オプションが必須
- ngrokを使ってインターネット経由で接続するため、同じWiFiネットワークにいる必要がない
- 初回起動時はngrokのセットアップが行われる（自動）

**その他のオプション:**
```bash
# キャッシュをクリアして起動（推奨）
npx expo start --tunnel --clear

# LAN接続（同じWiFi内のみ、WSLでは不安定）
npx expo start

# Localhost接続（USB接続時）
npx expo start --localhost
```

**初回セットアップ時:**
1. `npx expo start --tunnel`を実行
2. ngrokの初期化が完了するまで待つ（1-2分）
3. QRコードが表示されたら、Expo GoアプリでスキャンまたはURLを入力
4. アプリが起動するまで待つ（初回は数分かかる場合あり）

**トラブルシューティング:**
- エラーが出た場合は`npx expo start --tunnel --clear`でキャッシュクリア
- それでもダメな場合は`rm -rf node_modules && npm install`で再インストール

