/**
 * 国コードから国名への変換マッピング
 * ISO 3166-1 alpha-2 コード対応
 */

export const COUNTRY_NAMES: Record<string, string> = {
  JP: '日本',
  US: 'アメリカ',
  GB: 'イギリス',
  FR: 'フランス',
  DE: 'ドイツ',
  IT: 'イタリア',
  ES: 'スペイン',
  CN: '中国',
  KR: '韓国',
  TW: '台湾',
  HK: '香港',
  TH: 'タイ',
  SG: 'シンガポール',
  MY: 'マレーシア',
  ID: 'インドネシア',
  PH: 'フィリピン',
  VN: 'ベトナム',
  IN: 'インド',
  AU: 'オーストラリア',
  NZ: 'ニュージーランド',
  CA: 'カナダ',
  MX: 'メキシコ',
  BR: 'ブラジル',
  AR: 'アルゼンチン',
  CL: 'チリ',
  PE: 'ペルー',
  RU: 'ロシア',
  AE: 'アラブ首長国連邦',
  SA: 'サウジアラビア',
  TR: 'トルコ',
  IL: 'イスラエル',
  EG: 'エジプト',
  ZA: '南アフリカ',
  KE: 'ケニア',
  NG: 'ナイジェリア',
  CH: 'スイス',
  AT: 'オーストリア',
  NL: 'オランダ',
  BE: 'ベルギー',
  SE: 'スウェーデン',
  NO: 'ノルウェー',
  DK: 'デンマーク',
  FI: 'フィンランド',
  PL: 'ポーランド',
  CZ: 'チェコ',
  HU: 'ハンガリー',
  GR: 'ギリシャ',
  PT: 'ポルトガル',
  IE: 'アイルランド',
  IS: 'アイスランド',
  HR: 'クロアチア',
  SI: 'スロベニア',
  EE: 'エストニア',
  LV: 'ラトビア',
  LT: 'リトアニア',
  RO: 'ルーマニア',
  BG: 'ブルガリア',
  UA: 'ウクライナ',
};

/**
 * 国コードから国名を取得
 * @param countryCode ISO 3166-1 alpha-2 国コード
 * @returns 日本語の国名。見つからない場合は国コードをそのまま返す
 */
export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
}

/**
 * 国コードから大陸を取得
 */
export function getContinent(countryCode: string): string {
  const code = countryCode.toUpperCase();

  // アジア
  if (['JP', 'CN', 'KR', 'TW', 'HK', 'TH', 'SG', 'MY', 'ID', 'PH', 'VN', 'IN'].includes(code)) {
    return 'アジア';
  }

  // ヨーロッパ
  if (['GB', 'FR', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI',
       'PL', 'CZ', 'HU', 'GR', 'PT', 'IE', 'IS', 'HR', 'SI', 'EE', 'LV', 'LT',
       'RO', 'BG', 'UA', 'RU'].includes(code)) {
    return 'ヨーロッパ';
  }

  // 北アメリカ
  if (['US', 'CA', 'MX'].includes(code)) {
    return '北アメリカ';
  }

  // 南アメリカ
  if (['BR', 'AR', 'CL', 'PE'].includes(code)) {
    return '南アメリカ';
  }

  // オセアニア
  if (['AU', 'NZ'].includes(code)) {
    return 'オセアニア';
  }

  // 中東
  if (['AE', 'SA', 'TR', 'IL'].includes(code)) {
    return '中東';
  }

  // アフリカ
  if (['EG', 'ZA', 'KE', 'NG'].includes(code)) {
    return 'アフリカ';
  }

  return '';
}
