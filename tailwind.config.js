/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      // プライマリカラー（メイン背景色: #3388ff ベース）
      primary: {
        50: '#e6f2ff',
        100: '#cce5ff',
        200: '#99ccff',
        300: '#66b3ff',
        400: '#3399ff',
        500: '#3388ff', // メインカラー
        600: '#0066ff',
        700: '#0055cc',
        800: '#004499',
        900: '#003366',
      },
      // セカンダリカラー（サブカラー: #ffc107 ベース）
      secondary: {
        50: '#fff9e6',
        100: '#fff3cc',
        200: '#ffe799',
        300: '#ffdb66',
        400: '#ffcf33',
        500: '#ffc107', // サブカラー
        600: '#cc9a06',
        700: '#997405',
        800: '#664d03',
        900: '#332602',
      },
      // グレースケール（テキスト・補助色）
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
    },
  },
  plugins: [],
}

