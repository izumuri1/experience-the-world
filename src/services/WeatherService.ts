/**
 * 天気情報取得サービス
 * OpenWeather APIを使用して天気情報を取得
 */

import { Weather } from '../types';
import { OPENWEATHER_API_KEY, OPENWEATHER_API_URL } from '../constants';

interface OpenWeatherResponse {
  weather: {
    main: string; // "Clear", "Clouds", "Rain", etc.
    description: string;
    icon: string;
  }[];
  main: {
    temp: number; // Kelvin
  };
}

class WeatherService {
  /**
   * 天気情報を取得
   * @param latitude 緯度
   * @param longitude 経度
   * @returns Weather情報、取得失敗時はnull
   */
  async appGetWeather(
    latitude: number,
    longitude: number
  ): Promise<Weather | null> {
    // APIキーが設定されていない場合はnullを返す
    if (!OPENWEATHER_API_KEY) {
      console.warn('OpenWeather API key is not set');
      return null;
    }

    try {
      const url = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error('OpenWeather API error:', response.status);
        return null;
      }

      const data: OpenWeatherResponse = await response.json();

      return {
        condition: data.weather[0].main,
        temperature: Math.round(data.main.temp), // 小数点以下を四捨五入
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      return null;
    }
  }

  /**
   * 天気アイコンのURLを取得
   * @param iconCode OpenWeatherのアイコンコード
   * @returns アイコンのURL
   */
  appGetWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

// シングルトンインスタンス
export const weatherService = new WeatherService();
