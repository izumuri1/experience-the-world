# Experience the World - スタイリングガイド

**バージョン**: 1.0
**作成日**: 2025年10月29日
**対象**: React Native + Expo + NativeWind v2

**関連ドキュメント**:
- [開発ルール](project-rules.md) - コーディング規約全般
- [プロダクトビジョン](product-vision.md) - デザインコンセプト

---

## 目次

1. [技術スタック](#1-技術スタック)
2. [CSS読み込み順とスタイル優先度](#2-css読み込み順とスタイル優先度)
3. [TailwindCSSの使い方](#3-tailwindcssの使い方)
4. [カスタムカラーの使い方](#4-カスタムカラーの使い方)
5. [レイアウトのベストプラクティス](#5-レイアウトのベストプラクティス)
6. [よくある問題と解決方法](#6-よくある問題と解決方法)
7. [アクセシビリティ](#7-アクセシビリティ)

---

## 1. 技術スタック

### 1-1. 使用している技術

- **NativeWind v2.0.11**: TailwindCSSをReact Nativeで使えるようにするライブラリ
- **TailwindCSS v3.3.2**: ユーティリティファーストのCSSフレームワーク
- **React Native StyleSheet**: ネイティブのスタイリングシステム

### 1-2. なぜNativeWind v2を使うのか

**メリット:**
- ✅ classNameでスタイリングできる（保守性が高い）
- ✅ デザインの一貫性を保ちやすい
- ✅ Tailwind標準のユーティリティクラスが使える
- ✅ カスタムカラーをtailwind.config.jsで一元管理

**v4ではなくv2を使う理由:**
- v2はExpo SDK 54と互換性が高く安定している
- v4は設定が複雑で、現時点で動作しない問題がある

---

## 2. CSS読み込み順とスタイル優先度

### 2-1. スタイルの優先順位（重要！）

React Nativeでは、以下の順序でスタイルが適用されます：

```
1. style プロパティ（最優先）
2. className プロパティ
3. デフォルトスタイル
```

### 2-2. classNameの順序による上書き

**重要**: 同じプロパティを複数のclassで指定した場合、**後ろのclassが優先**されます。

#### ❌ 悪い例

```tsx
// bg-whiteが後ろにあるため、bg-primary-500が無効化される
<View className="bg-primary-500 bg-white">
  <Text>背景は白になる</Text>
</View>
```

#### ✅ 良い例

```tsx
// 上書きしたいclassを後ろに配置
<View className="bg-white bg-primary-500">
  <Text>背景は青（primary-500）になる</Text>
</View>
```

### 2-3. styleとclassNameの併用

同じプロパティを`className`と`style`の両方で指定した場合、**`style`が優先**されます。

#### ❌ 避けるべき

```tsx
// styleが優先されるため、classNameのbg-primary-500は無視される
<View className="bg-primary-500" style={{ backgroundColor: '#fff' }}>
  <Text>背景は白になる</Text>
</View>
```

#### ✅ 推奨

```tsx
// どちらか一方のみ使用する
<View className="bg-primary-500 p-4">
  <Text>classNameのみ使用</Text>
</View>

// または
<View style={{ backgroundColor: '#3388ff', padding: 16 }}>
  <Text>styleのみ使用</Text>
</View>
```

### 2-4. ベストプラクティス

**原則: 基本的にclassNameを使い、動的なスタイルのみstyleを使う**

```tsx
// ✅ 良い例: 静的なスタイルはclassName、動的な値はstyle
<View className="flex-1 bg-primary-500 p-4">
  <View style={{ width: dynamicWidth }}>
    <Text className="text-white text-lg">動的な幅</Text>
  </View>
</View>
```

---

## 3. TailwindCSSの使い方

### 3-1. 基本的な使い方

NativeWind v2では、React Nativeコンポーネントに`className`プロパティを使ってTailwindのクラスを指定できます。

```tsx
import { View, Text } from 'react-native';

<View className="flex-1 items-center justify-center bg-primary-500">
  <Text className="text-white text-2xl font-bold">
    Experience the World
  </Text>
</View>
```

### 3-2. よく使うユーティリティクラス

#### レイアウト

```tsx
// Flexbox
className="flex-1"           // flex: 1
className="flex-row"         // flexDirection: 'row'
className="flex-col"         // flexDirection: 'column'
className="items-center"     // alignItems: 'center'
className="justify-center"   // justifyContent: 'center'
className="justify-between"  // justifyContent: 'space-between'

// サイズ
className="w-full"           // width: '100%'
className="h-full"           // height: '100%'
className="w-20"             // width: 80 (20 * 4)
className="h-40"             // height: 160 (40 * 4)
```

#### スペーシング

```tsx
// padding
className="p-4"              // padding: 16 (4 * 4)
className="px-4"             // paddingHorizontal: 16
className="py-2"             // paddingVertical: 8
className="pt-4 pb-2"        // paddingTop: 16, paddingBottom: 8

// margin
className="m-4"              // margin: 16
className="mx-auto"          // marginHorizontal: 'auto'
className="mt-4 mb-2"        // marginTop: 16, marginBottom: 8
```

#### テキスト

```tsx
// サイズ・太さ
className="text-sm"          // fontSize: 14
className="text-base"        // fontSize: 16
className="text-lg"          // fontSize: 18
className="text-xl"          // fontSize: 20
className="text-2xl"         // fontSize: 24
className="font-bold"        // fontWeight: 'bold'
className="font-normal"      // fontWeight: 'normal'

// 配置
className="text-center"      // textAlign: 'center'
className="text-left"        // textAlign: 'left'
className="text-right"       // textAlign: 'right'
```

#### 色

```tsx
// 背景色
className="bg-primary-500"   // カスタムカラー
className="bg-white"         // 白
className="bg-black"         // 黒

// テキスト色
className="text-white"       // 白
className="text-gray-700"    // グレー
className="text-primary-500" // カスタムカラー
```

#### ボーダー・角丸

```tsx
// ボーダー
className="border"           // borderWidth: 1
className="border-2"         // borderWidth: 2
className="border-gray-300"  // borderColor

// 角丸
className="rounded"          // borderRadius: 4
className="rounded-lg"       // borderRadius: 8
className="rounded-full"     // borderRadius: 9999 (円形)
```

### 3-3. クラスの組み合わせ

複数のクラスを組み合わせてスタイルを作成できます：

```tsx
<View className="flex-1 bg-white p-4">
  <View className="bg-primary-500 rounded-lg p-6 shadow-lg">
    <Text className="text-white text-xl font-bold text-center">
      タイトル
    </Text>
    <Text className="text-white text-base mt-2">
      説明文
    </Text>
  </View>
</View>
```

### 3-4. 条件付きスタイル

```tsx
// ✅ 良い例: テンプレートリテラルで動的にクラスを組み立てる
<View className={`p-4 ${isActive ? 'bg-primary-500' : 'bg-gray-200'}`}>
  <Text className={`${isActive ? 'text-white' : 'text-gray-700'}`}>
    {isActive ? 'アクティブ' : '非アクティブ'}
  </Text>
</View>

// または、clsx / classnames ライブラリを使う（推奨）
import clsx from 'clsx';

<View className={clsx('p-4', {
  'bg-primary-500': isActive,
  'bg-gray-200': !isActive,
})}>
```

---

## 4. カスタムカラーの使い方

### 4-1. カラーパレット

プロジェクトでは、`tailwind.config.js`で以下のカスタムカラーを定義しています：

#### プライマリカラー（青: #3388ff ベース）

```tsx
className="bg-primary-50"    // #e6f2ff (最も薄い)
className="bg-primary-100"   // #cce5ff
className="bg-primary-200"   // #99ccff
className="bg-primary-300"   // #66b3ff
className="bg-primary-400"   // #3399ff
className="bg-primary-500"   // #3388ff ← メインカラー
className="bg-primary-600"   // #0066ff
className="bg-primary-700"   // #0055cc
className="bg-primary-800"   // #004499
className="bg-primary-900"   // #003366 (最も濃い)
```

#### セカンダリカラー（オレンジ: #ffc107 ベース）

```tsx
className="bg-secondary-50"  // #fff9e6 (最も薄い)
className="bg-secondary-100" // #fff3cc
className="bg-secondary-200" // #ffe799
className="bg-secondary-300" // #ffdb66
className="bg-secondary-400" // #ffcf33
className="bg-secondary-500" // #ffc107 ← サブカラー
className="bg-secondary-600" // #cc9a06
className="bg-secondary-700" // #997405
className="bg-secondary-800" // #664d03
className="bg-secondary-900" // #332602 (最も濃い)
```

#### グレースケール

```tsx
className="bg-gray-50"       // #f9fafb (最も薄い)
className="bg-gray-100"      // #f3f4f6
className="bg-gray-200"      // #e5e7eb
className="bg-gray-300"      // #d1d5db
className="bg-gray-400"      // #9ca3af
className="bg-gray-500"      // #6b7280
className="bg-gray-600"      // #4b5563
className="bg-gray-700"      // #374151
className="bg-gray-800"      // #1f2937
className="bg-gray-900"      // #111827 (最も濃い)
```

### 4-2. カラーの使い分け

#### メイン背景・アクセント

```tsx
// メイン背景: primary-500
<View className="bg-primary-500">

// アクセント・ボタン: secondary-500
<Pressable className="bg-secondary-500 px-6 py-3 rounded-lg">
  <Text className="text-white font-bold">ボタン</Text>
</Pressable>
```

#### テキスト

```tsx
// 白背景の場合
<View className="bg-white">
  <Text className="text-gray-900">メインテキスト</Text>
  <Text className="text-gray-600">サブテキスト</Text>
  <Text className="text-gray-400">補足テキスト</Text>
</View>

// 青背景の場合
<View className="bg-primary-500">
  <Text className="text-white">メインテキスト</Text>
  <Text className="text-primary-100">サブテキスト</Text>
</View>
```

#### ボーダー

```tsx
<View className="border border-gray-200">
  <Text>枠線</Text>
</View>
```

### 4-3. カラーの追加方法

新しいカラーを追加する場合は、`tailwind.config.js`を編集します：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: { ... },
      secondary: { ... },
      gray: { ... },
      // 新しいカラーを追加
      success: {
        500: '#10b981',
        600: '#059669',
      },
      error: {
        500: '#ef4444',
        600: '#dc2626',
      },
    },
  },
};
```

使用例：

```tsx
<View className="bg-success-500">
  <Text className="text-white">成功</Text>
</View>

<View className="bg-error-500">
  <Text className="text-white">エラー</Text>
</View>
```

---

## 5. レイアウトのベストプラクティス

### 5-1. 画面全体のレイアウト

```tsx
export default function SomeScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-primary-500 px-4 py-3">
        <Text className="text-white text-xl font-bold">タイトル</Text>
      </View>

      {/* メインコンテンツ */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-gray-900 text-base">コンテンツ</Text>
      </ScrollView>

      {/* フッター */}
      <View className="bg-gray-100 px-4 py-3">
        <Pressable className="bg-secondary-500 py-3 rounded-lg">
          <Text className="text-white text-center font-bold">保存</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 5-2. カード型コンポーネント

```tsx
<View className="bg-white rounded-lg shadow-md p-4 mx-4 my-2">
  <Text className="text-gray-900 text-lg font-bold mb-2">
    カードタイトル
  </Text>
  <Text className="text-gray-600 text-base">
    カードの説明文
  </Text>
</View>
```

### 5-3. ボタン

```tsx
// プライマリボタン
<Pressable className="bg-primary-500 px-6 py-3 rounded-lg">
  <Text className="text-white text-center font-bold">プライマリ</Text>
</Pressable>

// セカンダリボタン
<Pressable className="bg-secondary-500 px-6 py-3 rounded-lg">
  <Text className="text-white text-center font-bold">セカンダリ</Text>
</Pressable>

// アウトラインボタン
<Pressable className="border-2 border-primary-500 px-6 py-3 rounded-lg">
  <Text className="text-primary-500 text-center font-bold">アウトライン</Text>
</Pressable>

// テキストボタン
<Pressable className="px-4 py-2">
  <Text className="text-primary-500 font-bold">テキスト</Text>
</Pressable>
```

### 5-4. リストアイテム

```tsx
<Pressable className="flex-row items-center bg-white px-4 py-3 border-b border-gray-200">
  {/* アイコン */}
  <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
    <Text className="text-primary-500 text-xl">📷</Text>
  </View>

  {/* テキスト */}
  <View className="flex-1">
    <Text className="text-gray-900 text-base font-bold">タイトル</Text>
    <Text className="text-gray-600 text-sm">サブタイトル</Text>
  </View>

  {/* 右側のアイコン */}
  <Text className="text-gray-400">›</Text>
</Pressable>
```

### 5-5. フォーム

```tsx
<View className="px-4 py-6">
  {/* ラベル */}
  <Text className="text-gray-700 text-sm font-bold mb-2">
    メールアドレス
  </Text>

  {/* 入力フィールド */}
  <TextInput
    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
    placeholder="example@mail.com"
  />

  {/* エラーメッセージ */}
  <Text className="text-error-500 text-sm mt-1">
    メールアドレスを入力してください
  </Text>
</View>
```

---

## 6. よくある問題と解決方法

### 6-1. classNameが反映されない

#### 問題

```tsx
<View className="bg-primary-500">
  {/* 背景が青にならない */}
</View>
```

#### 原因と解決方法

**原因1: NativeWindのBabelプラグインが有効化されていない**

`babel.config.js`を確認：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'], // これが必要
  };
};
```

**原因2: tailwind.config.jsのcontentが正しくない**

```javascript
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  // ↑ 使用するファイルのパスを正しく指定
};
```

**原因3: キャッシュの問題**

```bash
npx expo start --clear
```

### 6-2. styleとclassNameで同じプロパティを指定してしまう

#### 問題

```tsx
// styleが優先されるため、bg-primary-500が無視される
<View className="bg-primary-500" style={{ backgroundColor: '#fff' }}>
```

#### 解決方法

どちらか一方のみ使用する：

```tsx
// ✅ classNameのみ
<View className="bg-primary-500">

// または

// ✅ styleのみ
<View style={{ backgroundColor: '#3388ff' }}>
```

### 6-3. 複数のclassで同じプロパティを指定してしまう

#### 問題

```tsx
// 先に書いたbg-primary-500が、後のbg-whiteで上書きされる
<View className="bg-primary-500 bg-white">
```

#### 解決方法

上書きしたいclassを後ろに配置：

```tsx
// ✅ bg-primary-500を適用したい場合
<View className="bg-white bg-primary-500">
```

### 6-4. カスタムカラーが使えない

#### 問題

```tsx
<View className="bg-primary-500">
  {/* 色が反映されない */}
</View>
```

#### 解決方法

`tailwind.config.js`でカスタムカラーが定義されているか確認：

```javascript
module.exports = {
  theme: {
    colors: {
      primary: {
        500: '#3388ff', // 定義されているか確認
      },
    },
  },
};
```

定義後は開発サーバーを再起動：

```bash
npx expo start --clear
```

### 6-5. テキストに背景色を付けたい

#### 問題

React Nativeの`<Text>`には`backgroundColor`を直接指定できません。

#### 解決方法

`<View>`で囲む：

```tsx
<View className="bg-secondary-500 px-3 py-1 rounded">
  <Text className="text-white font-bold">ラベル</Text>
</View>
```

### 6-6. 2時間かけて原因追究したCSS読み込み順の問題

#### 問題（ユーザーの実体験）

CSSの読み込み順が原因で、意図したスタイルが適用されず、2時間も原因追究に費やした。

#### 解決方法

**このガイドの「2. CSS読み込み順とスタイル優先度」を参照！**

重要なポイント：
1. `style`プロパティが最優先
2. 同じプロパティを複数のclassで指定した場合、後ろが優先
3. classNameとstyleを併用しない

---

## 7. アクセシビリティ

### 7-1. タップ可能な要素のサイズ

タップターゲットは最小**44x44pt**を確保してください：

```tsx
// ❌ 悪い例: 小さすぎる
<Pressable className="w-8 h-8">
  <Text>×</Text>
</Pressable>

// ✅ 良い例: 44x44pt以上
<Pressable className="w-11 h-11 items-center justify-center">
  <Text className="text-xl">×</Text>
</Pressable>
```

### 7-2. コントラスト比

テキストと背景のコントラスト比は**4.5:1以上**を確保してください：

```tsx
// ❌ 悪い例: 薄いグレーの背景に薄いテキスト
<View className="bg-gray-100">
  <Text className="text-gray-300">読みにくい</Text>
</View>

// ✅ 良い例: 十分なコントラスト
<View className="bg-white">
  <Text className="text-gray-900">読みやすい</Text>
</View>
```

### 7-3. accessibilityLabel

重要な要素には`accessibilityLabel`を設定：

```tsx
<Pressable
  className="bg-primary-500 p-3 rounded-full"
  accessibilityLabel="写真を撮影"
>
  <Text className="text-white">📷</Text>
</Pressable>
```

---

## 8. パフォーマンス

### 8-1. 不要な再レンダリングを避ける

classNameを動的に生成する場合、useMemoを使用：

```tsx
import { useMemo } from 'react';

const containerClass = useMemo(
  () => `p-4 ${isActive ? 'bg-primary-500' : 'bg-gray-200'}`,
  [isActive]
);

<View className={containerClass}>
```

### 8-2. 大量のリストアイテム

FlatListを使い、`className`は静的に保つ：

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View className="bg-white p-4 mb-2 rounded-lg">
      <Text className="text-gray-900">{item.title}</Text>
    </View>
  )}
  keyExtractor={(item) => item.id}
/>
```

---

## 9. まとめ

### 9-1. スタイリングの基本原則

1. **classNameを優先**: 基本的にTailwindCSSのclassNameを使う
2. **動的なスタイルのみstyle**: 計算された値やアニメーションのみstyleを使う
3. **併用しない**: 同じプロパティをclassNameとstyleの両方で指定しない
4. **読み込み順を意識**: 後ろのclassが優先されることを理解する
5. **カスタムカラーを活用**: tailwind.config.jsで定義したカラーを使う

### 9-2. 困ったときは

1. このガイドの「6. よくある問題と解決方法」を確認
2. `npx expo start --clear`でキャッシュクリア
3. `babel.config.js`と`tailwind.config.js`を確認
4. classNameとstyleの併用を確認

---

**このドキュメントは開発中に随時更新されます。**
